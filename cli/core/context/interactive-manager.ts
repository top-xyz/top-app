import { VertexAIClient } from '../utils/vertex-ai.js';
import { db, Project, ChatMessage, ProjectContext } from '../db/sqlite.js';
import chalk from 'chalk';
import ora, { Ora } from 'ora';

export class InteractiveManager {
  private ai: VertexAIClient;
  private currentProject: Project | null = null;
  private spinner: Ora;
  private initialContext: {
    name?: string;
    goals?: string;
  } = {};

  constructor() {
    this.ai = new VertexAIClient();
    this.spinner = ora({
      spinner: 'dots',
      color: 'cyan',
      text: 'Thinking...'
    });
  }

  async startProjectCreation(name: string): Promise<void> {
    try {
      this.spinner.start('Setting up your project...');
      this.initialContext.name = name;
      
      // Create project in database without LLM interaction yet
      this.currentProject = db.createProject(name);
      
      this.spinner.succeed('Project created successfully!');
    } catch (error) {
      this.spinner.fail('Failed to create project');
      console.error('Error starting project:', error);
      throw error;
    }
  }

  async setProjectGoals(goals: string): Promise<void> {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    this.initialContext.goals = goals;
    
    // Now that we have both name and goals, we can start LLM interaction
    await this.initializeProjectContext();
  }

  private async initializeProjectContext(): Promise<void> {
    if (!this.currentProject || !this.initialContext.name || !this.initialContext.goals) {
      throw new Error('Missing required project information');
    }

    try {
      this.spinner.start('Processing project information...');

      // Add initial system message
      db.addChatMessage(
        this.currentProject.id,
        'system',
        'You are a helpful AI assistant guiding the user through project creation.'
      );

      // Generate embeddings for combined initial context
      const initialContextText = `Project Name: ${this.initialContext.name}\nProject Goals: ${this.initialContext.goals}`;
      const embeddings = await this.generateEmbeddings(initialContextText);
      
      // Store initial context
      db.addProjectContext(
        this.currentProject.id,
        'project_info',
        initialContextText,
        embeddings,
        'vision',
        3,
        {
          name: this.initialContext.name,
          goals: this.initialContext.goals
        }
      );

      this.spinner.succeed('Project context initialized');
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && error.message.includes('429 Too Many Requests')) {
        console.warn('Rate limit reached, using fallback embeddings');
        // Continue with fallback embeddings
        return Array(512).fill(0).map(() => Math.random());
      } else {
        throw error;
      }
    }
  }

  async handleUserInput(input: string, stage: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    try {
      this.spinner.start('Processing your input...');

      // Store user message
      db.addChatMessage(
        this.currentProject.id,
        'user',
        input
      );

      // Generate embeddings for user input
      const inputEmbeddings = await this.generateEmbeddings(input);
      
      // Get relevant contexts from different categories with different priorities
      const relevantContexts = [
        // High priority vision/strategy contexts
        ...db.searchSimilarContexts(this.currentProject.id, inputEmbeddings, {
          category: 'vision',
          minPriority: 2,
          limit: 3
        }),
        // Technical requirements
        ...db.searchSimilarContexts(this.currentProject.id, inputEmbeddings, {
          category: 'technical',
          limit: 5
        }),
        // Marketing insights
        ...db.searchSimilarContexts(this.currentProject.id, inputEmbeddings, {
          category: 'marketing',
          limit: 3
        }),
        // User research/feedback
        ...db.searchSimilarContexts(this.currentProject.id, inputEmbeddings, {
          category: 'user_research',
          limit: 3
        }),
        // General context
        ...db.searchSimilarContexts(this.currentProject.id, inputEmbeddings, {
          category: 'general',
          includeRelated: true,
          limit: 5
        })
      ];

      // Get recent chat history
      const chatHistory = db.getProjectMessages(this.currentProject.id)
        .slice(-5); // Only use last 5 messages for context

      // Generate AI response with enhanced context
      const response = await this.ai.generateContent({
        prompt: this.buildPrompt(input, stage, relevantContexts, chatHistory),
        context: 'project_creation',
        type: 'interactive'
      });

      // Store AI response
      const messageContext = db.addChatMessage(
        this.currentProject.id,
        'assistant',
        response
      );

      // Generate embeddings for response and store as context
      const responseEmbeddings = await this.generateEmbeddings(response);
      
      // Store response context with metadata about the stage
      const responseContext = db.addProjectContext(
        this.currentProject.id,
        'ai_response',
        response,
        responseEmbeddings,
        this.getCategoryForStage(stage),
        this.getPriorityForStage(stage),
        {
          stage,
          source_message: messageContext.id,
          context_count: relevantContexts.length
        }
      );

      // Create relationships between this context and the relevant contexts used
      for (const context of relevantContexts) {
        db.addContextRelationship(
          responseContext.id,
          context.id,
          'informed_by',
          this.calculateRelationshipStrength(context, input)
        );
      }

      // Generate contextually aware suggestions
      const suggestions = await this.generateSuggestions(stage, chatHistory);

      this.spinner.stop();

      return {
        response,
        suggestions,
        nextStage: this.determineNextStage(stage, input, response)
      };

    } catch (error) {
      this.spinner.stop();
      console.error('Error handling input:', error);
      throw error;
    }
  }

  private getCategoryForStage(stage: string): string {
    const categoryMap: Record<string, string> = {
      'project_name': 'vision',
      'problem_statement': 'vision',
      'target_audience': 'marketing',
      'key_features': 'technical',
      'unique_value': 'marketing',
      'technical_requirements': 'technical',
      'next_steps': 'general'
    };
    return categoryMap[stage] || 'general';
  }

  private getPriorityForStage(stage: string): number {
    const priorityMap: Record<string, number> = {
      'project_name': 3,
      'problem_statement': 3,
      'target_audience': 2,
      'key_features': 2,
      'unique_value': 2,
      'technical_requirements': 2,
      'next_steps': 1
    };
    return priorityMap[stage] || 1;
  }

  private calculateRelationshipStrength(context: ProjectContext, input: string): number {
    // Base strength on context priority and category
    let strength = context.priority * 0.2;

    // Boost strength for same-category contexts
    if (context.category === this.getCategoryForStage(context.type)) {
      strength += 0.3;
    }

    // Cap strength between 0 and 1
    return Math.min(Math.max(strength, 0), 1);
  }

  private buildPrompt(
    input: string,
    stage: string,
    contexts: ProjectContext[],
    history: ChatMessage[]
  ): string {
    // Group contexts by category for better organization
    const contextsByCategory = contexts.reduce((acc, ctx) => {
      if (!acc[ctx.category]) {
        acc[ctx.category] = [];
      }
      acc[ctx.category].push(ctx);
      return acc;
    }, {} as Record<string, ProjectContext[]>);

    // Build context string with category headers
    const contextStr = Object.entries(contextsByCategory)
      .map(([category, contexts]) => {
        const categoryHeader = category.toUpperCase().replace('_', ' ');
        const contextContent = contexts
          .map((ctx, index) => {
            const relevanceWeight = 1 - (index * 0.2);
            const metadata = JSON.parse(ctx.metadata || '{}');
            return `[Relevance: ${relevanceWeight.toFixed(1)}${metadata.stage ? `, Stage: ${metadata.stage}` : ''}] ${ctx.content}`;
          })
          .join('\n');
        return `=== ${categoryHeader} ===\n${contextContent}`;
      })
      .join('\n\n');

    // Format history with roles for better context
    const historyStr = history
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    return `Current stage: ${stage}

Previous relevant context:
${contextStr}

Recent conversation history:
${historyStr}

Current user input: ${input}

Instructions:
1. Consider all context categories (vision, technical, marketing, etc.)
2. Provide a helpful response that guides the user
3. Focus on gathering specific, actionable information
4. Be concise but friendly
5. Maintain context continuity with previous responses
6. Consider relationships between different aspects of the project

Response format:
- Keep responses under 3-4 sentences
- Use bullet points for multiple items
- Ask follow-up questions if needed
- Reference relevant context when appropriate`;
  }

  private async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await this.ai.generateContent({
        prompt: text,
        context: 'embeddings',
        type: 'embedding'
      });

      // Parse the embeddings from the response
      try {
        return JSON.parse(response);
      } catch {
        console.warn('Failed to parse embeddings, using fallback');
        return Array(512).fill(0).map(() => Math.random());
      }
    } catch (error) {
      console.warn('Failed to generate embeddings:', error);
      return Array(512).fill(0).map(() => Math.random());
    }
  }

  private async generateSuggestions(
    stage: string,
    history: ChatMessage[]
  ): Promise<string[]> {
    // Get embeddings for the current stage
    const stageEmbeddings = await this.generateEmbeddings(stage);
    
    // Find relevant contexts for suggestions
    const relevantContexts = db.searchSimilarContexts(
      this.currentProject!.id,
      stageEmbeddings,
      {
        limit: 2,
        category: 'general',
        includeRelated: true
      }
    );

    const response = await this.ai.generateContent({
      prompt: `Based on:
1. Current stage: ${stage}
2. Recent history:
${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
3. Relevant context:
${relevantContexts.map(ctx => ctx.content).join('\n')}

Generate 2-3 focused suggestions for what information we should gather next.
Each suggestion should:
- Be specific and actionable
- Help us better understand the project
- Build on previous context
- Not repeat previous questions

Format as a JSON array of strings.`,
      context: 'suggestions',
      type: 'interactive'
    });

    try {
      return JSON.parse(response);
    } catch {
      return [response];
    }
  }

  private determineNextStage(stage: string, input: string, response: string): string {
    // Simple stage progression
    const stages = [
      'project_name',
      'problem_statement',
      'target_audience',
      'key_features',
      'unique_value',
      'technical_requirements',
      'next_steps'
    ];

    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    return 'complete';
  }

  formatResponse(response: string): string {
    return chalk.cyan(response);
  }

  formatSuggestions(suggestions: string[]): string {
    return suggestions
      .map((suggestion, i) => chalk.yellow(`${i + 1}. ${suggestion}`))
      .join('\n');
  }
} 
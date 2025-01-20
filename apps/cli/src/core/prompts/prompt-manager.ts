import { VertexAIClient } from '../../utils/vertex-ai';
import { ProjectInitialContext, GeneratedPrompt } from '../../types';
import { Logger } from '../../utils/logger';
import { debug } from '../../utils/debug';
import { getInitialPromptsPrompt } from './templates/initial';
import { getFollowUpPromptsPrompt } from './templates/follow-up';
import { getDocumentationPlanPrompt, getDocumentGenerationPrompt } from './templates/documentation';
import { detectProjectType, ProjectType } from './templates/project-types/detector';
import { ContextManager } from '../context/context-manager';
import { EnhancedPromptResponse } from '../../types/context';

interface GeneratedQuestion {
  id: string;
  question: string;
  type: 'vision' | 'technical' | 'user' | 'business';
  required: boolean;
  systemFields?: Record<string, any>;
  rationale?: string;
}

export class PromptManager {
  private ai: VertexAIClient;
  private logger: Logger;
  private contextManager: ContextManager;
  private currentProjectType: ProjectType | null = null;

  constructor(contextManager: ContextManager) {
    debug('PromptManager', 'Initializing PromptManager');
    this.ai = new VertexAIClient();
    this.logger = new Logger();
    this.contextManager = contextManager;
  }

  async generateInitialPrompts(context: ProjectInitialContext): Promise<{
    required: GeneratedPrompt[];
    optional: GeneratedPrompt[];
  }> {
    debug('PromptManager', 'Generating initial prompts for context:', context);
    
    // Get full context including insights and system metadata
    const enhancedContext = {
      ...context,
      insights: await this.contextManager.getInsights(),
      systemContext: await this.contextManager.getSystemContext()
    };
    
    debug('PromptManager', 'Enhanced context for prompt generation:', enhancedContext);

    try {
      // Generate prompts with enriched context
      const response = await this.ai.generateContent({
        prompt: await getInitialPromptsPrompt(enhancedContext),
        type: 'structured',
        temperature: 0.7
      });

      debug('PromptManager', 'Raw AI response:', response);

      // Handle different response formats
      let questions: any[] = [];
      if (typeof response === 'object' && response !== null) {
        if (Array.isArray(response)) {
          questions = response;
        } else if (Array.isArray(response.questions)) {
          questions = response.questions;
        } else if (response.content && Array.isArray(response.content.questions)) {
          questions = response.content.questions;
        } else {
          debug('PromptManager', 'Unexpected response structure:', response);
          throw new Error('Invalid response format from AI - could not find questions array');
        }
      } else {
        throw new Error('Invalid response format from AI - expected object or array');
      }
      
      // Map question types to valid GeneratedPrompt types
      const mapQuestionType = (type: string): 'vision' | 'technical' | 'user' | 'business' => {
        const typeMap: Record<string, 'vision' | 'technical' | 'user' | 'business'> = {
          'innovation': 'vision',
          'experience': 'vision',
          'delight': 'vision',
          'core': 'technical',
          'interface': 'technical',
          'workflow': 'technical',
          'objectives': 'vision',
          'engagement': 'user',
          'constraints': 'technical',
          'monitoring': 'technical',
          'assessment': 'user'
        };
        return typeMap[type] || type as 'vision' | 'technical' | 'user' | 'business';
      };

      // Split questions into required and optional
      const required = questions
        .filter(q => q.required)
        .map(q => ({
          id: q.id || `q${Math.random().toString(36).substr(2, 9)}`,
          question: q.question,
          type: mapQuestionType(q.type),
          required: true,
          systemFields: q._analysis || q.systemFields,
          rationale: q.rationale || q._analysis?.purpose
        }));

      const optional = questions
        .filter(q => !q.required)
        .map(q => ({
          id: q.id || `q${Math.random().toString(36).substr(2, 9)}`,
          question: q.question,
          type: mapQuestionType(q.type),
          required: false,
          systemFields: q._analysis || q.systemFields,
          rationale: q.rationale || q._analysis?.purpose
        }));

      debug('PromptManager', 'Processed questions:', { required, optional });
      return { required, optional };
    } catch (error) {
      debug('PromptManager', 'Error generating prompts:', error);
      throw error;
    }
  }

  async generateFollowUpPrompts(context: ProjectInitialContext): Promise<GeneratedPrompt[]> {
    try {
      debug('PromptManager', 'Generating follow-up prompts for context:', context);
      const prompt = getFollowUpPromptsPrompt(context);
      const response = await this.ai.generateContent({ prompt });
      const prompts = JSON.parse(response) as EnhancedPromptResponse;
      
      // Process each question through context manager
      prompts.questions.forEach(q => {
        this.contextManager.processResponse(q.id, q.question, '');
      });
      
      debug('PromptManager', 'Generated follow-up prompts:', prompts);
      return prompts.questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        required: q.required
      }));
    } catch (error) {
      this.logger.error('Error generating follow-up prompts:', error);
      throw error;
    }
  }

  async generateDocumentationPlan(context: ProjectInitialContext) {
    try {
      debug('PromptManager', 'Generating documentation plan for context:', context);
      
      // Use project type's documentation types if available
      if (this.currentProjectType) {
        debug('PromptManager', 'Using documentation types from project type:', 
          this.currentProjectType.documentationTypes);
        
        // Get full context for documentation
        const enhancedContext = {
          ...context,
          projectType: this.currentProjectType.type,
          documentationTypes: this.currentProjectType.documentationTypes,
          systemContext: this.contextManager.getSystemContext()
        };
        
        const prompt = getDocumentationPlanPrompt(enhancedContext);
        const plan = await this.ai.generateDocumentationPlan(enhancedContext);
        debug('PromptManager', 'Generated documentation plan:', plan);
        return plan;
      }
      
      // Fallback to default documentation plan
      const prompt = getDocumentationPlanPrompt(context);
      const plan = await this.ai.generateDocumentationPlan(context);
      debug('PromptManager', 'Generated documentation plan:', plan);
      return plan;
    } catch (error) {
      this.logger.error('Error generating documentation plan:', error);
      throw error;
    }
  }

  async generateDocument(template: string, context: ProjectInitialContext, type: string): Promise<string> {
    try {
      debug('PromptManager', 'Generating document for type:', type);
      
      // Get full context including system context and relationship graph
      const enhancedContext = {
        ...context,
        projectType: this.currentProjectType?.type,
        systemContext: this.contextManager.getSystemContext(),
        relationshipGraph: this.contextManager.getRelationshipGraph()
      };
      
      const prompt = getDocumentGenerationPrompt(enhancedContext, template, type);
      const document = await this.ai.generateDocument(template, enhancedContext, type);
      debug('PromptManager', 'Generated document length:', document.length);
      return document;
    } catch (error) {
      this.logger.error('Error generating document:', error);
      throw error;
    }
  }

  async generateInsights(context: ProjectInitialContext): Promise<any> {
    debug('PromptManager', 'Generating insights with context:', context);

    try {
      // Get full context including insights and system metadata
      const enhancedContext = {
        ...context,
        insights: await this.contextManager.getInsights(),
        systemContext: await this.contextManager.getSystemContext()
      };

      const prompt = getInsightsPrompt(enhancedContext);
      debug('PromptManager', 'Using insights prompt:', prompt);

      const response = await this.ai.generateContent({
        prompt,
        type: 'structured',
        temperature: 0.3 // Lower temperature for more consistent results
      });

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from AI - expected object');
      }

      // Validate insights against expected categories
      const categories = insightCategories[context.type] || insightCategories.innovative;
      const validatedInsights: Record<string, string[]> = {};

      for (const category of categories) {
        const insights = response[category.key];
        if (category.required && (!Array.isArray(insights) || insights.length === 0)) {
          debug('PromptManager', `Missing required insights for category: ${category.key}`);
          validatedInsights[category.key] = [`No ${category.label.toLowerCase()} identified yet`];
        } else if (Array.isArray(insights)) {
          validatedInsights[category.key] = insights;
        }
      }

      return validatedInsights;
    } catch (error) {
      debug('PromptManager', 'Error generating insights:', error);
      throw error;
    }
  }

  // Method to handle user responses and update context
  async processUserResponse(questionId: string, question: string, response: string) {
    await this.contextManager.processResponse(questionId, question, response);
  }
} 
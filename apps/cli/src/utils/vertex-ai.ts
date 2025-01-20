import { VertexAI } from '@google-cloud/vertexai';
import { debug } from './debug';
import { Logger } from './logger';
import config from '../config';
import { GeneratedPrompt, ProjectInitialContext, DocumentGenerationPlan } from '../types';
import chalk from 'chalk';

interface ProjectContextParams {
  name: string;
  type: string;
  timestamp: string;
}

interface DocsStructureParams {
  name: string;
  type: string;
  context: any;
}

interface GenerateContentParams {
  prompt: string;
  context?: string;
  type?: string;
}

export class VertexAIClient {
  private vertexai: VertexAI;
  private logger: Logger;
  private model = 'gemini-pro';
  private project: string;
  private location: string;
  private initialized: boolean = false;

  constructor() {
    debug('VertexAI', 'Initializing VertexAI client');
    this.logger = new Logger();
    this.project = process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    debug('VertexAI', 'Using project:', this.project);
    debug('VertexAI', 'Using location:', this.location);

    if (!this.project) {
      throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required');
    }

    try {
      debug('VertexAI', 'Creating VertexAI instance');
      this.vertexai = new VertexAI({
        project: this.project,
        location: this.location
      });
      this.initialized = true;
      debug('VertexAI', 'VertexAI client initialized successfully');
    } catch (error) {
      debug('VertexAI', 'Failed to initialize VertexAI client:', error);
      this.logger.error('Failed to initialize VertexAI client:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private checkInitialized() {
    if (!this.initialized) {
      throw new Error('VertexAI client not initialized');
    }
  }

  async generateContent(params: GenerateContentParams | string): Promise<string> {
    this.checkInitialized();

    try {
      const prompt = typeof params === 'string' ? params : params.prompt;
      const context = typeof params === 'string' ? undefined : params.context;
      const type = typeof params === 'string' ? undefined : params.type;

      const model = this.vertexai.preview.getGenerativeModel({
        model: this.model,
        generation_config: {
          max_output_tokens: 2048,
          temperature: 0.2,
          top_p: 0.8,
          top_k: 40
        }
      });

      const promptWithContext = context ? `${context}\n\n${prompt}` : prompt;
      const result = await model.generateContent(promptWithContext);
      const response = result.response;
      
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No response generated');
      }

      return response.candidates[0].content.parts[0].text || '';
    } catch (error) {
      this.logger.error('Error generating content:', error);
      throw error;
    }
  }

  async generateProjectContext(params: ProjectContextParams) {
    this.checkInitialized();
    
    try {
      const prompt = `Create a project context for ${params.name} of type ${params.type}`;
      return await this.generateContent(prompt);
    } catch (error) {
      this.logger.error('Error generating project context:', error);
      throw error;
    }
  }

  async generateDocsStructure(params: DocsStructureParams) {
    this.checkInitialized();
    
    try {
      const prompt = `Generate documentation structure for ${params.name} of type ${params.type}`;
      return await this.generateContent(prompt);
    } catch (error) {
      this.logger.error('Error generating docs structure:', error);
      throw error;
    }
  }

  async generateMarketingContent(type: string, context: any) {
    const prompt = `Generate ${type} content for the project based on the following context.
Make it compelling, professional, and aligned with the project goals.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and styling.`;

    return this.generateContent(prompt);
  }

  async generateInvestmentContent(type: string, context: any) {
    const prompt = `Generate ${type} content for investment purposes based on the following context.
Focus on key metrics, market opportunity, and growth potential.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and styling.
Include relevant financial projections and market analysis.`;

    return this.generateContent(prompt);
  }

  async generateTechnicalContent(type: string, context: any) {
    const prompt = `Generate ${type} technical documentation based on the following context.
Include detailed specifications, architecture diagrams, and implementation guidelines.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and code examples.
Use TypeScript interfaces and code snippets where relevant.`;

    return this.generateContent(prompt);
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const model = this.vertexai.preview.getGenerativeModel({
        model: 'embedding-gecko-001'
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text }] }]
      });

      const response = result.response;
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No embeddings generated');
      }

      // Parse embeddings from the response
      const embeddings = response.candidates[0].content.parts[0].text;
      if (!embeddings) {
        throw new Error('Empty embeddings response');
      }
      
      try {
        return JSON.parse(embeddings);
      } catch {
        throw new Error('Failed to parse embeddings response');
      }
    } catch (error) {
      this.logger.error('Error generating embeddings:', error);
      throw error;
    }
  }

  async generateInitialPrompts(context: ProjectInitialContext): Promise<GeneratedPrompt[]> {
    const prompt = `Given a project named "${context.name}" with the following goals:
${context.goals}

Generate 3-5 essential questions that will help clarify the project vision and requirements.
Each question should be targeted and help build a comprehensive understanding of the project.

IMPORTANT: Return ONLY a JSON array of questions, with no markdown or other formatting.
Each question object in the array should have:
- id: unique identifier (string)
- question: the actual question text (string)
- type: one of 'vision', 'technical', 'user', or 'business' (string)
- required: true (boolean, these are initial required questions)

Example format:
[
  {
    "id": "q1",
    "question": "What is the target audience?",
    "type": "vision",
    "required": true
  }
]

Make questions specific and contextual to the project goals.`;

    try {
      debug('VertexAI', 'Generating initial prompts with prompt:', prompt);
      const response = await this.generateContent(prompt);
      debug('VertexAI', 'Got response:', response);
      
      // Try to find a JSON array in the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as GeneratedPrompt[];
        } catch (error) {
          debug('VertexAI', 'Failed to parse matched JSON:', error);
        }
      }
      
      // If no valid JSON found, create a default set of questions
      debug('VertexAI', 'Using fallback questions');
      return [
        {
          id: 'q1',
          question: 'Who is the target audience for this project?',
          type: 'vision',
          required: true
        },
        {
          id: 'q2',
          question: 'What are the key technical features needed?',
          type: 'technical',
          required: true
        },
        {
          id: 'q3',
          question: 'What are the main user experience goals?',
          type: 'user',
          required: true
        }
      ];
    } catch (error) {
      this.logger.error('Error generating initial prompts:', error);
      throw error;
    }
  }

  async generateFollowUpPrompts(context: ProjectInitialContext): Promise<GeneratedPrompt[]> {
    const prompt = `Based on the project context:
Name: ${context.name}
Goals: ${context.goals}
Previous Responses: ${JSON.stringify(context.responses, null, 2)}

Generate 2-3 follow-up questions that would help clarify any remaining aspects.
These should be optional but valuable questions based on the previous responses.

Format as JSON array with the same structure as initial prompts, but set required: false.
Focus on areas that need more clarity or could add value to the project documentation.`;

    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response) as GeneratedPrompt[];
    } catch (error) {
      this.logger.error('Error generating follow-up prompts:', error);
      throw error;
    }
  }

  async generateDocumentationPlan(context: ProjectInitialContext): Promise<DocumentGenerationPlan> {
    const prompt = `Based on the complete project context:
${JSON.stringify(context, null, 2)}

Generate a comprehensive documentation plan that covers all aspects of the project.
Consider the project type, goals, and all responses provided.

IMPORTANT: Return ONLY a JSON object with no markdown or other formatting.
The response must be a valid DocumentGenerationPlan with this exact structure:
{
  "templates": ["engineering", "design", "marketing", "sales", "brainstorm"],
  "structure": {
    "root": "docs",
    "sections": {
      "engineering": ["architecture", "api", "setup"],
      "design": ["ui", "ux", "components"],
      "marketing": ["overview", "features", "benefits"],
      "sales": ["pricing", "comparison", "roi"],
      "brainstorm": ["ideas", "future", "notes"]
    }
  },
  "metadata": {
    "projectType": "string",
    "complexity": "string",
    "priority": "string"
  }
}

Make the plan specific to the project context while keeping the exact JSON structure.`;

    try {
      debug('VertexAI', 'Generating documentation plan with prompt:', prompt);
      const response = await this.generateContent(prompt);
      debug('VertexAI', 'Got response:', response);
      
      // Try to find a JSON object in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as DocumentGenerationPlan;
        } catch (error) {
          debug('VertexAI', 'Failed to parse matched JSON:', error);
          throw error;
        }
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      this.logger.error('Error generating documentation plan:', error);
      throw error;
    }
  }

  async generateDocument(template: string, context: ProjectInitialContext, type: string): Promise<string> {
    const prompt = `Generate a markdown document for ${context.name} of type "${type}".
Use the following context to generate comprehensive and specific content:
${JSON.stringify(context, null, 2)}

Use this template structure:
${template}

Requirements:
1. Return ONLY markdown content, no JSON or other formatting
2. Include all sections from the template
3. Replace all placeholders (e.g. {project_name}, {architecture_overview}) with generated content
4. Be specific to the project context
5. Include relevant technical details, examples, or diagrams as needed
6. Use proper markdown formatting (headers, lists, code blocks, etc.)`;

    try {
      debug('VertexAI', 'Generating document with prompt:', prompt);
      const response = await this.generateContent({
        prompt,
        type: 'document',
        context: JSON.stringify(context.responses)
      });
      debug('VertexAI', 'Generated document length:', response.length);
      
      // Ensure response starts with markdown
      if (!response.trim().startsWith('#')) {
        debug('VertexAI', 'Response does not start with markdown, extracting...');
        const markdownMatch = response.match(/(?:^|\n)#[\s\S]*$/);
        if (markdownMatch) {
          return markdownMatch[0].trim();
        }
        throw new Error('No valid markdown found in response');
      }
      
      return response;
    } catch (error) {
      this.logger.error('Error generating document:', error);
      throw error;
    }
  }
} 
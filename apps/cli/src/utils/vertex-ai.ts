import { VertexAI } from '@google-cloud/vertexai';
import { debug } from './debug';
import { Logger } from './logger';
import config from '../config';
import { GeneratedPrompt, ProjectInitialContext, DocumentGenerationPlan } from '../types';
import { getResponsePrompt } from '../core/prompts/templates/response';
import { getInitialPromptsPrompt } from '../core/prompts/templates/initial';
import { getFollowUpPromptsPrompt } from '../core/prompts/templates/follow-up';
import { getDocumentationPlanPrompt, getDocumentGenerationPrompt } from '../core/prompts/templates/documentation';
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

interface GenerateContentOptions {
  prompt: string;
  context?: string;
  history?: Array<{ role: string; content: string }>;
  type?: string;
  temperature?: number;
  maxTokens?: number;
}

interface VertexError extends Error {
  message: string;
  stack_trace?: string;
}

interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export class VertexAIClient {
  private vertexai: VertexAI;
  private logger: Logger;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private project: string;
  private location: string;
  private initialized: boolean = false;
  private requestQueue: Promise<any> = Promise.resolve();
  private lastRequestTime: number = 0;
  private readonly minRequestInterval = 1000; // Minimum 1 second between requests
  private retryConfig: RetryConfig;

  constructor(model = 'gemini-pro', temperature = 0.7, maxTokens = 1024, project?: string, location?: string) {
    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
    this.project = project || process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = location || process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    if (!this.project) {
      throw new Error('Google Cloud project ID is required');
    }

    debug('VertexAI', 'Initialized client:', { model, temperature, maxTokens });
    this.vertexai = new VertexAI({project: this.project, location: this.location});
    this.initialized = true;
    this.logger = new Logger();

    this.retryConfig = {
      maxRetries: 5,
      initialDelayMs: 1000,
      maxDelayMs: 32000,
      backoffMultiplier: 2
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private checkInitialized() {
    if (!this.initialized) {
      throw new Error('VertexAI client not initialized');
    }
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
  ): Promise<T> {
    let retries = 0;
    
    while (true) {
      try {
        return await operation();
      } catch (error: any) {
        if (error?.message?.includes('429 Too Many Requests') && retries < maxRetries) {
          retries++;
          const delay = initialDelay * Math.pow(2, retries - 1);
          debug('VertexAI', `Rate limited, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }

  private async enqueueRequest<T>(operation: () => Promise<T>): Promise<T> {
    this.requestQueue = this.requestQueue.then(async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minRequestInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
        );
      }
      
      this.lastRequestTime = Date.now();
      return operation();
    });
    
    return this.requestQueue;
  }

  private getPromptForType(params: GenerateContentParams): string {
    const { prompt, context, type } = params;
    
    switch (type) {
      case 'response':
        return getResponsePrompt(prompt);
        
      case 'document':
        return context ? `${prompt}\nContext: ${context}` : prompt;
        
      default:
        return typeof params === 'string' ? params : params.prompt;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoff(retryAttempt: number): number {
    const delay = Math.min(
      this.retryConfig.maxDelayMs,
      this.retryConfig.initialDelayMs * Math.pow(this.retryConfig.backoffMultiplier, retryAttempt)
    );
    // Add jitter to prevent thundering herd
    return delay * (0.8 + Math.random() * 0.4);
  }

  private isRateLimitError(error: any): boolean {
    return error?.message?.includes('429') || 
           error?.message?.includes('Too Many Requests') ||
           error?.message?.includes('RESOURCE_EXHAUSTED');
  }

  private cleanJsonResponse(text: string): string {
    debug('VertexAI', 'Cleaning JSON response:', text);
    
    // Remove markdown code blocks
    let cleaned = text.replace(/^```[a-z]*\n|\n```$/g, '');
    
    // Clean up common JSON formatting issues
    cleaned = cleaned
      .replace(/[\u201C\u201D]/g, '"')      // Replace curly quotes
      .replace(/[\u2018\u2019]/g, "'")      // Replace curly apostrophes
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Add quotes to unquoted keys
      .replace(/:\s*'([^']*)'/g, ':"$1"')   // Replace single quotes with double quotes
      .replace(/,(\s*[}\]])/g, '$1')        // Remove trailing commas
      .replace(/\n/g, ' ')                  // Remove newlines
      .replace(/\s+/g, ' ')                 // Normalize whitespace
      .trim();
      
    debug('VertexAI', 'Cleaned JSON:', cleaned);
    return cleaned;
  }

  private tryParseJson(text: string): any {
    // If response looks like it contains JSON
    if (text.includes('{') || text.includes('[') || text.includes('```json')) {
      try {
        // First try direct parse
        return JSON.parse(text);
      } catch (parseError) {
        // Clean and try again
        const cleaned = this.cleanJsonResponse(text);
        try {
          return JSON.parse(cleaned);
        } catch (cleanedError) {
          // Try to extract JSON
          const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
      }
    }
    return text;
  }

  async generateContent(options: GenerateContentOptions): Promise<string> {
    this.checkInitialized();
    const { prompt, context, history = [], type = 'text', temperature = this.temperature, maxTokens = this.maxTokens } = options;
    let retryAttempt = 0;

    while (true) {
      try {
        const model = this.vertexai.preview.getGenerativeModel({
          model: this.model,
          generation_config: {
            max_output_tokens: maxTokens,
            temperature: temperature
          }
        });

        // Add explicit instructions to avoid markdown
        const enhancedPrompt = type === 'structured' 
          ? `${prompt}\n\nIMPORTANT: Return ONLY raw JSON without any markdown formatting or code blocks.`
          : prompt;

        // Construct messages array with proper formatting
        const messages = [
          // System message if context provided
          ...(context ? [{
            role: 'system',
            parts: [{
              text: `Context: ${context}`
            }]
          }] : []),
          // Previous conversation history
          ...history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          // Current user prompt
          {
            role: 'user',
            parts: [{ 
              text: enhancedPrompt
            }]
          }
        ];

        try {
          // Generate content with proper error handling
          const result = await model.generateContent({
            contents: messages
          });

          if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format from Vertex AI');
          }

          const text = result.response.candidates[0].content.parts[0].text;
          
          // Handle structured output
          if (type === 'structured') {
            try {
              // First try direct parse
              return JSON.parse(text);
            } catch (parseError) {
              debug('VertexAI', 'Direct JSON parse failed, attempting cleanup');
              // Clean and try again
              const cleaned = this.cleanJsonResponse(text);
              try {
                return JSON.parse(cleaned);
              } catch (cleanedError) {
                debug('VertexAI', 'Failed to parse cleaned JSON:', cleanedError);
                return {};
              }
            }
          }
          
          return text;

        } catch (error) {
          if (this.isRateLimitError(error)) {
            if (retryAttempt >= this.retryConfig.maxRetries) {
              debug('VertexAI', 'Max retries exceeded for rate limit:', error);
              throw new Error(`Rate limit exceeded after ${this.retryConfig.maxRetries} retries. Please try again later.`);
            }

            const backoffMs = this.calculateBackoff(retryAttempt);
            debug('VertexAI', `Rate limit hit, retrying in ${backoffMs}ms (attempt ${retryAttempt + 1}/${this.retryConfig.maxRetries})`);
            
            await this.sleep(backoffMs);
            retryAttempt++;
            continue;
          }

          debug('VertexAI', 'Error generating content:', error);
          
          const vertexError = error as VertexError;
          if (vertexError.message?.includes('authentication') || vertexError.stack_trace?.includes('authentication')) {
            throw new Error('Authentication failed. Please check your credentials and permissions.');
          }
          
          throw new Error('Failed to generate response: ' + vertexError.message);
        }

      } catch (error) {
        debug('VertexAI', 'Error in generateContent:', error);
        throw error;
      }
    }
  }

  async generateProjectContext(params: ProjectContextParams) {
    this.checkInitialized();
    
    try {
      const prompt = `Create a project context for ${params.name} of type ${params.type}`;
      return await this.generateContent({ prompt });
    } catch (error) {
      this.logger.error('Error generating project context:', error);
      throw error;
    }
  }

  async generateDocsStructure(params: DocsStructureParams) {
    this.checkInitialized();
    
    try {
      const prompt = `Generate documentation structure for ${params.name} of type ${params.type}`;
      return await this.generateContent({ prompt });
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

    return this.generateContent({ prompt });
  }

  async generateInvestmentContent(type: string, context: any) {
    const prompt = `Generate ${type} content for investment purposes based on the following context.
Focus on key metrics, market opportunity, and growth potential.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and styling.
Include relevant financial projections and market analysis.`;

    return this.generateContent({ prompt });
  }

  async generateTechnicalContent(type: string, context: any) {
    const prompt = `Generate ${type} technical documentation based on the following context.
Include detailed specifications, architecture diagrams, and implementation guidelines.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and code examples.
Use TypeScript interfaces and code snippets where relevant.`;

    return this.generateContent({ prompt });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    debug('VertexAI', 'Generating embedding for text:', text);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock embedding
      const embedding = Array(512).fill(0).map(() => Math.random());
      debug('VertexAI', 'Generated embedding of length:', embedding.length);
      
      return embedding;
    } catch (error) {
      debug('VertexAI', 'Error generating embedding:', error);
      throw error;
    }
  }

  async generateInitialPrompts(context: ProjectInitialContext): Promise<{
    required: GeneratedPrompt[];
    optional: GeneratedPrompt[];
  }> {
    try {
      const response = await this.generateContent({
        prompt: `Generate questions to gather requirements for project "${context.name}":
${context.goals}

Return ONLY a JSON array of question objects with:
- id: string identifier
- question: the actual question text
- type: one of 'vision', 'technical', 'user', 'business'
- required: boolean

Example:
[
  {
    "id": "q1",
    "question": "Who is the target audience?",
    "type": "vision",
    "required": true
  }
]`,
        type: 'structured'
      });

      // Clean the response to get just the JSON
      const jsonStr = response
        .replace(/^[\s\S]*?(\[[\s\S]*\])[\s\S]*$/, '$1') // Extract array
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Normalize property quotes
        .replace(/'/g, '"'); // Replace single quotes with double quotes

      const questions = JSON.parse(jsonStr);

      // Split into required and optional
      const required = questions
        .filter((q: any) => q && q.required)
        .slice(0, 5)
        .map((q: any) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: true
        }));

      const optional = questions
        .filter((q: any) => q && !q.required)
        .map((q: any) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: false
        }));

      return { required, optional };
    } catch (error) {
      debug('VertexAI', 'Error generating initial prompts:', error);
      throw error;
    }
  }

  async generateFollowUpPrompts(context: ProjectInitialContext): Promise<GeneratedPrompt[]> {
    try {
      debug('VertexAI', 'Generating follow-up prompts for context:', context);
      const prompt = getFollowUpPromptsPrompt(context);
      const response = await this.generateContent({ prompt });
      return JSON.parse(response) as GeneratedPrompt[];
    } catch (error) {
      this.logger.error('Error generating follow-up prompts:', error);
      throw error;
    }
  }

  async generateDocumentationPlan(context: ProjectInitialContext): Promise<DocumentGenerationPlan> {
    try {
      debug('VertexAI', 'Generating documentation plan for context:', context);
      const prompt = getDocumentationPlanPrompt(context);
      const response = await this.generateContent({ 
        prompt,
        type: 'document'
      });
      debug('VertexAI', 'Got response:', response);
      
      // Clean the response to ensure it's valid JSON
      const cleanedResponse = response.replace(/```json\s*|\s*```/g, '').trim();
      
      try {
        const plan = JSON.parse(cleanedResponse) as DocumentGenerationPlan;
        
        // Validate the structure
        if (!plan.templates || !plan.structure || !plan.metadata) {
          throw new Error('Invalid documentation plan structure');
        }
        
        return plan;
      } catch (parseError) {
        debug('VertexAI', 'Failed to parse JSON:', parseError);
        debug('VertexAI', 'Response was:', cleanedResponse);
        
        // Return a default plan as fallback
        return {
          templates: ['engineering', 'design', 'marketing', 'sales', 'brainstorm'],
          structure: {
            root: 'docs',
            sections: {
              engineering: ['architecture', 'api', 'setup'],
              design: ['ui', 'ux', 'components'],
              marketing: ['overview', 'features', 'benefits'],
              sales: ['pricing', 'comparison', 'roi'],
              brainstorm: ['ideas', 'future', 'notes']
            }
          },
          metadata: {
            projectType: 'web-application',
            complexity: 'medium',
            priority: 'high'
          }
        };
      }
    } catch (error) {
      debug('VertexAI', 'Error generating documentation plan:', error);
      throw error;
    }
  }

  async generateDocument(template: string, context: ProjectInitialContext, type: string): Promise<string> {
    try {
      debug('VertexAI', 'Generating document for type:', type);
      const prompt = getDocumentGenerationPrompt(context, template, type);
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
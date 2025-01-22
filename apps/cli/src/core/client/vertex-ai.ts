import { debug } from '../../utils/debug';
import { VertexAI } from '@google-cloud/vertexai';

export interface AIRequestOptions {
  prompt: string;
  type?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  context?: string;
  history?: Array<{ role: string; content: string }>;
}

interface VertexError extends Error {
  message: string;
  stack_trace?: string;
}

interface EnhancedContextEmbeddings {
  vision: number[];
  technical: number[];
  workflow: number[];
  components: Record<string, number[]>;
  changes: Record<string, number[]>;
  semantic: {
    full: number[];
    summary: number[];
  };
}

export class VertexAIClient {
  private vertexai: VertexAI;
  private defaultModel = 'gemini-pro';
  private project: string;
  private location: string;

  constructor(options?: {
    projectId?: string;
    location?: string;
    apiEndpoint?: string;
  }) {
    debug('VertexAI', 'Initializing VertexAI client');
    
    this.project = options?.projectId || process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = options?.location || process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    if (!this.project) {
      throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required');
    }

    try {
      this.vertexai = new VertexAI({
        project: this.project,
        location: this.location
      });
    } catch (error) {
      debug('VertexAI', 'Error initializing clients:', error);
      throw new Error('Failed to initialize Vertex AI clients');
    }
  }

  private cleanJsonResponse(response: string): string {
    debug('VertexAI', 'Cleaning JSON response');
    
    // Remove markdown code block syntax
    response = response.replace(/```json\s*|\s*```/g, '').trim();
    
    // Find the first { and last }
    const start = response.indexOf('{');
    const end = response.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      throw new Error('No JSON content found in response');
    }
    
    // Extract just the JSON content
    let jsonContent = response.substring(start, end + 1);
    
    try {
      // First attempt to parse as-is
      JSON.parse(jsonContent);
      return jsonContent;
    } catch (e) {
      debug('VertexAI', 'Initial JSON parse failed, attempting to fix common issues');
      
      try {
        // Fix common JSON issues
        jsonContent = jsonContent
          // Fix missing quotes around property names
          .replace(/([{,]\s*)(\w+)(?=\s*:)/g, '$1"$2"')
          // Fix missing quotes around string values
          .replace(/:\s*([^"{}\[\],\s][^,}\]]*?)(?=\s*[,}\]])/g, ':"$1"')
          // Remove any trailing commas
          .replace(/,(\s*[}\]])/g, '$1');
        
        // Verify fixed JSON
        JSON.parse(jsonContent);
        return jsonContent;
      } catch (finalError) {
        debug('VertexAI', 'Failed to fix JSON:', jsonContent);
        throw new Error('Failed to extract valid JSON from response');
      }
    }
  }

  async generateContent(options: AIRequestOptions): Promise<string> {
    const {
      prompt,
      context = 'general',
      history = [],
      type = 'chat',
      temperature = 0.85,
      maxTokens = 1024,
      model = this.defaultModel
    } = options;

    debug('VertexAI', 'Generating content with options:', {
      type,
      temperature,
      maxTokens,
      model
    });

    try {
      // Get the appropriate model
      const aiModel = this.vertexai.preview.getGenerativeModel({
        model: type === 'embedding' ? 'textembedding-gecko' : model,
        generation_config: {
          temperature,
          max_output_tokens: maxTokens
        }
      });

      // Build messages based on type
      let messages;
      if (type === 'embedding') {
        messages = [{
          role: 'user',
          content: `Generate embeddings for the following text: ${prompt}`
        }];
      } else {
        messages = [
          // Context as user message
          {
            role: 'user',
            content: `Context: You are a helpful AI assistant focused on ${context} tasks. 
                     Provide clear, concise responses and suggest next steps when appropriate.`
          },
          // Previous conversation history (excluding system messages)
          ...history.filter(msg => msg.role !== 'system'),
          // Current user prompt
          {
            role: 'user',
            content: prompt
          }
        ];
      }

      try {
        // Generate content
        const result = await aiModel.generateContent({
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))
        });

        const response = result.response;
        const text = response.candidates[0]?.content?.parts[0]?.text;
        if (!text) throw new Error('No response generated');

        // Log LLM response for debugging
        debug('VertexAI', `LLM Response for ${type}:`, text);

        // Clean and parse JSON responses
        if (type === 'project-type' || type === 'vision-analysis' || type === 'embedding') {
          const cleanedJson = this.cleanJsonResponse(text);
          debug('VertexAI', `Cleaned JSON for ${type}:`, cleanedJson);
          return cleanedJson;
        }

        return text;
      } catch (error) {
        debug('VertexAI', 'Error generating content:', error);
        
        const vertexError = error as VertexError;
        if (vertexError.message?.includes('authentication') || vertexError.stack_trace?.includes('authentication')) {
          throw new Error(`Authentication failed. Please ensure your credentials are valid and you have access to the project.
To authenticate:
1. Local development: Run 'gcloud auth application-default login'
2. Service account: Ensure GOOGLE_APPLICATION_CREDENTIALS points to a valid key file
3. Cloud environment: Ensure proper IAM roles are set`);
        }
        
        throw new Error('Failed to generate response: ' + vertexError.message);
      }
    } catch (error) {
      debug('VertexAI', 'Error in generateContent:', error);
      throw error;
    }
  }

  async generateChat(messages: Array<{ role: string; content: string }>, options?: Partial<AIRequestOptions>): Promise<string> {
    debug('VertexAI', 'Generating chat response with options:', {
      messageCount: messages.length,
      ...options
    });

    return this.generateContent({
      prompt: messages[messages.length - 1].content,
      history: messages.slice(0, -1),
      ...options
    });
  }

  async generateEmbedding(content: string, type: 'text' | 'code' | 'mixed' = 'text'): Promise<number[]> {
    debug('VertexAI', 'Generating embedding');
    try {
      const model = this.vertexai.preview.getGenerativeModel({
        model: 'multimodalembedding@001',
        generation_config: {
          taskType: type === 'code' ? 'CODE' : type === 'mixed' ? 'SEMANTIC_SIMILARITY' : 'RETRIEVAL_DOCUMENT'
        }
      });

      const result = await model.generateContent({
        contents: [{ text: content }]
      });

      return result.response.candidates[0].content.parts[0].embedding;
    } catch (error) {
      debug('VertexAI', 'Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(contents: string[], type: 'text' | 'code' | 'mixed' = 'text'): Promise<number[][]> {
    debug('VertexAI', 'Generating batch embeddings');
    try {
      const model = this.vertexai.preview.getGenerativeModel({
        model: 'multimodalembedding@001',
        generation_config: {
          taskType: type === 'code' ? 'CODE' : type === 'mixed' ? 'SEMANTIC_SIMILARITY' : 'RETRIEVAL_DOCUMENT'
        }
      });

      const results = await Promise.all(
        contents.map(text => 
          model.generateContent({
            contents: [{ text }]
          })
        )
      );

      return results.map(result => result.response.candidates[0].content.parts[0].embedding);
    } catch (error) {
      debug('VertexAI', 'Error generating batch embeddings:', error);
      throw new Error('Failed to generate batch embeddings');
    }
  }

  async generateContextEmbeddings(context: any): Promise<EnhancedContextEmbeddings> {
    debug('VertexAI', 'Generating context embeddings');
    
    const components: Record<string, number[]> = {};
    const changes: Record<string, number[]> = {};
    
    // Generate component embeddings
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        // Use appropriate task type based on content
        const type = key.includes('code') || key.includes('technical') ? 'code' : 'text';
        components[key] = await this.generateEmbedding(value, type);
      }
    }
    
    // Generate full context embedding using mixed type for better semantic understanding
    const fullText = JSON.stringify(context);
    const semantic = {
      full: await this.generateEmbedding(fullText, 'mixed'),
      summary: await this.generateEmbedding(context.description || '', 'mixed')
    };
    
    return {
      vision: components.vision || [],
      technical: components.technical || [],
      workflow: components.workflow || [],
      components,
      changes,
      semantic
    };
  }
}
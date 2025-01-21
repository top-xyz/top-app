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
      debug('VertexAI', 'Error initializing VertexAI:', error);
      throw new Error('Failed to initialize VertexAI client. Please check your credentials.');
    }
  }

  private cleanJsonResponse(text: string): string {
    // Remove markdown code blocks
    text = text.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '');
    
    // Remove any non-JSON text before or after
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart >= 0 && jsonEnd > 0) {
      text = text.slice(jsonStart, jsonEnd);
    }
    
    return text.trim();
  }

  async generateContent(options: AIRequestOptions): Promise<string> {
    const {
      prompt,
      context = 'general',
      history = [],
      type = 'chat',
      temperature = 0.7,
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
}
import { VertexAI } from '@google-cloud/vertexai'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs/promises'

interface GenerateContentOptions {
  prompt: string
  context?: string
  history?: Array<{ role: string; content: string }>
  type?: string
  temperature?: number
  maxTokens?: number
}

interface VertexError extends Error {
  message: string
  stack_trace?: string
}

export class VertexAIClient {
  private vertexai: VertexAI
  private model = 'gemini-pro'
  private project: string
  private location: string

  constructor() {
    this.project = process.env.GOOGLE_CLOUD_PROJECT || ''
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    
    if (!this.project) {
      throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required')
    }

    try {
      this.vertexai = new VertexAI({
        project: this.project,
        location: this.location
      })
    } catch (error) {
      console.error('Error initializing VertexAI:', error)
      throw new Error('Failed to initialize VertexAI client. Please check your credentials.')
    }
  }

  async generateContent(options: GenerateContentOptions): Promise<string> {
    const {
      prompt,
      context = 'general',
      history = [],
      type = 'chat',
      temperature = 0.7,
      maxTokens = 1024
    } = options

    try {
      // Use different model for embeddings
      const model = this.vertexai.preview.getGenerativeModel({
        model: type === 'embedding' ? 'textembedding-gecko' : this.model,
        generation_config: {
          temperature,
          max_output_tokens: maxTokens
        }
      })

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
        const result = await model.generateContent({
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))
        })

        const response = result.response
        const text = response.candidates[0]?.content?.parts[0]?.text
        if (!text) throw new Error('No response generated')

        // For embeddings, ensure we return a valid JSON array
        if (type === 'embedding') {
          try {
            const embeddings = JSON.parse(text)
            if (!Array.isArray(embeddings)) {
              throw new Error('Invalid embeddings format')
            }
            return JSON.stringify(embeddings)
          } catch {
            throw new Error('Failed to parse embeddings response')
          }
        }

        return text
      } catch (error) {
        console.error('Error generating content:', error)
        
        const vertexError = error as VertexError
        if (vertexError.message?.includes('authentication') || vertexError.stack_trace?.includes('authentication')) {
          throw new Error(`Authentication failed. Please ensure your credentials are valid and you have access to the project.
To authenticate:
1. Local development: Run 'gcloud auth application-default login'
2. Service account: Ensure GOOGLE_APPLICATION_CREDENTIALS points to a valid key file
3. Cloud environment: Ensure proper IAM roles are set`)
        }
        
        throw new Error('Failed to generate response: ' + vertexError.message)
      }
    } catch (error) {
      console.error('Error in generateContent:', error)
      throw error
    }
  }
} 
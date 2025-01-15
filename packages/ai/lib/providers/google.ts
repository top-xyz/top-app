import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIProvider, GoogleConfig, GoogleConfigSchema } from './types'
import { encoding_for_model } from '@dqbd/tiktoken'

export class GoogleProvider implements AIProvider<GoogleConfig> {
  // Identity
  id = 'google'
  name = 'Google AI'
  description = 'Google AI provider supporting Gemini models'
  
  // Configuration
  configSchema = GoogleConfigSchema
  config: GoogleConfig
  
  // Client
  private client: GoogleGenerativeAI
  private encoder: ReturnType<typeof encoding_for_model>
  
  constructor(config: GoogleConfig) {
    this.config = config
  }
  
  // Core methods
  async initialize(config: GoogleConfig) {
    this.config = config
    this.client = new GoogleGenerativeAI(config.apiKey)
    // Use GPT-4 encoder as approximation
    this.encoder = encoding_for_model('gpt-4')
  }
  
  // Generation
  async generateText(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ 
      model: this.config.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens
      }
    })
    
    const response = await model.generateContent(prompt)
    const text = response.response.text()
    return text
  }
  
  async *generateStream(prompt: string): AsyncGenerator<string> {
    const model = this.client.getGenerativeModel({ 
      model: this.config.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens
      }
    })
    
    const response = await model.generateContentStream(prompt)
    
    for await (const chunk of response.stream) {
      const text = chunk.text()
      if (text) {
        yield text
      }
    }
  }
  
  // Embeddings
  async generateEmbedding(text: string): Promise<number[]> {
    const model = this.client.getGenerativeModel({ model: 'embedding-001' })
    const response = await model.embedContent(text)
    return response.embedding
  }
  
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const model = this.client.getGenerativeModel({ model: 'embedding-001' })
    const responses = await Promise.all(
      texts.map(text => model.embedContent(text))
    )
    return responses.map(r => r.embedding)
  }
  
  // Utilities
  validateConfig(config: unknown): config is GoogleConfig {
    const result = GoogleConfigSchema.safeParse(config)
    return result.success
  }
  
  tokenCount(text: string): number {
    return this.encoder.encode(text).length
  }
} 
import OpenAI from 'openai'
import { AIProvider, OpenAIConfig, OpenAIConfigSchema } from './types'
import { encoding_for_model } from '@dqbd/tiktoken'

export class OpenAIProvider implements AIProvider<OpenAIConfig> {
  // Identity
  id = 'openai'
  name = 'OpenAI'
  description = 'OpenAI API provider supporting GPT-4 and GPT-3.5 models'
  
  // Configuration
  configSchema = OpenAIConfigSchema
  config: OpenAIConfig
  
  // Client
  private client: OpenAI
  private encoder: ReturnType<typeof encoding_for_model>
  
  constructor(config: OpenAIConfig) {
    this.config = config
  }
  
  // Core methods
  async initialize(config: OpenAIConfig) {
    this.config = config
    this.client = new OpenAI({ apiKey: config.apiKey })
    this.encoder = encoding_for_model('gpt-4')
  }
  
  // Generation
  async generateText(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens
    })
    
    return response.choices[0].message.content || ''
  }
  
  async *generateStream(prompt: string): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: true
    })
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  }
  
  // Embeddings
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    })
    
    return response.data[0].embedding
  }
  
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts
    })
    
    return response.data.map(item => item.embedding)
  }
  
  // Utilities
  validateConfig(config: unknown): config is OpenAIConfig {
    const result = OpenAIConfigSchema.safeParse(config)
    return result.success
  }
  
  tokenCount(text: string): number {
    return this.encoder.encode(text).length
  }
} 
import Anthropic from '@anthropic-ai/sdk'
import { AIProvider, AnthropicConfig, AnthropicConfigSchema } from './types'
import { encoding_for_model } from '@dqbd/tiktoken'

export class AnthropicProvider implements AIProvider<AnthropicConfig> {
  // Identity
  id = 'anthropic'
  name = 'Anthropic'
  description = 'Anthropic API provider supporting Claude models'
  
  // Configuration
  configSchema = AnthropicConfigSchema
  config: AnthropicConfig
  
  // Client
  private client: Anthropic
  private encoder: ReturnType<typeof encoding_for_model>
  
  constructor(config: AnthropicConfig) {
    this.config = config
  }
  
  // Core methods
  async initialize(config: AnthropicConfig) {
    this.config = config
    this.client = new Anthropic({ apiKey: config.apiKey })
    // Use GPT-4 encoder as approximation
    this.encoder = encoding_for_model('gpt-4')
  }
  
  // Generation
  async generateText(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens
    })
    
    return response.content[0].text
  }
  
  async *generateStream(prompt: string): AsyncGenerator<string> {
    const stream = await this.client.messages.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: true
    })
    
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        yield chunk.delta.text
      }
    }
  }
  
  // Embeddings (using OpenAI as Anthropic doesn't have embeddings yet)
  async generateEmbedding(text: string): Promise<number[]> {
    throw new Error('Embeddings not supported by Anthropic')
  }
  
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    throw new Error('Embeddings not supported by Anthropic')
  }
  
  // Utilities
  validateConfig(config: unknown): config is AnthropicConfig {
    const result = AnthropicConfigSchema.safeParse(config)
    return result.success
  }
  
  tokenCount(text: string): number {
    return this.encoder.encode(text).length
  }
} 
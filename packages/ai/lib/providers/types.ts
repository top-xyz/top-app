import { z } from 'zod'

// Provider configuration schemas
export const OpenAIConfigSchema = z.object({
  apiKey: z.string(),
  model: z.enum([
    'gpt-4',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-3.5-turbo'
  ]),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048)
})

export const AnthropicConfigSchema = z.object({
  apiKey: z.string(),
  model: z.enum([
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3.5-sonnet'
  ]),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048)
})

export const GoogleConfigSchema = z.object({
  apiKey: z.string(),
  model: z.enum([
    'gemini-pro',
    'gemini-pro-vision'
  ]),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048)
})

// Provider type definitions
export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>
export type AnthropicConfig = z.infer<typeof AnthropicConfigSchema>
export type GoogleConfig = z.infer<typeof GoogleConfigSchema>

// Base provider interface
export interface AIProvider<TConfig = unknown> {
  // Identity
  id: string
  name: string
  description: string
  
  // Configuration
  configSchema: z.ZodSchema
  config: TConfig
  
  // Core methods
  initialize(config: TConfig): Promise<void>
  
  // Generation
  generateText(prompt: string): Promise<string>
  generateStream(prompt: string): AsyncGenerator<string>
  
  // Embeddings
  generateEmbedding(text: string): Promise<number[]>
  generateEmbeddings(texts: string[]): Promise<number[][]>
  
  // Utilities
  validateConfig(config: unknown): config is TConfig
  tokenCount(text: string): number
}

// Provider registry type
export interface ProviderRegistry {
  providers: Map<string, AIProvider>
  
  // Registration
  register(provider: AIProvider): void
  unregister(providerId: string): void
  
  // Retrieval
  getProvider(id: string): AIProvider | undefined
  listProviders(): AIProvider[]
  
  // Active provider
  setActiveProvider(id: string): void
  getActiveProvider(): AIProvider | undefined
} 
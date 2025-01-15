import { AIProvider, ProviderRegistry } from './types'
import { OpenAIProvider } from './openai'
import { AnthropicProvider } from './anthropic'
import { GoogleProvider } from './google'

export class AIProviderRegistry implements ProviderRegistry {
  providers = new Map<string, AIProvider>()
  private activeProviderId?: string
  
  constructor() {
    // Register default providers
    this.register(new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048
    }))
    
    this.register(new AnthropicProvider({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: 'claude-3-opus',
      temperature: 0.7,
      maxTokens: 2048
    }))
    
    this.register(new GoogleProvider({
      apiKey: process.env.GOOGLE_API_KEY || '',
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048
    }))
  }
  
  // Registration
  register(provider: AIProvider): void {
    this.providers.set(provider.id, provider)
    
    // Set as active if first provider
    if (!this.activeProviderId) {
      this.activeProviderId = provider.id
    }
  }
  
  unregister(providerId: string): void {
    this.providers.delete(providerId)
    
    // Clear active provider if it was unregistered
    if (this.activeProviderId === providerId) {
      this.activeProviderId = undefined
    }
  }
  
  // Retrieval
  getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id)
  }
  
  listProviders(): AIProvider[] {
    return Array.from(this.providers.values())
  }
  
  // Active provider
  setActiveProvider(id: string): void {
    if (!this.providers.has(id)) {
      throw new Error(`Provider ${id} not found`)
    }
    this.activeProviderId = id
  }
  
  getActiveProvider(): AIProvider | undefined {
    if (!this.activeProviderId) return undefined
    return this.providers.get(this.activeProviderId)
  }
} 
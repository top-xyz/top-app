// Components
export * from './components/message'
export * from './components/thread'

// Provider types
export * from './lib/providers/types'

// Provider implementations
export * from './lib/providers/openai'
export * from './lib/providers/anthropic'
export * from './lib/providers/google'
export * from './lib/providers/registry'

// Create default registry instance
import { AIProviderRegistry } from './lib/providers/registry'
import { ContextGenerationPipeline } from './lib/context/pipeline'

// Create and export instances
export const providerRegistry = new AIProviderRegistry()
export const aiPipeline = new ContextGenerationPipeline(providerRegistry)

export type {
  ContextGenerationInput,
  GeneratedContext
} from './lib/context/types'

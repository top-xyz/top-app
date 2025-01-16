import { AIProviderRegistry } from '../providers/registry'
import type { ContextGenerationInput, GeneratedContext } from './types'
import { withRetry } from '@repo/notifications/retry'

export class ContextGenerationPipeline {
  constructor(private providers: AIProviderRegistry) {}

  async generateContext(input: ContextGenerationInput): Promise<GeneratedContext> {
    try {
      // 1. Analyze requirements
      const analysis = await this.analyzeRequirements(input)

      // 2. Select template
      const template = await this.selectTemplate(analysis)

      // 3. Generate initial structure
      const structure = await this.generateStructure(template, input)

      // 4. Create database record
      const context = await this.persistContext(structure, input)

      return context
    } catch (error) {
      console.error('Context generation failed:', error)
      throw error
    }
  }

  private async analyzeRequirements(input: ContextGenerationInput) {
    return await withRetry(async () => {
      const provider = await this.providers.getProvider('analysis')
      return provider.analyze({
        requirements: input.requirements,
        constraints: input.constraints
      })
    })
  }

  private async selectTemplate(analysis: any) {
    // Template selection logic
    return 'default' // For now
  }

  private async generateStructure(template: string, input: ContextGenerationInput) {
    return await withRetry(async () => {
      const provider = await this.providers.getProvider('generation')
      return provider.generate({
        template,
        input
      })
    })
  }

  private async persistContext(
    structure: any,
    input: ContextGenerationInput
  ): Promise<GeneratedContext> {
    // Create database records
    return structure
  }
} 
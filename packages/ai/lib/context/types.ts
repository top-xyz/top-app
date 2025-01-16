export interface ContextGenerationInput {
  title: string
  description: string
  requirements: string[]
  constraints?: string[]
  template?: string
  userId: string
}

export interface GeneratedContext {
  id: string
  title: string
  description: string
  structure: {
    files: Array<{
      path: string
      content: string
    }>
    dependencies: Record<string, string>
    configuration: Record<string, any>
  }
  metadata: {
    template: string
    analysis: any
    requirements: string[]
    constraints: string[]
  }
}

export interface ContextProvider {
  analyze(input: {
    requirements: string[]
    constraints?: string[]
  }): Promise<any>

  generate(input: {
    template: string
    input: ContextGenerationInput
  }): Promise<any>
} 
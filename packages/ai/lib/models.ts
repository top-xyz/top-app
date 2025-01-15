import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { z } from 'zod'

// Configuration schema
export const AIConfigSchema = z.object({
  openaiApiKey: z.string(),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo']).default('gpt-4'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048)
})

export type AIConfig = z.infer<typeof AIConfigSchema>

// Core AI Manager
export class AIManager {
  private models: {
    chat: ChatOpenAI
    embedding: OpenAIEmbeddings
  }

  private templates: Map<string, PromptTemplate>
  private chains: Map<string, LLMChain>

  constructor(config: AIConfig) {
    // Initialize models
    this.models = {
      chat: new ChatOpenAI({
        openAIApiKey: config.openaiApiKey,
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      }),
      embedding: new OpenAIEmbeddings({
        openAIApiKey: config.openaiApiKey
      })
    }

    this.templates = new Map()
    this.chains = new Map()

    // Load default templates
    this.loadDefaultTemplates()
  }

  // Template management
  private loadDefaultTemplates() {
    this.templates.set('context-generation', new PromptTemplate({
      template: `Given the following requirements:
{requirements}

Generate a detailed technical specification including:
1. Architecture overview
2. Core components
3. Integration points
4. Implementation plan

Response should be in markdown format.`,
      inputVariables: ['requirements']
    }))

    // Add more default templates as needed
  }

  async addTemplate(name: string, template: string, variables: string[]) {
    this.templates.set(name, new PromptTemplate({
      template,
      inputVariables: variables
    }))
  }

  // Chain management
  async createChain(templateName: string) {
    const template = this.templates.get(templateName)
    if (!template) {
      throw new Error(`Template ${templateName} not found`)
    }

    const chain = new LLMChain({
      llm: this.models.chat,
      prompt: template
    })

    this.chains.set(templateName, chain)
    return chain
  }

  // Generation methods
  async generate(templateName: string, input: Record<string, any>) {
    let chain = this.chains.get(templateName)
    if (!chain) {
      chain = await this.createChain(templateName)
    }

    const result = await chain.call(input)
    return result.text
  }

  async *stream(templateName: string, input: Record<string, any>) {
    let chain = this.chains.get(templateName)
    if (!chain) {
      chain = await this.createChain(templateName)
    }

    const stream = await chain.stream(input)
    for await (const chunk of stream) {
      yield chunk.text
    }
  }

  // Embedding methods
  async generateEmbedding(text: string) {
    return this.models.embedding.embedQuery(text)
  }

  async generateEmbeddings(texts: string[]) {
    return this.models.embedding.embedDocuments(texts)
  }
}

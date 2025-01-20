import { CLIConfig, ChatMode, ChatSession, ProjectContext } from './types.js'
import { VertexAIClient } from './utils/vertex-ai.js'
import { VectorStore, MarkdownLoader, VectorStoreConfig } from './utils/vector-store.js'
import { LLMChain } from 'langchain/chains'
import { PromptTemplate } from 'langchain/prompts'
import { BufferMemory } from 'langchain/memory'
import * as fs from 'fs/promises'
import * as path from 'path'

export class ContextManager {
  private config: CLIConfig
  private ai: VertexAIClient
  private vectorStore: VectorStore
  private memory: BufferMemory
  private chains: Map<string, LLMChain> = new Map()

  constructor(config: CLIConfig) {
    this.config = config
    this.ai = new VertexAIClient()
    
    const vectorConfig: VectorStoreConfig = {
      dimensions: config.embeddings.dimensions,
      space: config.embeddings.similarity,
      maxElements: 10000
    }
    
    this.vectorStore = new VectorStore(vectorConfig)
    this.memory = new BufferMemory({ returnMessages: true, memoryKey: "chat_history" })
    
    this.initializeChains()
    this.loadKnowledgeBase()
  }

  private async initializeChains() {
    // Document type selection chain
    const typePrompt = new PromptTemplate({
      template: `Based on this conversation:
User: {input}
Assistant: {response}

What type of documentation should be generated?
Options:
- vision (high-level project vision)
- technical (architecture & implementation)
- user (user experience & interface)
- workflow (processes & procedures)

Return just the type name.`,
      inputVariables: ["input", "response"]
    })

    this.chains.set('docType', new LLMChain({
      llm: this.ai,
      prompt: typePrompt,
      memory: this.memory
    }))

    // Document generation chain
    const docPrompt = new PromptTemplate({
      template: `Based on the conversation:
User: {input}
Assistant: {response}

And using this template:
{template}

Generate a comprehensive document that captures this knowledge.
Follow our documentation patterns and maintain consistent style.`,
      inputVariables: ["input", "response", "template"]
    })

    this.chains.set('docGen', new LLMChain({
      llm: this.ai,
      prompt: docPrompt,
      memory: this.memory
    }))
  }

  private async loadKnowledgeBase() {
    try {
      const coreFiles = [
        '@00-overview.md',
        '@12-ai-platform-strategy.md',
        '@ergonomics.md',
        '@mobile-interface.md',
        '@autodocs.md',
        '@magic-moment.md'
      ]

      const documents = []
      for (const file of coreFiles) {
        const loader = new MarkdownLoader(path.join(this.config.contextDir, file))
        const docs = await loader.load()
        documents.push(...docs)
      }

      await this.vectorStore.initialize(documents)
    } catch (error) {
      console.error('Error loading knowledge base:', error)
    }
  }

  async getRelevantContext(input: string, mode: ChatMode): Promise<string> {
    try {
      const relevantDocs = await this.vectorStore.similaritySearch(input, 3)
      return relevantDocs.map(doc => doc.pageContent).join('\n\n')
    } catch (error) {
      console.error('Error getting relevant context:', error)
      return ''
    }
  }

  async generateDocument(input: string, response: string, session: ChatSession): Promise<void> {
    try {
      const docType = await this.determineDocumentType(input, response)
      const template = await this.getDocumentTemplate(docType)
      
      const docChain = this.chains.get('docGen')
      if (!docChain) throw new Error('Document generation chain not initialized')
      
      const content = await docChain.call({
        input,
        response,
        template
      })

      const fileName = await this.generateFileName(docType, input)
      const filePath = path.join(this.config.contextDir, fileName)

      await fs.writeFile(filePath, content.text, 'utf-8')

      // Add new document to vector store
      const loader = new MarkdownLoader(filePath)
      const docs = await loader.load()
      await this.vectorStore.addDocuments(docs)

      // Update session metadata
      if (session.metadata.generatedDocs) {
        session.metadata.generatedDocs.push(fileName)
      } else {
        session.metadata.generatedDocs = [fileName]
      }

      // Save vector store state
      await this.vectorStore.save(path.join(this.config.cacheDir, 'vector-store'))
    } catch (error) {
      console.error('Error generating document:', error)
    }
  }

  private async determineDocumentType(input: string, response: string): Promise<string> {
    const typeChain = this.chains.get('docType')
    if (!typeChain) throw new Error('Document type chain not initialized')
    
    const result = await typeChain.call({
      input,
      response
    })

    return result.text.trim().toLowerCase()
  }

  private async getDocumentTemplate(type: string): Promise<string> {
    try {
      const templatePath = path.join(
        this.config.templatesDir,
        `${type}-template.md`
      )
      return await fs.readFile(templatePath, 'utf-8')
    } catch (error) {
      console.error(`Error loading template for ${type}:`, error)
      return ''
    }
  }

  private async generateFileName(type: string, input: string): Promise<string> {
    const result = await this.ai.generateContent({
      prompt: `Generate a kebab-case filename for a ${type} document about:
${input}

Return just the filename with .md extension.`,
      context: 'filename',
      type: 'analysis'
    })

    return path.join(type, result.trim())
  }

  async generatePreview(session: ChatSession): Promise<string> {
    if (!session.metadata.generatedDocs?.length) {
      return 'No documents generated yet.'
    }

    try {
      const latestDoc = session.metadata.generatedDocs[session.metadata.generatedDocs.length - 1]
      const content = await fs.readFile(
        path.join(this.config.contextDir, latestDoc),
        'utf-8'
      )

      return `Preview of ${latestDoc}:\n\n${content}`
    } catch (error) {
      console.error('Error generating preview:', error)
      return 'Error generating preview.'
    }
  }

  async saveSession(session: ChatSession): Promise<void> {
    try {
      const fileName = `session-${session.id}.json`
      const filePath = path.join(this.config.cacheDir, fileName)

      await fs.writeFile(
        filePath,
        JSON.stringify(session, null, 2),
        'utf-8'
      )
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }
} 
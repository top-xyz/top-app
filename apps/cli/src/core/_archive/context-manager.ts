import { CLIConfig, ChatMode, ChatSession, ProjectContext } from './types.js'
import { VertexAIClient } from './utils/vertex-ai.js'
import * as fs from 'fs/promises'
import * as path from 'path'

export class ContextManager {
  private config: CLIConfig
  private ai: VertexAIClient
  private knowledgeBase: Map<string, string> = new Map()

  constructor(config: CLIConfig) {
    this.config = config
    this.ai = new VertexAIClient()
    this.loadKnowledgeBase()
  }

  private async loadKnowledgeBase() {
    try {
      const coreFiles = [
        '@00-overview.md'
      ]

      for (const file of coreFiles) {
        try {
          const content = await fs.readFile(
            path.join(this.config.contextDir, file),
            'utf-8'
          )
          this.knowledgeBase.set(file, content)
        } catch (error) {
          console.warn(`Warning: Could not load ${file}, skipping...`)
        }
      }

      if (this.knowledgeBase.size === 0) {
        console.warn('Warning: No context files loaded. Starting with empty knowledge base.')
      }
    } catch (error) {
      console.error('Error loading knowledge base:', error)
    }
  }

  async getRelevantContext(input: string, mode: ChatMode): Promise<string> {
    try {
      if (this.knowledgeBase.size === 0) {
        return ''
      }

      const prompt = mode === 'base'
        ? `Find relevant context for understanding project goals and vision:
${input}`
        : `Find relevant documentation patterns and guidelines for:
${input}`

      // Get most relevant documents
      const relevantDocs = await this.findRelevantDocuments(prompt)
      
      return relevantDocs.join('\n\n')
    } catch (error) {
      console.error('Error getting relevant context:', error)
      return ''
    }
  }

  private async findRelevantDocuments(query: string): Promise<string[]> {
    try {
      if (this.knowledgeBase.size === 0) {
        return []
      }

      // Use AI to identify most relevant documents
      const response = await this.ai.generateContent({
        prompt: `Based on the query: "${query}"
Which of our reference documents would be most relevant?
Consider:
${Array.from(this.knowledgeBase.keys()).join('\n')}

Return the names of the 2-3 most relevant documents.`,
        context: 'document_selection',
        type: 'analysis'
      })

      // Parse response to get document names
      const docNames = response
        .split('\n')
        .filter(line => line.startsWith('@'))
        .map(line => line.trim())

      // Get content of relevant documents
      return docNames
        .map(name => this.knowledgeBase.get(name))
        .filter((content): content is string => content !== undefined)
    } catch (error) {
      console.error('Error finding relevant documents:', error)
      return []
    }
  }

  async generateDocument(input: string, response: string, session: ChatSession): Promise<void> {
    try {
      const docType = await this.determineDocumentType(input, response)
      const template = await this.getDocumentTemplate(docType)
      
      const content = await this.ai.generateContent({
        prompt: `Based on the conversation:
User: ${input}
Assistant: ${response}

And using this template:
${template}

Generate a comprehensive document that captures this knowledge.
Follow our documentation patterns and maintain consistent style.`,
        context: 'documentation',
        type: 'document'
      })

      const fileName = await this.generateFileName(docType, input)
      const filePath = path.join(this.config.contextDir, fileName)

      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content, 'utf-8')

      // Add to knowledge base
      this.knowledgeBase.set(fileName, content)

      // Update session metadata
      if (session.metadata.generatedDocs) {
        session.metadata.generatedDocs.push(fileName)
      } else {
        session.metadata.generatedDocs = [fileName]
      }
    } catch (error) {
      console.error('Error generating document:', error)
    }
  }

  private async determineDocumentType(input: string, response: string): Promise<string> {
    const result = await this.ai.generateContent({
      prompt: `Based on this conversation:
User: ${input}
Assistant: ${response}

What type of documentation should be generated?
Options:
- vision (high-level project vision)
- technical (architecture & implementation)
- user (user experience & interface)
- workflow (processes & procedures)

Return just the type name.`,
      context: 'documentation',
      type: 'analysis'
    })

    return result.trim().toLowerCase()
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
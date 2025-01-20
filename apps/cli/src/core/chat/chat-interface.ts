import { CLIConfig, ChatMode, ChatSession, ChatResponse } from '../types.js'
import { VertexAIClient } from '../utils/vertex-ai.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'

export class ChatInterface {
  private config: CLIConfig
  private ai: VertexAIClient
  private sessions: Map<string, ChatSession>
  private currentMode: ChatMode = 'base'

  constructor(config: CLIConfig) {
    this.config = config
    this.ai = new VertexAIClient()
    this.sessions = new Map()
  }

  async startSession(mode: ChatMode = 'base', context?: string): Promise<ChatSession> {
    this.currentMode = mode
    const session: ChatSession = {
      id: uuidv4(),
      mode,
      context: context || '',
      history: [],
      metadata: {
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    }

    this.sessions.set(session.id, session)
    return session
  }

  async *processInput(input: string, isLastQuestion: boolean = false): AsyncGenerator<ChatResponse> {
    try {
      const currentSession = Array.from(this.sessions.values())[0]
      if (!currentSession) {
        throw new Error('No active session found')
      }

      // Store user input
      currentSession.history.push({
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      })

      // Only generate AI response if this is the last question
      if (isLastQuestion) {
        // Generate response based on all collected answers
        const fullContext = currentSession.history
          .filter(msg => msg.role === 'user')
          .map(msg => msg.content)
          .join('\n\n')

        const response = await this.ai.generateContent({
          prompt: `Based on the following project information, provide a comprehensive summary and suggest next steps:

${fullContext}`,
          context: currentSession.mode,
          history: currentSession.history,
          type: 'chat'
        })

        // Update session
        currentSession.history.push({
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        })
        currentSession.metadata.lastUpdated = new Date().toISOString()

        // Stream response if enabled
        if (this.config.streaming.enabled) {
          const chunks = this.chunkResponse(response)
          for (const chunk of chunks) {
            yield {
              type: 'message',
              content: chunk,
              metadata: {
                timestamp: new Date().toISOString()
              }
            }
            await this.delay(this.config.streaming.delay)
          }
        } else {
          yield {
            type: 'message',
            content: response,
            metadata: {
              timestamp: new Date().toISOString()
            }
          }
        }

        // Generate suggestions
        const suggestions = await this.generateSuggestions(currentSession)
        yield {
          type: 'suggestion',
          content: suggestions,
          metadata: {
            timestamp: new Date().toISOString()
          }
        }
      }
      // For non-last questions, we don't need to yield anything
      // This allows the CLI to proceed to the next question
    } catch (error) {
      yield {
        type: 'error',
        content: error instanceof Error ? error.message : 'An unknown error occurred',
        metadata: {
          timestamp: new Date().toISOString(),
          error: true
        }
      }
    }
  }

  private async generateSuggestions(session: ChatSession): Promise<string> {
    const lastMessage = session.history[session.history.length - 1]
    
    const prompt = session.mode === 'base'
      ? `Based on our conversation, suggest 2-3 focused questions to better understand the project vision and goals.
Keep them concise and relevant to the current topic.`
      : `Based on our conversation, suggest 2-3 areas of documentation to focus on next.
Focus on completeness and alignment with our established patterns.`

    return await this.ai.generateContent({
      prompt,
      context: session.mode,
      type: 'suggestions'
    })
  }

  private chunkResponse(response: string): string[] {
    const { chunkSize } = this.config.streaming
    const chunks: string[] = []
    
    for (let i = 0; i < response.length; i += chunkSize) {
      chunks.push(response.slice(i, i + chunkSize))
    }
    
    return chunks
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async saveSession(session: ChatSession): Promise<void> {
    const currentSession = Array.from(this.sessions.values())[0]
    if (currentSession) {
      const fileName = `session-${currentSession.id}.json`
      const filePath = path.join(this.config.cacheDir, fileName)
      await fs.writeFile(filePath, JSON.stringify(currentSession, null, 2), 'utf-8')
    }
  }
} 
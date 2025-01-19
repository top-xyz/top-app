import { describe, it, expect, beforeEach } from 'vitest'
import { ChatInterface } from '../../core/chat/chat-interface.js'
import { CLIConfig } from '../../core/types.js'
import { ChatSession } from '../../core/response/types.js'

describe('ChatInterface', () => {
  let config: CLIConfig
  let chat: ChatInterface

  beforeEach(() => {
    config = {
      templatesDir: 'templates',
      contextDir: 'context',
      cacheDir: 'cache',
      embeddings: {
        provider: 'openai',
        model: 'text-embedding-ada-002',
        dimensions: 1536,
        similarity: 'cosine'
      },
      defaultTemplate: 'default',
      validateTemplate: true,
      validateLinks: true,
      strictMode: true,
      format: 'markdown',
      colors: true,
      preview: {
        enabled: true,
        type: 'markdown'
      },
      collaboration: {
        enabled: false,
        realtime: false,
        presence: false,
        comments: false
      }
    }
    chat = new ChatInterface(config)
  })

  it('should create a new session', async () => {
    const session = await chat.startSession('test-context')
    
    expect(session).toBeDefined()
    expect(session.id).toBeDefined()
    expect(session.messages).toHaveLength(0)
    expect(session.context).toBe('test-context')
    expect(session.metadata.startTime).toBeDefined()
  })

  it('should process input and return response chunks', async () => {
    await chat.startSession()
    const input = 'test command'
    const responses: Array<{
      type: 'message' | 'preview' | 'suggestion'
      content: string
      metadata?: Record<string, any>
    }> = []

    for await (const response of chat.processInput(input)) {
      responses.push(response)
    }

    expect(responses.length).toBeGreaterThan(0)
    expect(responses[0].type).toBe('message')
    expect(responses[0].content).toContain('Processing command: test command')
  })

  it('should maintain chat history', async () => {
    await chat.startSession()
    const input = 'test command'
    
    for await (const _ of chat.processInput(input)) {
      // Process responses
    }

    const history = await chat.getSessionHistory()
    expect(history).toHaveLength(2) // User message + assistant response
    expect(history[0].role).toBe('user')
    expect(history[0].content).toBe(input)
    expect(history[1].role).toBe('assistant')
  })

  it('should handle preview generation when enabled', async () => {
    await chat.startSession()
    const input = '```typescript\nconst x = 1;\n```'
    const responses: Array<{
      type: 'message' | 'preview' | 'suggestion'
      content: string
      metadata?: Record<string, any>
    }> = []

    for await (const response of chat.processInput(input)) {
      responses.push(response)
    }

    const previews = responses.filter(r => r.type === 'preview')
    expect(previews.length).toBeGreaterThan(0)
    expect(previews[0].content).toBeDefined()
    expect(previews[0].metadata).toBeDefined()
  })

  it('should handle preview generation when disabled', async () => {
    const disabledConfig = {
      ...config,
      preview: {
        ...config.preview,
        enabled: false
      }
    }
    const chatWithoutPreview = new ChatInterface(disabledConfig)
    await chatWithoutPreview.startSession()
    
    const input = '```typescript\nconst x = 1;\n```'
    const responses: Array<{
      type: 'message' | 'preview' | 'suggestion'
      content: string
      metadata?: Record<string, any>
    }> = []

    for await (const response of chatWithoutPreview.processInput(input)) {
      responses.push(response)
    }

    const previews = responses.filter(r => r.type === 'preview')
    expect(previews.length).toBe(0)
  })

  it('should throw error when processing input without active session', async () => {
    const input = 'test command'
    await expect(() => chat.processInput(input).next())
      .rejects
      .toThrow('No active chat session')
  })

  it('should generate unique session IDs', async () => {
    const session1 = await chat.startSession()
    const session2 = await chat.startSession()
    
    expect(session1.id).not.toBe(session2.id)
  })

  it('should include timestamps in messages', async () => {
    await chat.startSession()
    const input = 'test command'
    
    for await (const _ of chat.processInput(input)) {
      // Process responses
    }

    const history = await chat.getSessionHistory()
    history.forEach(message => {
      expect(message.timestamp).toBeDefined()
      expect(new Date(message.timestamp).getTime()).not.toBeNaN()
    })
  })

  it('should return empty history for no session', async () => {
    const history = await chat.getSessionHistory()
    expect(history).toHaveLength(0)
  })
}) 
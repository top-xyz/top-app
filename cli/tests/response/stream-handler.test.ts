import { describe, it, expect, beforeEach } from 'vitest'
import { StreamHandler } from '../../core/response/stream-handler.js'
import { CLIConfig } from '../../core/types.js'
import { StreamChunk } from '../../core/response/types.js'

describe('StreamHandler', () => {
  let config: CLIConfig
  let handler: StreamHandler

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
    handler = new StreamHandler(config)
  })

  it('should split content into chunks', async () => {
    const content = 'This is a test message that should be split into multiple chunks based on size'
    const stream = handler.createStream(content, 10)
    const chunks: StreamChunk[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks[0].type).toBe('content')
    expect(chunks[0].content.length).toBeLessThanOrEqual(10)
  })

  it('should extract suggestions from bullet points', async () => {
    const content = `Here are some suggestions:
- First suggestion
- Second suggestion
1. Numbered suggestion
2. Another numbered suggestion`
    
    const stream = handler.createStream(content)
    const chunks: StreamChunk[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    const suggestions = chunks.filter(c => c.type === 'suggestion')
    expect(suggestions.length).toBe(1)
    expect(suggestions[0].content).toContain('First suggestion')
    expect(suggestions[0].content).toContain('Second suggestion')
    expect(suggestions[0].content).toContain('Numbered suggestion')
  })

  it('should extract preview from code blocks', async () => {
    const content = 'Here is some code:\n```typescript\nconst x = 1;\n```'
    const stream = handler.createStream(content)
    const chunks: StreamChunk[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    const previews = chunks.filter(c => c.type === 'preview')
    expect(previews.length).toBe(1)
    expect(previews[0].metadata?.previewType).toBe('component')
    expect(previews[0].content).toContain('const x = 1;')
  })

  it('should extract preview from URLs', async () => {
    const content = 'Check this link: https://example.com'
    const stream = handler.createStream(content)
    const chunks: StreamChunk[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    const previews = chunks.filter(c => c.type === 'preview')
    expect(previews.length).toBe(1)
    expect(previews[0].metadata?.previewType).toBe('app')
    expect(previews[0].metadata?.url).toBe('https://example.com')
  })

  it('should format markdown content for terminal', async () => {
    const content = '**Bold** and *italic* text with [link](https://example.com)'
    const stream = handler.createStream(content)
    const chunks: StreamChunk[] = []

    for await (const chunk of stream) {
      if (chunk.type === 'content') {
        expect(chunk.content).not.toContain('**')
        expect(chunk.content).not.toContain('*')
        expect(chunk.content).not.toContain('[')
        expect(chunk.content).not.toContain('](')
      }
      chunks.push(chunk)
    }
  })

  it('should include metadata with each chunk', async () => {
    const content = 'Test content'
    const stream = handler.createStream(content)
    const chunks: StreamChunk[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    chunks.forEach(chunk => {
      expect(chunk.metadata).toBeDefined()
      expect(chunk.metadata?.timestamp).toBeDefined()
      expect(chunk.metadata?.type).toBeDefined()
    })
  })
}) 
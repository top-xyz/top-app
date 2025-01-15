import { z } from 'zod'

const heroConfigSchema = z.object({
  apiUrl: z.string().default('/api/hero'),
})

type HeroConfig = z.infer<typeof heroConfigSchema>

interface HeroResponse {
  response: string
  tags: string[]
  options: string[]
  tools: string[]
}

export class HeroProvider {
  constructor(private config: HeroConfig) {}

  async complete(params: { messages: Array<{ role: string; content: string }> }) {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: params.messages, stream: false }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const result = await response.json()
    return {
      choices: [{
        message: {
          content: JSON.stringify(result)
        }
      }]
    }
  }

  async stream(params: { messages: Array<{ role: string; content: string }> }): Promise<AsyncGenerator<string>> {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: params.messages, stream: true }),
    })

    if (!response.ok) {
      throw new Error('Failed to get streaming response')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    const generator = async function*() {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const text = line.slice(6)
              if (text === '[DONE]') return
              yield text
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    }

    return generator()
  }
} 
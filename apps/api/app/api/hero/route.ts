import { VertexAI } from '@google-cloud/vertexai'
// @ts-ignore - Redis import
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { Readable } from 'stream'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Common prompts for cache warming
const COMMON_PROMPTS = [
  "Tell me about building a web app",
  "How do I start a new project?",
  "What are the best practices for React?",
  "How can AI help with coding?"
]

// Analytics interface
interface Analytics {
  timestamp: number
  prompt: string
  cached: boolean
  error?: string
  latency: number
}

// Retry configuration
const RETRY_OPTIONS = {
  maxRetries: 3,
  backoff: [1000, 2000, 4000], // Milliseconds
}

const systemPrompt = `You are an AI coding assistant helping users create software projects through natural conversation.
Your goal is to provide engaging, informative responses that showcase the power of AI-assisted development.

Guidelines:
- Keep responses concise (2-3 sentences max)
- Focus on modern, trending technologies
- Suggest practical next steps
- Include relevant tech tags
- Propose 2-3 follow-up options
- Maintain an encouraging, confident tone

Response Format (you must respond with valid JSON only):
{
  "response": "Your concise response here",
  "tags": ["tech1", "tech2", "tech3"],
  "options": ["option1", "option2", "option3"],
  "tools": ["tool1", "tool2"]
}`

const vertexai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'top-app',
  location: 'us-central1'
})

const model = vertexai.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  },
})

// Helper to encode text for SSE
function encodeText(text: string) {
  return `data: ${text}\n\n`
}

// Retry helper with exponential backoff
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: Error | undefined
  
  for (let i = 0; i < RETRY_OPTIONS.maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < RETRY_OPTIONS.maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_OPTIONS.backoff[i]))
      }
    }
  }
  
  throw lastError
}

// Track analytics
async function trackAnalytics(data: Analytics) {
  try {
    await redis.lpush('hero:analytics', JSON.stringify(data))
    await redis.ltrim('hero:analytics', 0, 999) // Keep last 1000 entries
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Cache warming function
async function warmCache() {
  for (const prompt of COMMON_PROMPTS) {
    const messages = [{ role: 'user', content: prompt }]
    const cacheKey = `hero:${Buffer.from(JSON.stringify(messages)).toString('base64')}`
    
    // Skip if already cached
    const cached = await redis.get(cacheKey)
    if (cached) continue
    
    try {
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'I understand and will follow the format.' }] }
        ]
      })
      
      const result = await chat.sendMessage(prompt)
      const response = result.response
      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (text) {
        const parsed = JSON.parse(text)
        await redis.set(cacheKey, parsed, { ex: 3600 })
      }
    } catch (error) {
      console.error(`Cache warming failed for prompt: ${prompt}`, error)
    }
  }
}

export async function POST(req: Request) {
  const startTime = Date.now()
  const { messages, stream = false } = await req.json()
  const lastMessage = messages[messages.length - 1].content
  
  // Generate cache key from messages
  const cacheKey = `hero:${Buffer.from(JSON.stringify(messages)).toString('base64')}`

  try {
    // Check cache first
    const cached = await redis.get(cacheKey)
    if (cached && !stream) {
      await trackAnalytics({
        timestamp: Date.now(),
        prompt: lastMessage,
        cached: true,
        latency: Date.now() - startTime
      })
      return NextResponse.json(cached)
    }

    // If streaming is requested
    if (stream) {
      const encoder = new TextEncoder()
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            const chat = await withRetry(async () => model.startChat({
              history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'I understand and will follow the format.' }] }
              ]
            }))

            const result = await withRetry(async () => chat.sendMessageStream(lastMessage))
            let fullResponse = ''

            for await (const chunk of result.stream) {
              const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || ''
              fullResponse += text
              controller.enqueue(encoder.encode(encodeText(text)))
            }

            // Cache the complete response
            try {
              const parsed = JSON.parse(fullResponse)
              await redis.set(cacheKey, parsed, { ex: 3600 }) // Cache for 1 hour
              await trackAnalytics({
                timestamp: Date.now(),
                prompt: lastMessage,
                cached: false,
                latency: Date.now() - startTime
              })
            } catch (e) {
              console.error('Failed to cache response:', e)
              await trackAnalytics({
                timestamp: Date.now(),
                prompt: lastMessage,
                cached: false,
                error: e instanceof Error ? e.message : 'Unknown error',
                latency: Date.now() - startTime
              })
            }

            controller.close()
          } catch (error) {
            await trackAnalytics({
              timestamp: Date.now(),
              prompt: lastMessage,
              cached: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              latency: Date.now() - startTime
            })
            controller.error(error)
          }
        }
      })

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Non-streaming request
    const chat = await withRetry(async () => model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand and will follow the format.' }] }
      ]
    }))

    const result = await withRetry(async () => chat.sendMessage(lastMessage))
    const response = result.response
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text

    try {
      if (!text) throw new Error('Empty response')
      const parsed = JSON.parse(text)
      // Cache the response
      await redis.set(cacheKey, parsed, { ex: 3600 }) // Cache for 1 hour
      await trackAnalytics({
        timestamp: Date.now(),
        prompt: lastMessage,
        cached: false,
        latency: Date.now() - startTime
      })
      return NextResponse.json(parsed)
    } catch (e) {
      await trackAnalytics({
        timestamp: Date.now(),
        prompt: lastMessage,
        cached: false,
        error: e instanceof Error ? e.message : 'Unknown error',
        latency: Date.now() - startTime
      })
      // Fallback response if parsing fails
      const fallback = {
        response: text?.slice(0, 100) || 'Failed to generate response',
        tags: ["gemini", "ai"],
        options: ["Tell me more", "What's next?"],
        tools: ["next.js"]
      }
      return NextResponse.json(fallback)
    }
  } catch (error) {
    await trackAnalytics({
      timestamp: Date.now(),
      prompt: lastMessage,
      cached: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latency: Date.now() - startTime
    })
    console.error('Hero API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Endpoint to trigger cache warming
export async function GET() {
  try {
    await warmCache()
    return NextResponse.json({ status: 'Cache warming completed' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Cache warming failed' },
      { status: 500 }
    )
  }
} 
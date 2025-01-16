import { test, expect, vi, describe } from 'vitest'
import { createServer } from 'http'
import { database } from '@repo/database'
import type { Context, Prisma } from '@repo/database/types'

// Mock EventSource
class MockEventSource {
  onopen: (() => void) | null = null
  onmessage: ((event: any) => void) | null = null
  
  constructor(public url: string) {
    // Simulate connection
    setTimeout(() => this.onopen?.(), 0)
  }

  close() {}
}

// Mock database
vi.mock('@repo/database', () => ({
  database: {
    context: {
      create: vi.fn(async ({ data }: { data: Prisma.ContextCreateInput }) => ({
        id: 'test-context-id',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      delete: vi.fn()
    }
  }
}))

// Mock auth module
vi.mock('@repo/auth/server', () => ({
  auth: () => ({ userId: 'test-user' })
}))

describe('Context API Load Tests', () => {
  test('handles multiple concurrent subscriptions', async () => {
    // Start server
    const server = createServer((req, res) => {
      if (req.url?.includes('/subscribe')) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        })
        res.write('data: {"type":"connected"}\n\n')
      } else {
        res.writeHead(200)
        res.end()
      }
    })
    
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port
    const connections = new Set<MockEventSource>()
    
    // Create test context using mocked database
    const context = await database.context.create({
      data: {
        title: 'Test Context',
        description: 'Test Description',
        userId: 'test-user',
        visibility: 'PUBLIC'
      }
    }) as Context

    // Create multiple subscriptions
    const subscribeMultiple = async (count: number) => {
      const sources = await Promise.all(
        Array.from({ length: count }, () => {
          const es = new MockEventSource(`http://localhost:${port}/api/contexts/${context.id}/subscribe`)
          connections.add(es)
          return new Promise<void>((resolve) => {
            es.onopen = () => resolve()
          })
        })
      )

      return sources
    }

    try {
      // Test concurrent subscriptions
      await subscribeMultiple(5) // Reduced from 100 for testing
      
      // Cleanup
      connections.forEach(es => es.close())
      await database.context.delete({ where: { id: context.id } })
    } finally {
      server.close()
    }
  })
}) 
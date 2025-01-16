import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { z } from 'zod'

const createMessageSchema = z.object({
  content: z.string().min(1),
  type: z.enum(['USER', 'SYSTEM', 'AI']),
  metadata: z.record(z.any()).optional()
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const result = createMessageSchema.safeParse(json)
    if (!result.success) {
      return new Response('Invalid input', { status: 400 })
    }

    // Create message
    const message = await database.message.create({
      data: {
        ...result.data,
        contextId: params.id,
        userId: session.userId
      }
    })

    // Notify subscribers
    await pubsub.publish(`context:${params.id}`, {
      type: 'message.created',
      contextId: params.id,
      data: message,
      timestamp: new Date().toISOString()
    })

    return Response.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const messages = await database.message.findMany({
      where: {
        contextId: params.id
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return Response.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 
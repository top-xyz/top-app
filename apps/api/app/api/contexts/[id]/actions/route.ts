import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { z } from 'zod'

const createActionSchema = z.object({
  type: z.string(),
  payload: z.record(z.any()),
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
    const result = createActionSchema.safeParse(json)
    if (!result.success) {
      return new Response('Invalid input', { status: 400 })
    }

    // Create action
    const action = await database.action.create({
      data: {
        ...result.data,
        contextId: params.id,
        userId: session.userId,
        status: 'PENDING'
      }
    })

    // Queue action for execution
    await actionQueue.enqueue(action)

    return Response.json(action)
  } catch (error) {
    console.error('Error creating action:', error)
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

    const actions = await database.action.findMany({
      where: {
        contextId: params.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return Response.json(actions)
  } catch (error) {
    console.error('Error fetching actions:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 
import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { pubsub } from '@repo/notifications/pubsub'
import { z } from 'zod'

const updateContextSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional()
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const context = await database.context.findUnique({
      where: {
        id: params.id,
        OR: [
          { userId },
          { visibility: 'PUBLIC' }
        ]
      },
      include: {
        interactions: true
      }
    })

    if (!context) {
      return new Response('Not found', { status: 404 })
    }

    return Response.json(context)
  } catch (error) {
    console.error('Error fetching context:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const result = updateContextSchema.safeParse(json)
    if (!result.success) {
      return new Response('Invalid input', { status: 400 })
    }

    const context = await database.context.update({
      where: {
        id: params.id,
        userId: session.userId
      },
      data: result.data
    })

    // Publish update
    await pubsub.publish(`context:${params.id}`, {
      type: 'updated',
      contextId: params.id,
      data: context,
      timestamp: new Date().toISOString()
    })

    return Response.json(context)
  } catch (error) {
    console.error('Error updating context:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Delete context
    await database.context.delete({
      where: {
        id: params.id,
        userId: session.userId
      }
    })

    // Publish deletion event
    await pubsub.publish(`context:${params.id}`, {
      type: 'deleted',
      contextId: params.id,
      timestamp: new Date().toISOString()
    })

    // Clean up subscriptions
    await pubsub.cleanup(`context:${params.id}`)

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting context:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 
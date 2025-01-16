import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { analytics } from '@repo/analytics/posthog/server'
import { notifications } from '@repo/notifications'
import { z } from 'zod'

// Input validation
const createContextSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['TEMPLATE', 'CUSTOM', 'FORK']),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE')
})

export async function POST(request: Request) {
  try {
    // Auth check
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Validate input
    const json = await request.json()
    const result = createContextSchema.safeParse(json)
    if (!result.success) {
      return new Response('Invalid input', { status: 400 })
    }

    // Create context
    const context = await database.context.create({
      data: {
        ...result.data,
        userId,
        status: 'PENDING'
      }
    })

    // Track event
    await analytics.capture({
      event: 'context.created',
      distinctId: userId,
      properties: {
        contextId: context.id,
        type: context.type
      }
    })

    // Send notification
    await notifications.notify(userId, {
      type: 'context.created',
      contextId: context.id
    })

    return Response.json(context)
  } catch (error) {
    console.error('Error creating context:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const contexts = await database.context.findMany({
      where: {
        OR: [
          { userId },
          { visibility: 'PUBLIC' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(contexts)
  } catch (error) {
    console.error('Error fetching contexts:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 
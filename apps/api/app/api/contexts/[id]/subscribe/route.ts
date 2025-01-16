import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { notifications } from '@repo/notifications'
import { PubSub } from '@repo/notifications/pubsub'

// Create pubsub instance for real-time updates
const pubsub = new PubSub()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Verify context access
    const context = await database.context.findUnique({
      where: {
        id: params.id,
        OR: [
          { userId: session.userId },
          { visibility: 'PUBLIC' }
        ]
      }
    })

    if (!context) {
      return new Response('Not found', { status: 404 })
    }

    // Set up SSE stream
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Subscribe to context updates
    const subscription = await pubsub.subscribe(
      `context:${params.id}`,
      async (update) => {
        const data = JSON.stringify(update)
        await writer.write(encoder.encode(`data: ${data}\n\n`))
      }
    )

    // Clean up on disconnect
    request.signal.addEventListener('abort', () => {
      subscription.unsubscribe()
      writer.close()
    })

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Error setting up context subscription:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 
import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { previewSystem } from '@repo/preview'
import { z } from 'zod'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Generate preview
    const preview = await previewSystem.create({
      contextId: params.id,
      userId: session.userId
    })

    return Response.json(preview)
  } catch (error) {
    console.error('Error generating preview:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 
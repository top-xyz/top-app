import { auth } from '@repo/auth/server'
import { database } from '@repo/database'
import { aiPipeline, type ContextGenerationInput } from '@repo/ai'
import { z } from 'zod'

const generateContextSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  requirements: z.array(z.string()).min(1),
  constraints: z.array(z.string()).optional(),
  template: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const result = generateContextSchema.safeParse(json)
    if (!result.success) {
      return new Response('Invalid input', { status: 400 })
    }

    // Generate context
    const input: ContextGenerationInput = {
      ...result.data,
      userId: session.userId
    }

    const generated = await aiPipeline.generateContext(input)

    // Create database record
    const context = await database.context.create({
      data: {
        title: generated.title,
        description: generated.description,
        userId: session.userId,
        metadata: generated.metadata,
        files: generated.structure.files,
        configuration: generated.structure.configuration
      }
    })

    return Response.json(context)
  } catch (error) {
    console.error('Error generating context:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 
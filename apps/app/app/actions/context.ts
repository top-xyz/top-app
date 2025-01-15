import { database } from '@repo/database'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

export type CreateContextInput = {
  name: string
  description?: string
  type: 'TEMPLATE' | 'CUSTOM' | 'FORK'
  requirements?: string[]
}

export async function createContext(input: CreateContextInput) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const context = await database.context.create({
    data: {
      name: input.name,
      description: input.description,
      type: input.type,
      requirements: input.requirements || [],
      status: 'PENDING',
      userId,
    },
  })

  revalidatePath('/contexts')
  return context
}

export async function getContext(id: string) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const context = await database.context.findUnique({
    where: { id },
    include: {
      files: true,
      questions: true,
      interactions: {
        orderBy: { createdAt: 'asc' },
      },
      deployments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!context || context.userId !== userId) {
    throw new Error('Context not found')
  }

  return context
}

export async function updateContextStatus(id: string, status: 'PENDING' | 'QUESTIONING' | 'GENERATING' | 'COMPLETE' | 'FAILED') {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const context = await database.context.update({
    where: { id, userId },
    data: { status },
  })

  revalidatePath(`/contexts/${id}`)
  return context
}

export async function addContextInteraction(contextId: string, type: 'SYSTEM' | 'USER' | 'AI' | 'ERROR', content: string) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  const interaction = await database.contextInteraction.create({
    data: {
      contextId,
      type,
      content,
    },
  })

  revalidatePath(`/contexts/${contextId}`)
  return interaction
}

export async function getUserContexts() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')

  return database.context.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      deployments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })
} 
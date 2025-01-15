'use server'

import { addContextInteraction } from '@repo/database'

export async function sendMessage(id: string, message: string) {
  // Add user message
  await addContextInteraction(id, 'USER', message)

  // Add AI message
  await addContextInteraction(id, 'AI', 'This is a test response')
}

export async function regenerateResponse(id: string) {
  await addContextInteraction(id, 'AI', 'This is a regenerated response')
} 
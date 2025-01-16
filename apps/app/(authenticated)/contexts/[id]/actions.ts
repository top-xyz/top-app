'use server'

export async function sendMessage(contextId: string, message: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contexts/${contextId}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'USER', content: message }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function regenerateResponse(contextId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contexts/${contextId}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'REGENERATE' }),
  })
  if (!res.ok) throw new Error('Failed to regenerate response')
  return res.json()
} 
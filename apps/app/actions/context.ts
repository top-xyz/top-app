'use server'

export async function getContext(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contexts/${id}`)
  if (!res.ok) throw new Error('Failed to fetch context')
  return res.json()
}

export async function addContextInteraction(id: string, type: 'USER' | 'AI', content: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contexts/${id}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, content }),
  })
  if (!res.ok) throw new Error('Failed to add interaction')
  return res.json()
} 
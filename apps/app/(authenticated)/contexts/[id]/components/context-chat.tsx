'use client'

import * as React from 'react'
import { Button } from '@repo/design-system/components/ui/button'
import { ChatInput } from '@repo/design-system/components/ui/chat-input'
import { Message } from '@repo/ai/components/message'
import { Thread } from '@repo/ai/components/thread'
import { notFound } from 'next/navigation'
import { getContext, addContextInteraction } from '../../../../actions/context'

interface ContextChatProps {
  id: string
}

interface Interaction {
  role: 'user' | 'ai' | 'system' | 'error'
  content: string
}

export function ContextChat({ id }: ContextChatProps) {
  const [messages, setMessages] = React.useState<Interaction[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const loadContext = React.useCallback(async () => {
    try {
      const context = await getContext(id)
      if (!context) {
        notFound()
      }

      // Convert interactions to messages
      const newMessages = context.interactions.map((interaction: { role: string; content: string }) => ({
        role: interaction.role.toLowerCase() as Interaction['role'],
        content: interaction.content
      }))
      setMessages(newMessages)
    } catch (err) {
      setError('Failed to load context')
      console.error('Error loading context:', err)
    }
  }, [id])

  React.useEffect(() => {
    loadContext()
  }, [loadContext])

  const handleSubmit = async (message: string) => {
    try {
      setLoading(true)
      setError(null)

      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }])

      // Add interaction
      await addContextInteraction(id, 'USER', message)

      // Reload context to get new messages
      await loadContext()
    } catch (err) {
      setError('Failed to send message')
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Message role="error" content={error} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
      </div>

      <div className="border-t p-4">
        <ChatInput
          onSubmit={handleSubmit}
          disabled={loading}
          placeholder="Ask a question about your code..."
        />
      </div>
    </div>
  )
} 
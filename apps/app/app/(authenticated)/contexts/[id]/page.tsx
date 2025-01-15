import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getContext, addContextInteraction } from '../../../actions/context'
import { Button, ChatInput } from '@repo/design-system'
import { Message, Thread } from '@repo/ai'

async function ContextChat({ id }: { id: string }) {
  const context = await getContext(id)
  
  if (!context) {
    notFound()
  }

  async function sendMessage(message: string) {
    'use server'
    
    // Add user message
    await addContextInteraction(id, 'USER', message)
    
    // TODO: Process with AI and add AI response
    await addContextInteraction(id, 'AI', 'This is a placeholder AI response. AI integration coming soon!')
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-none px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{context.name}</h2>
            {context.description && (
              <p className="text-sm text-gray-500">{context.description}</p>
            )}
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
            {context.status.toLowerCase()}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <Thread>
          {context.interactions.map((interaction) => (
            <Message
              key={interaction.id}
              role={interaction.type.toLowerCase()}
              content={interaction.content}
            />
          ))}
        </Thread>
      </div>
      
      <div className="flex-none">
        <ChatInput 
          onSubmit={sendMessage}
          disabled={context.status === 'COMPLETE' || context.status === 'FAILED'}
          placeholder="Type your message..."
        />
        
        {context.deployments[0] && (
          <div className="p-4 border-t bg-gray-50">
            <Button
              variant="outline"
              href={context.deployments[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Preview
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContextPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<div>Loading...</div>}>
        <ContextChat id={params.id} />
      </Suspense>
    </div>
  )
} 
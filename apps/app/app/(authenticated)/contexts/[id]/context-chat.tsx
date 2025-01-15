'use client'

import { Button } from '@repo/design-system'
import { ChatInput } from '@repo/design-system'
import { sendMessage, regenerateResponse } from './actions'

interface Interaction {
  id: string
  type: 'USER' | 'AI' | 'SYSTEM' | 'ERROR'
  content: string
}

interface Context {
  id: string
  name: string
  deployments: Array<{ url: string }>
  interactions: Interaction[]
}

function Message({ interaction }: { interaction: Interaction }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {interaction.type.toLowerCase()}
        </span>
      </div>
      <div className="text-sm">{interaction.content}</div>
    </div>
  )
}

export function ContextChat({ context }: { context: Context }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{context.name}</h1>
        {context.deployments[0] && (
          <Button
            onClick={() => window.open(context.deployments[0].url, '_blank', 'noopener,noreferrer')}
          >
            View Deployment
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {context.interactions.map((interaction) => (
          <Message key={interaction.id} interaction={interaction} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <ChatInput
          onSubmit={async (message) => {
            await sendMessage(context.id, message)
          }}
          onRegenerate={async () => {
            await regenerateResponse(context.id)
          }}
        />
      </div>
    </div>
  )
} 
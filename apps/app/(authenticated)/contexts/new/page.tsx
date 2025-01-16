import { Metadata } from 'next'
import { ContextForm } from './components/context-form'
import { PageHeader } from '@repo/design-system/components/ui/page-header'

export const metadata: Metadata = {
  title: 'New Context',
  description: 'Create a new development context'
}

export default function NewContextPage() {
  async function handleSubmit(data: any) {
    'use server'
    
    const response = await fetch('/api/contexts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to create context')
    }

    return response.json()
  }

  return (
    <div className="container max-w-screen-lg py-6">
      <PageHeader
        title="Create New Context"
        description="Start a new development context with AI assistance"
      />
      <div className="mt-8">
        <ContextForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 
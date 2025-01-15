import { Suspense } from 'react'
import { getUserContexts } from '../../actions/context'
import { Button } from '@repo/design-system'
import Link from 'next/link'

function ContextCard({ context }: { context: Awaited<ReturnType<typeof getUserContexts>>[0] }) {
  const deployment = context.deployments[0]
  
  return (
    <div className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{context.name}</h3>
          {context.description && (
            <p className="text-sm text-gray-500 mt-1">{context.description}</p>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
          {context.status.toLowerCase()}
        </span>
      </div>
      
      {deployment && (
        <div className="mt-4 text-sm">
          <a 
            href={deployment.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Preview →
          </a>
        </div>
      )}
    </div>
  )
}

async function ContextsList() {
  const contexts = await getUserContexts()
  
  if (contexts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No contexts yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first context</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contexts.map((context) => (
        <Link key={context.id} href={`/contexts/${context.id}`}>
          <ContextCard context={context} />
        </Link>
      ))}
    </div>
  )
}

export default function ContextsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Contexts</h1>
        <Button asChild>
          <Link href="/contexts/new">
            New Context
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <ContextsList />
      </Suspense>
    </div>
  )
} 
import { useState } from 'react'
import { Button } from '@repo/design-system/components/ui/button'
import { Icons } from '@repo/design-system/components/ui/icons'
import { Input } from '@repo/design-system/components/ui/input'
import { Badge } from '@repo/design-system/components/ui/badge'

interface ContextListProps {
  contexts: Array<{
    id: string
    title: string
    type: string
    files: number
    members: number
    active?: boolean
  }>
  onSelect: (id: string) => void
  selectedId?: string
}

export function ContextList({ contexts, onSelect, selectedId }: ContextListProps) {
  const [filter, setFilter] = useState('')

  const filteredContexts = contexts.filter(context =>
    context.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Active Contexts</h2>
          <Button variant="ghost" size="icon">
            <Icons.plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icons.search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Filter contexts..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredContexts.map(context => (
          <button
            key={context.id}
            onClick={() => onSelect(context.id)}
            className={`w-full text-left p-3 hover:bg-accent transition-colors ${
              context.id === selectedId ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {context.type === 'feature' && (
                    <Icons.gitBranch className="h-4 w-4" />
                  )}
                  {context.type === 'docs' && (
                    <Icons.fileText className="h-4 w-4" />
                  )}
                  {context.type === 'review' && (
                    <Icons.gitPullRequest className="h-4 w-4" />
                  )}
                  <span className="font-medium">{context.title}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {context.files} files • {context.members} members
                </div>
              </div>
              {context.active && (
                <Badge variant="secondary">
                  Active
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 
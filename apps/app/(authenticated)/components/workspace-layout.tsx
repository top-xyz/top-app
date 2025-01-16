import { useState } from 'react'
import { ContextList } from '../contexts/components/context-list'
import { CommandPalette } from './command-palette'
import { ToolsPanel } from './tools-panel'
import { Icons } from '@repo/design-system/components/ui/icons'
import { cn } from '@repo/design-system/lib/utils'

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [activeContext, setActiveContext] = useState<string>()

  return (
    <div className="h-screen flex">
      {/* Left Panel - Navigation */}
      <div className="w-64 border-r">
        <div className="h-14 flex items-center px-4 border-b">
          <div className="flex items-center gap-2">
            <Icons.cube className="h-5 w-5" />
            <span className="font-semibold">Smart Context</span>
          </div>
        </div>
        <ContextList
          contexts={[]} // TODO: Fetch contexts
          selectedId={activeContext}
          onSelect={setActiveContext}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Right Panel - Tools */}
      <div className="w-80 border-l">
        <ToolsPanel contextId={activeContext} />
      </div>

      {/* Command Palette */}
      <CommandPalette 
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
    </div>
  )
} 
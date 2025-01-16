import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger, Button, Icons } from '@repo/design-system'

interface ToolsPanelProps {
  contextId?: string
}

export function ToolsPanel({ contextId }: ToolsPanelProps) {
  const [activeTab, setActiveTab] = useState('actions')

  if (!contextId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Select a context to view tools</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 flex items-center px-4 border-b">
        <h2 className="font-semibold">Tools</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          <TabsTrigger value="actions" className="gap-2">
            <Icons.zap className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <Icons.folder className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Icons.brain className="h-4 w-4" />
            AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="flex-1 p-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Icons.play className="h-4 w-4" />
              Run Tests
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Icons.gitBranch className="h-4 w-4" />
              Create Branch
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Icons.rocket className="h-4 w-4" />
              Deploy Preview
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="files" className="flex-1 p-4">
          {/* File tree component */}
        </TabsContent>

        <TabsContent value="ai" className="flex-1 p-4">
          {/* AI assistance component */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 
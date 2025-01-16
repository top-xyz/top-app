import * as React from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { Brain, FileCode, GitBranch, Users } from 'lucide-react'

interface ContextFile {
  name: string
  type: 'code' | 'config' | 'doc'
  preview?: string
}

interface ContextPreviewProps {
  title?: string
  files: ContextFile[]
  activity?: string[]
  className?: string
}

export function ContextPreview({
  title = "Smart Context",
  files,
  activity,
  className
}: ContextPreviewProps) {
  const [activeFile, setActiveFile] = React.useState(files[0])

  return (
    <div className={cn(
      "rounded-xl overflow-hidden",
      "bg-background/50 backdrop-blur-xl",
      "border border-border/50",
      "shadow-glow-subtle",
      className
    )}>
      {/* Context Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <GitBranch className="w-3.5 h-3.5" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>3 members</span>
          </div>
        </div>
      </div>

      {/* Context Content */}
      <div className="grid grid-cols-[200px,1fr] divide-x divide-border/50">
        {/* File List */}
        <div className="p-2 space-y-1">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file)}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-left",
                "hover:bg-primary/10 transition-colors",
                activeFile === file && "bg-primary/10"
              )}
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-sm">{file.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* File Preview */}
        <div className="p-4">
          {activeFile.preview ? (
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
              {activeFile.preview}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No preview available
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      {activity && (
        <div className="border-t border-border/50 p-4">
          <div className="text-xs font-medium mb-2">Recent Activity</div>
          <div className="space-y-2">
            {activity.map((item, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 
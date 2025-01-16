import * as React from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { MessageSquare, Bot } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPreviewProps {
  title?: string
  chat: ChatMessage[]
  className?: string
}

export function ChatPreview({
  title,
  chat,
  className
}: ChatPreviewProps) {
  return (
    <div className={cn(
      "rounded-xl overflow-hidden",
      "bg-background/50 backdrop-blur-xl",
      "border border-border/50",
      "shadow-glow-subtle",
      className
    )}>
      {/* Chat Header */}
      {title && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="p-4 space-y-4">
        {chat.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              message.role === 'assistant' && "items-start",
              message.role === 'user' && "items-start justify-end"
            )}
          >
            {message.role === 'assistant' && (
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={cn(
              "px-4 py-2 rounded-xl max-w-[80%]",
              message.role === 'assistant' && "bg-muted",
              message.role === 'user' && "bg-primary text-primary-foreground"
            )}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
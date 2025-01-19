"use client"

import { createElement } from 'react'
import { cn } from '../lib/utils'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn(
      "prose prose-invert max-w-none",
      "prose-blockquote:border-l-primary/50",
      "prose-blockquote:text-muted-foreground",
      "prose-strong:text-primary",
      className
    )}>
      {content.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1
          const text = line.replace(/^#+\s*/, '')
          return createElement(`h${Math.min(level, 6)}`, { key: i }, text)
        }
        if (line.startsWith('- ')) {
          return <li key={i}>{line.slice(2)}</li>
        }
        if (line.startsWith('> ')) {
          return <blockquote key={i}>{line.slice(2)}</blockquote>
        }
        return <p key={i}>{line}</p>
      })}
    </div>
  )
} 
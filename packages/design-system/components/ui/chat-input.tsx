'use client'

import * as React from 'react'
import { Button } from './button'
import { Textarea } from './textarea'
import { cn } from '../../lib/utils'

export interface ChatInputProps {
  onSubmit: (message: string) => void
  onRegenerate?: () => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSubmit,
  onRegenerate,
  disabled,
  placeholder = 'Type a message...',
  className
}: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled) return

    onSubmit(message)
    setMessage('')
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-2 p-4', className)}>
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            adjustHeight()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[60px] flex-1 resize-none"
          rows={1}
        />
        <Button type="submit" disabled={!message.trim() || disabled}>
          Send
        </Button>
      </div>
      {onRegenerate && (
        <Button
          type="button"
          variant="outline"
          onClick={onRegenerate}
          disabled={disabled}
          className="w-full"
        >
          Regenerate Response
        </Button>
      )}
    </form>
  )
} 
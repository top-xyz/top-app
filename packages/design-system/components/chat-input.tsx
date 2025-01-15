'use client'

import { useRef, useEffect } from 'react'
import { Button } from './button'
import { SendIcon } from 'lucide-react'

export interface ChatInputProps {
  onSubmit: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({ onSubmit, placeholder = 'Type a message...', disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener('input', adjustHeight)
    return () => textarea.removeEventListener('input', adjustHeight)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = textareaRef.current?.value.trim()
    if (!message) return

    onSubmit(message)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 bg-white border-t">
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none p-2 min-h-[40px] max-h-[200px] overflow-y-auto"
        onKeyDown={handleKeyDown}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={disabled}
        className="flex-none"
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  )
} 
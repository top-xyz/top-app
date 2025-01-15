import * as React from 'react'

export interface MessageProps {
  role: 'system' | 'user' | 'ai' | 'error'
  content: string
}

export function Message({ role, content }: MessageProps) {
  return (
    <div className={`flex flex-col gap-2 ${role === 'user' ? 'items-end' : 'items-start'}`}>
      <div
        className={`
          max-w-[80%] rounded-lg px-4 py-2
          ${role === 'user' ? 'bg-blue-500 text-white' : ''}
          ${role === 'ai' ? 'bg-gray-100 text-gray-900' : ''}
          ${role === 'system' ? 'bg-gray-500 text-white' : ''}
          ${role === 'error' ? 'bg-red-500 text-white' : ''}
        `}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

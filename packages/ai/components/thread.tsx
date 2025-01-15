import * as React from 'react'

export interface ThreadProps {
  children: React.ReactNode
}

export function Thread({ children }: ThreadProps) {
  return (
    <div className="flex flex-col gap-4">
      {children}
    </div>
  )
}

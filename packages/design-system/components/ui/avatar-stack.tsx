'use client'

import * as React from 'react'
import { Avatar, AvatarImage } from './avatar'
import { cn } from '@repo/design-system/lib/utils'

interface AvatarStackProps {
  users: Array<{
    id: string
    name: string
    avatar: string
  }>
  limit?: number
  className?: string
}

export function AvatarStack({ users, limit = 3, className }: AvatarStackProps) {
  const visibleUsers = users.slice(0, limit)
  const remainingCount = Math.max(0, users.length - limit)

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleUsers.map((user) => (
        <Avatar key={user.id} className="ring-2 ring-background">
          <AvatarImage src={user.avatar} alt={user.name} />
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background">
          <span className="text-xs text-muted-foreground">+{remainingCount}</span>
        </div>
      )}
    </div>
  )
} 
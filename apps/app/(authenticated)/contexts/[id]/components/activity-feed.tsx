import { Icons } from '@repo/design-system/components/ui/icons'
import { Avatar, AvatarImage } from '@repo/design-system/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  type: 'update' | 'comment' | 'action'
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: Date
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-4 p-4">
      {items.map(item => (
        <div key={item.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={item.user.avatar}
              alt={item.user.name}
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div className="mt-1 text-sm">
              {item.type === 'update' && (
                <div className="flex items-center gap-2">
                  <Icons.gitCommit className="h-4 w-4" />
                  <span>{item.content}</span>
                </div>
              )}
              {item.type === 'comment' && (
                <div className="bg-muted rounded-lg p-3">
                  {item.content}
                </div>
              )}
              {item.type === 'action' && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.play className="h-4 w-4" />
                  <span>{item.content}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 
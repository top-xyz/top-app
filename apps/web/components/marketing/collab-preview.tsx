import * as React from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { Users, UserCircle, MessageSquare, GitBranch, Activity } from 'lucide-react'

interface TeamMember {
  name: string
  avatar: string
  status: 'online' | 'offline'
  lastActive?: string
}

interface CollabPreviewProps {
  title?: string
  className?: string
}

export function CollabPreview({
  title = "Team Collaboration",
  className
}: CollabPreviewProps) {
  const [activeTab, setActiveTab] = React.useState<'team' | 'activity'>('team')
  const [selectedMember, setSelectedMember] = React.useState<string | null>(null)

  const teamMembers: TeamMember[] = [
    { name: "Alice Chen", avatar: "AC", status: 'online' },
    { name: "Bob Smith", avatar: "BS", status: 'online' },
    { name: "Carol Wu", avatar: "CW", status: 'offline', lastActive: '5m ago' },
    { name: "David Lee", avatar: "DL", status: 'offline', lastActive: '1h ago' }
  ]

  const activities = [
    { user: "Alice Chen", action: "updated auth flow", time: "2m ago" },
    { user: "Bob Smith", action: "added dark mode", time: "15m ago" },
    { user: "Carol Wu", action: "fixed mobile menu", time: "1h ago" },
    { user: "David Lee", action: "deployed v1.0.2", time: "2h ago" }
  ]

  return (
    <div className={cn(
      "rounded-xl overflow-hidden",
      "bg-background/50 backdrop-blur-xl",
      "border border-border/50",
      "shadow-glow-subtle",
      className
    )}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 3).map((member, i) => (
              <div
                key={member.name}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  "text-xs font-medium text-white",
                  "ring-2 ring-background",
                  i === 0 && "bg-blue-500",
                  i === 1 && "bg-green-500",
                  i === 2 && "bg-purple-500"
                )}
              >
                {member.avatar}
              </div>
            ))}
          </div>
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
            +1
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab('team')}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium",
            "border-b-2 transition-colors",
            activeTab === 'team' ? (
              "border-primary text-primary"
            ) : (
              "border-transparent text-muted-foreground hover:text-foreground"
            )
          )}
        >
          Team
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium",
            "border-b-2 transition-colors",
            activeTab === 'activity' ? (
              "border-primary text-primary"
            ) : (
              "border-transparent text-muted-foreground hover:text-foreground"
            )
          )}
        >
          Activity
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'team' ? (
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <button
                key={member.name}
                onClick={() => setSelectedMember(member.name)}
                className={cn(
                  "w-full p-2 rounded-lg",
                  "flex items-center justify-between",
                  "transition-colors",
                  selectedMember === member.name ? (
                    "bg-primary/10"
                  ) : (
                    "hover:bg-muted"
                  )
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "text-sm font-medium text-white",
                    "bg-primary"
                  )}>
                    {member.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.status === 'online' ? (
                        <span className="text-green-500">● Online</span>
                      ) : (
                        <span>Last active {member.lastActive}</span>
                      )}
                    </div>
                  </div>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  "text-sm font-medium text-white bg-primary"
                )}>
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    {activity.action}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
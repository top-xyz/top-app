import { Button } from '@repo/design-system/components/ui/button'
import { Icons } from '@repo/design-system/components/ui/icons'
import { AvatarStack } from '@repo/design-system/components/ui/avatar-stack'

interface ContextHeaderProps {
  title: string
  members: Array<{
    id: string
    name: string
    avatar: string
  }>
  onShare: () => void
  onOpen: () => void
}

export function ContextHeader({ title, members, onShare, onOpen }: ContextHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Icons.gitBranch className="h-4 w-4" />
          <span>0</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AvatarStack users={members} limit={3} />
        <Button variant="outline" onClick={onShare}>
          Share
        </Button>
        <Button onClick={onOpen}>
          Open
        </Button>
      </div>
    </div>
  )
} 
import { Icons } from './icons'
import { cn } from '@repo/design-system'

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <Icons.spinner className={cn('h-6 w-6 animate-spin', className)} />
    </div>
  )
} 
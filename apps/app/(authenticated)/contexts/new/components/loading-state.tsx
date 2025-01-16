import { Icons } from '@repo/design-system/components/ui/icons'

interface LoadingStateProps {
  step: 'analyzing' | 'generating' | 'preparing'
  progress?: number
}

export function LoadingState({ step, progress }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Icons.spinner className="h-8 w-8 animate-spin" />
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium">
          {step === 'analyzing' && 'Analyzing Requirements...'}
          {step === 'generating' && 'Generating Context...'}
          {step === 'preparing' && 'Preparing Environment...'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {step === 'analyzing' && 'Reviewing your requirements and constraints'}
          {step === 'generating' && 'Creating project structure and configuration'}
          {step === 'preparing' && 'Setting up your development environment'}
        </p>
      </div>
    </div>
  )
} 
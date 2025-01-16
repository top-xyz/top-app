import { Card } from '@repo/design-system/components/ui/card'
import { Icons } from '@repo/design-system/components/ui/icons'
import { Button } from '@repo/design-system/components/ui/button'
import type { GeneratedContext } from '@repo/ai'

interface ContextPreviewProps {
  context: GeneratedContext
  onAccept: () => void
  onRegenerate: () => void
}

export function ContextPreview({ context, onAccept, onRegenerate }: ContextPreviewProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium">{context.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {context.description}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Project Structure</h4>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm">
              {context.structure.files.map(file => (
                <div key={file.path} className="flex items-center gap-2">
                  <Icons.fileText className="h-4 w-4" />
                  <span>{file.path}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onRegenerate}>
            Regenerate
          </Button>
          <Button onClick={onAccept}>
            Accept & Continue
          </Button>
        </div>
      </div>
    </Card>
  )
} 
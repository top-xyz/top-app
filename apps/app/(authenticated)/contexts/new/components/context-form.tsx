import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@repo/design-system/components/ui/button'
import { Input } from '@repo/design-system/components/ui/input'
import { Textarea } from '@repo/design-system/components/ui/textarea'
import { Card } from '@repo/design-system/components/ui/card'
import { Icons } from '@repo/design-system/components/ui/icons'
import { toast } from 'sonner'

interface ContextFormProps {
  onSubmit: (data: ContextFormData) => Promise<void>
}

interface ContextFormData {
  title: string
  description: string
  requirements: string[]
}

export function ContextForm({ onSubmit }: ContextFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        requirements
      }

      await onSubmit(data)
      toast.success('Context created successfully')
      router.push('/contexts')
    } catch (error) {
      toast.error('Failed to create context')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="What are you building?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements</label>
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={req}
                  onChange={e => {
                    const newReqs = [...requirements]
                    newReqs[i] = e.target.value
                    setRequirements(newReqs)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setRequirements(requirements.filter((_, j) => j !== i))
                  }}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setRequirements([...requirements, ''])}
            >
              Add Requirement
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              'Create Context'
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
} 
'use client'

import { Dialog, DialogContent } from '@repo/design-system/components/ui/dialog'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="p-4">
          {/* TODO: Add command search and results */}
          <p>Command palette coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
import { Button } from "@mindorbit/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mindorbit/ui/components/dialog"
import { Input } from "@mindorbit/ui/components/input"
import * as React from "react"

interface CreateIdeaDialogProps {
  title: string
  onTitleChange: (v: string) => void
  onCreate: () => void
  onClose: () => void
  creating: boolean
}

export function CreateIdeaDialog({
  title,
  onTitleChange,
  onCreate,
  onClose,
  creating,
}: CreateIdeaDialogProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Idea</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            ref={inputRef}
            autoFocus
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !creating && onCreate()}
            placeholder="Give your idea a title..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={onCreate} disabled={creating || !title.trim()}>
            {creating ? "Creating..." : "Create Idea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

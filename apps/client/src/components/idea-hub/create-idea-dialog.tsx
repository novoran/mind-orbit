import { cn } from "@mindorbit/ui/lib/utils"
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

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-card border-border relative w-full max-w-md rounded-2xl border p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold">Create New Idea</h2>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !creating && onCreate()}
          placeholder="Give your idea a title..."
          className={cn(
            "border-border bg-background w-full rounded-lg border px-4 py-2.5 text-sm",
            "focus:ring-primary/50 focus:border-primary focus:ring-2 focus:outline-none",
            "transition-all duration-200"
          )}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border-border hover:bg-muted rounded-lg border px-4 py-2 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={!title.trim() || creating}
            className={cn(
              "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-all",
              "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {creating ? "Creating..." : "Create & Open"}
          </button>
        </div>
      </div>
    </div>
  )
}

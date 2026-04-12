import { Idea01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface EmptyStateProps {
  onNew: () => void
  hasSearch: boolean
}

export function EmptyState({ onNew, hasSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-2xl">
        <HugeiconsIcon
          icon={Idea01Icon}
          size={40}
          className="text-muted-foreground"
        />
      </div>
      <div className="text-center">
        <h3 className="font-semibold">
          {hasSearch ? "No ideas found" : "No ideas yet"}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {hasSearch
            ? "Try a different search term"
            : "Create your first collaborative workspace"}
        </p>
      </div>
      {!hasSearch && (
        <button
          onClick={onNew}
          className="bg-primary text-primary-foreground flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Create Idea
        </button>
      )}
    </div>
  )
}

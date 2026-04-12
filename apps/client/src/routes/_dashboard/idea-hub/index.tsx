import { useConvexMutation } from "@convex-dev/react-query"
import { PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { api } from "@mindorbit/backend/_generated/api"
import { cn } from "@mindorbit/ui/lib/utils"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as React from "react"

import { CreateIdeaDialog } from "@/components/idea-hub/create-idea-dialog"
import { IdeaCardSkeleton } from "@/components/idea-hub/idea-card-skeleton"
import { IdeaGrid } from "@/components/idea-hub/idea-grid"

export const Route = createFileRoute("/_dashboard/idea-hub/")({
  component: IdeaHubPage,
})

function IdeaHubPage() {
  const [search, setSearch] = React.useState("")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [creating, setCreating] = React.useState(false)

  const navigate = useNavigate()
  const createIdea = useConvexMutation(api.ideas.create)

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const id = await createIdea({ title: newTitle.trim() })
      setShowCreateDialog(false)
      setNewTitle("")
      navigate({ to: "/idea-hub/$ideaId", params: { ideaId: id } })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Idea Hub</h1>
        <p className="text-muted-foreground text-sm">
          Your collaborative Miro-style workspaces
        </p>
      </div>

      {/* Search + New */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas..."
            className={cn(
              "border-border bg-background w-full rounded-lg border py-2 pr-4 pl-9 text-sm",
              "focus:ring-primary/50 focus:border-primary focus:ring-2 focus:outline-none",
              "transition-all duration-200"
            )}
          />
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className={cn(
            "bg-primary text-primary-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
            "hover:bg-primary/90 transition-colors"
          )}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          New Idea
        </button>
      </div>

      {/* Grid with Local Suspense */}
      <React.Suspense fallback={<IdeaCardSkeleton />}>
        <IdeaGrid search={search} onNewIdea={() => setShowCreateDialog(true)} />
      </React.Suspense>

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateIdeaDialog
          title={newTitle}
          onTitleChange={setNewTitle}
          onCreate={handleCreate}
          onClose={() => {
            setShowCreateDialog(false)
            setNewTitle("")
          }}
          creating={creating}
        />
      )}
    </div>
  )
}

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  DashboardSquare01Icon,
  Menu01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { api } from "@mindorbit/backend/_generated/api"
import { cn } from "@mindorbit/ui/lib/utils"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as React from "react"

import { Button } from "@mindorbit/ui/components/button"
import { SearchInput } from "@mindorbit/ui/components/search-input"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useAction } from "convex/react"
import { CreateIdeaDialog } from "@/components/idea-hub/create-idea-dialog"
import { IdeaCardSkeleton } from "@/components/idea-hub/idea-card-skeleton"
import { IdeaGrid } from "@/components/idea-hub/idea-grid"
import { IdeaTable } from "@/components/idea-hub/idea-table"
import { IdeaTableSkeleton } from "@/components/idea-hub/idea-table-skeleton"

export const Route = createFileRoute("/_dashboard/idea-hub/")({
  component: IdeaHubPage,
})

function IdeaHubPage() {
  const [search, setSearch] = React.useState("")
  const [viewType, setViewType] = React.useState<"grid" | "list">("list")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [creating, setCreating] = React.useState(false)

  const navigate = useNavigate()
  const createIdea = useConvexMutation(api.ideas.create)
  const removeIdeaAction = useAction(api.ideas.remove)

  const { mutate: deleteIdea } = useMutation({
    mutationFn: removeIdeaAction,
  })

  const { data: ideas, isLoading } = useQuery(convexQuery(api.ideas.list, {}))

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

  const filtered = React.useMemo(() => {
    if (!ideas) return []
    if (!search) return ideas
    return ideas.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [ideas, search])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Idea Hub</h1>
        <p className="text-muted-foreground text-sm">
          Brainstorm, organize, and collaborate on your ideas in real-time.
        </p>
      </div>

      {/* Search + View Toggle + New Idea */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ideas..."
          containerClassName="max-w-sm"
        />

        <div className="flex items-center gap-3">
          <div className="bg-muted/50 flex items-center rounded-lg p-1">
            <button
              onClick={() => setViewType("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-all",
                viewType === "list"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:bg-background/50"
              )}
              title="List View"
            >
              <HugeiconsIcon icon={Menu01Icon} size={14} />
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-all",
                viewType === "grid"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground hover:bg-background/50"
              )}
              title="Grid View"
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} size={14} />
            </button>
          </div>

          <Button onClick={() => setShowCreateDialog(true)} className="h-10">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            <span>New Idea</span>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {isLoading ? (
          viewType === "list" ? (
            <IdeaTableSkeleton />
          ) : (
            <IdeaCardSkeleton />
          )
        ) : viewType === "list" ? (
          <IdeaTable
            ideas={filtered}
            onOpen={(id) => navigate({ to: `/idea-hub/${id}` })}
            onDelete={(id) => deleteIdea({ id })}
          />
        ) : (
          <IdeaGrid
            ideas={filtered}
            search={search}
            onNewIdea={() => setShowCreateDialog(true)}
            onOpen={(id) => navigate({ to: `/idea-hub/${id}` })}
            onDelete={(id) => deleteIdea({ id })}
          />
        )}
      </div>

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

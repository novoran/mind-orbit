import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  Clock01Icon,
  Idea01Icon,
  MoreVerticalIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { api } from "@mindorbit/backend/_generated/api"
import { cn } from "@mindorbit/ui/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as React from "react"

export const Route = createFileRoute("/_dashboard/idea-hub/")({
  component: IdeaHubPage,
})

// ─── Random cover gradients for idea cards ──────────────────────────────────
const CARD_GRADIENTS = [
  "from-violet-500/20 to-indigo-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-amber-500/20 to-orange-500/20",
  "from-emerald-500/20 to-teal-500/20",
  "from-sky-500/20 to-cyan-500/20",
  "from-purple-500/20 to-fuchsia-500/20",
]

function getGradient(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return CARD_GRADIENTS[Math.abs(hash) % CARD_GRADIENTS.length]
}

// ─── Format relative date ────────────────────────────────────────────────────
function formatDate(ts: number) {
  const d = new Date(ts)
  const now = Date.now()
  const delta = now - ts
  if (delta < 60_000) return "just now"
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m ago`
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)}h ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ─── Page ────────────────────────────────────────────────────────────────────
function IdeaHubPage() {
  const navigate = useNavigate()
  const [search, setSearch] = React.useState("")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [creating, setCreating] = React.useState(false)

  const { data: ideas, isPending } = useQuery(convexQuery(api.ideas.list, {}))

  const createIdea = useConvexMutation(api.ideas.create)
  const deleteIdea = useConvexMutation(api.ideas.remove)

  const filtered = React.useMemo(() => {
    if (!ideas) return []
    if (!search) return ideas
    return ideas.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [ideas, search])

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

      {/* Grid */}
      {isPending ? (
        <IdeaCardSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          onNew={() => setShowCreateDialog(true)}
          hasSearch={!!search}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* New idea card */}
          <button
            onClick={() => setShowCreateDialog(true)}
            className={cn(
              "border-border bg-muted/30 hover:bg-muted/60 group flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed",
              "transition-all duration-200 hover:scale-[1.01]"
            )}
          >
            <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors">
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={20}
                className="text-primary"
              />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              New Idea
            </span>
          </button>

          {filtered.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              onOpen={() =>
                navigate({
                  to: "/idea-hub/$ideaId",
                  params: { ideaId: idea._id },
                })
              }
              onDelete={() => deleteIdea({ id: idea._id })}
            />
          ))}
        </div>
      )}

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

// ─── Idea Card ───────────────────────────────────────────────────────────────
function IdeaCard({
  idea,
  onOpen,
  onDelete,
}: {
  idea: {
    _id: string
    title: string
    description?: string
    createdAt: number
    lastOpenedAt?: number
  }
  onOpen: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const gradient = getGradient(idea._id)

  return (
    <div
      className={cn(
        "border-border bg-card group relative flex min-h-[180px] cursor-pointer flex-col rounded-xl border",
        "overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
      )}
      onClick={onOpen}
    >
      {/* Cover gradient */}
      <div className={cn("h-20 w-full bg-linear-to-br", gradient)} />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 leading-snug font-semibold">
          {idea.title}
        </h3>
        {idea.description && (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {idea.description}
          </p>
        )}
        <div className="text-muted-foreground mt-auto flex items-center gap-1 pt-2 text-[11px]">
          <HugeiconsIcon icon={Clock01Icon} size={12} />
          <span>{formatDate(idea.lastOpenedAt ?? idea.createdAt)}</span>
        </div>
      </div>

      {/* Menu button */}
      <button
        className={cn(
          "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md",
          "bg-black/20 opacity-0 transition-opacity group-hover:opacity-100",
          "text-white hover:bg-black/40"
        )}
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen(!menuOpen)
        }}
      >
        <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="border-border bg-popover absolute top-9 right-2 z-20 flex min-w-[120px] flex-col overflow-hidden rounded-lg border shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpen()
                setMenuOpen(false)
              }}
              className="hover:bg-muted px-3 py-2 text-left text-sm"
            >
              Open
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
                setMenuOpen(false)
              }}
              className="text-destructive hover:bg-destructive/10 px-3 py-2 text-left text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Create Dialog ────────────────────────────────────────────────────────────
function CreateIdeaDialog({
  title,
  onTitleChange,
  onCreate,
  onClose,
  creating,
}: {
  title: string
  onTitleChange: (v: string) => void
  onCreate: () => void
  onClose: () => void
  creating: boolean
}) {
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

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({
  onNew,
  hasSearch,
}: {
  onNew: () => void
  hasSearch: boolean
}) {
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

// ─── Skeleton ────────────────────────────────────────────────────────────────
function IdeaCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-card min-h-[180px] animate-pulse rounded-xl border"
        >
          <div className="bg-muted h-20 rounded-t-xl" />
          <div className="p-4">
            <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
            <div className="bg-muted h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

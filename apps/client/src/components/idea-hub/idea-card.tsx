import { Clock01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

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

interface IdeaCardProps {
  idea: {
    _id: string
    title: string
    description?: string
    createdAt: number
    lastOpenedAt?: number
  }
  onOpen: () => void
  onDelete: () => void
}

export function IdeaCard({ idea, onOpen, onDelete }: IdeaCardProps) {
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

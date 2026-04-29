import {
  Clock01Icon,
  Delete02Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import { cn } from "@mindorbit/ui/lib/utils"

import type { Doc, Id } from "@mindorbit/backend/_generated/dataModel"

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
  idea: Doc<"ideas">
  onOpen: (id: Id<"ideas">) => void
  onDelete: (id: Id<"ideas">) => void
}

export function IdeaCard({ idea, onOpen, onDelete }: IdeaCardProps) {
  const gradient = getGradient(idea._id)

  return (
    <div
      className={cn(
        "border-border bg-card group relative flex min-h-[180px] cursor-pointer flex-col rounded-lg border",
        "overflow-hidden transition-all duration-300 hover:shadow-sm"
      )}
      onClick={() => onOpen(idea._id)}
    >
      {/* Cover gradient */}
      <div className={cn("h-20 w-full bg-linear-to-br", gradient)} />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
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
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 border-none bg-black/20 text-white hover:bg-black/40 hover:text-white"
                {...props}
                onClick={(e) => {
                  e.stopPropagation()
                  props.onClick?.(e)
                }}
              >
                <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
              </Button>
            )}
          />
          <DropdownMenuContent align="end" className="w-36">

            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-2"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(idea._id)
              }}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
              Delete Idea
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

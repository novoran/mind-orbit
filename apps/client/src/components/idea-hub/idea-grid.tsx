import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { api } from "@mindorbit/backend/_generated/api"
import { cn } from "@mindorbit/ui/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import * as React from "react"

import { IdeaCard } from "./idea-card"
import { EmptyState } from "./empty-state"

interface IdeaGridProps {
  search: string
  onNewIdea: () => void
}

export function IdeaGrid({ search, onNewIdea }: IdeaGridProps) {
  const navigate = useNavigate()
  const deleteIdea = useConvexMutation(api.ideas.remove)

  // useQuery will automatically suspend here if suspense is enabled/supported
  const { data: ideas } = useQuery(convexQuery(api.ideas.list, {}))

  const filtered = React.useMemo(() => {
    if (!ideas) return []
    if (!search) return ideas
    return ideas.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [ideas, search])

  if (filtered.length === 0) {
    return <EmptyState onNew={onNewIdea} hasSearch={!!search} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* New idea card */}
      <button
        onClick={onNewIdea}
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
  )
}

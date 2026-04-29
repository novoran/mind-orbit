import { EmptyState } from "./empty-state"
import { IdeaCard } from "./idea-card"

import type { Doc, Id } from "@mindorbit/backend/_generated/dataModel"

interface IdeaGridProps {
  ideas: Array<Doc<"ideas">>
  search?: string
  onNewIdea: () => void
  onOpen: (id: Id<"ideas">) => void
  onDelete: (id: Id<"ideas">) => void
}

export function IdeaGrid({
  ideas,
  search,
  onNewIdea,
  onOpen,
  onDelete,
}: IdeaGridProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea._id}
            idea={idea}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        ))}
      </div>

      {ideas.length === 0 && search && (
        <div className="mt-8">
          <EmptyState onNew={onNewIdea} hasSearch={true} />
        </div>
      )}
    </div>
  )
}

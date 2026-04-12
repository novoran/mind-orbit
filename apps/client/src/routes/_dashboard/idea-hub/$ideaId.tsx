import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  ArrowLeft01Icon,
  GridIcon,
  Note01Icon,
  Share01Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { LiveList, LiveMap } from "@liveblocks/client"
import { ClientSideSuspense } from "@liveblocks/react"
import { api } from "@mindorbit/backend/_generated/api"
import { cn } from "@mindorbit/ui/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as React from "react"

import type { Id } from "@mindorbit/backend/_generated/dataModel"

import { CollaborativeEditor } from "@/components/editor/collaborative-editor"
import { IdeaCanvas } from "@/components/idea-canvas"
import { PresenceBar } from "@/components/presence-bar"
import { RoomProvider } from "@/lib/liveblocks.config"

export const Route = createFileRoute("/_dashboard/idea-hub/$ideaId")({
  component: IdeaWorkspacePage,
})

function IdeaWorkspacePage() {
  const { ideaId } = Route.useParams()

  // Use ideaId as the Liveblocks room ID — one room per idea
  const roomId = `idea-${ideaId}`

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, selection: [], pencilColor: null }}
      initialStorage={{
        layers: new LiveMap(),
        layerIds: new LiveList(),
      }}
      preventUnsavedChanges={true}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-muted-foreground text-sm">
                Loading workspace...
              </p>
            </div>
          </div>
        }
      >
        <IdeaWorkspace ideaId={ideaId} />
      </ClientSideSuspense>
    </RoomProvider>
  )
}

// ─── Workspace (inside RoomProvider) ─────────────────────────────────────────
function IdeaWorkspace({ ideaId }: { ideaId: string }) {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = React.useState<
    "canvas" | "notes" | "split"
  >("split")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [titleInput, setTitleInput] = React.useState("")

  const { data: idea } = useQuery(
    convexQuery(api.ideas.get, { id: ideaId as Id<"ideas"> })
  )

  const updateIdea = useConvexMutation(api.ideas.update)

  React.useEffect(() => {
    if (idea?.title) setTitleInput(idea.title)
  }, [idea?.title])

  const handleTitleSave = async () => {
    if (!titleInput.trim() || titleInput === idea?.title) {
      setIsEditingTitle(false)
      return
    }
    await updateIdea({ id: ideaId as Id<"ideas">, title: titleInput.trim() })
    setIsEditingTitle(false)
  }

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      {/* ── Top header ── */}
      <header className="border-border bg-background/95 flex h-12 shrink-0 items-center gap-3 border-b px-3 backdrop-blur">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: "/idea-hub" })}
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-7 w-7 items-center justify-center rounded-md transition-colors"
          title="Back to Idea Hub"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </button>

        {/* Title */}
        <div className="flex flex-1 items-center">
          {isEditingTitle ? (
            <input
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave()
                if (e.key === "Escape") setIsEditingTitle(false)
              }}
              className="border-primary w-64 rounded border px-2 py-0.5 text-sm font-semibold focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="hover:bg-muted rounded px-1.5 py-0.5 text-sm font-semibold transition-colors"
            >
              {idea?.title ?? "Untitled"}
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="border-border bg-muted/50 flex items-center rounded-lg border p-0.5">
          <ViewToggleBtn
            active={activePanel === "canvas"}
            onClick={() => setActivePanel("canvas")}
            title="Canvas only"
            icon={<HugeiconsIcon icon={GridIcon} size={14} />}
          />
          <ViewToggleBtn
            active={activePanel === "split"}
            onClick={() => setActivePanel("split")}
            title="Split view"
            icon={<HugeiconsIcon icon={SidebarLeftIcon} size={14} />}
          />
          <ViewToggleBtn
            active={activePanel === "notes"}
            onClick={() => setActivePanel("notes")}
            title="Notes only"
            icon={<HugeiconsIcon icon={Note01Icon} size={14} />}
          />
        </div>

        {/* Presence */}
        <PresenceBar />

        {/* Share */}
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
          <HugeiconsIcon icon={Share01Icon} size={14} />
          Share
        </button>
      </header>

      {/* ── Workspace body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas panel */}
        {(activePanel === "canvas" || activePanel === "split") && (
          <div
            className={cn(
              "flex flex-col overflow-hidden",
              activePanel === "split"
                ? "border-border w-1/2 border-r"
                : "w-full"
            )}
          >
            <IdeaCanvas />
          </div>
        )}

        {/* Divider handle (split view only) */}
        {activePanel === "split" && (
          <div className="bg-border hover:bg-primary/60 w-1 shrink-0 cursor-col-resize transition-colors" />
        )}

        {/* Notes panel */}
        {(activePanel === "notes" || activePanel === "split") && (
          <div
            className={cn(
              "flex flex-col overflow-hidden",
              activePanel === "split" ? "flex-1" : "w-full"
            )}
          >
            <CollaborativeEditor />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── View toggle button ───────────────────────────────────────────────────────
function ViewToggleBtn({
  active,
  onClick,
  title,
  icon,
}: {
  active: boolean
  onClick: () => void
  title: string
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-6 w-7 items-center justify-center rounded-md transition-all",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
    </button>
  )
}

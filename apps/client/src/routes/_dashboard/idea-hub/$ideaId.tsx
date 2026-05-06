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
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import { api } from "@mindorbit/backend/_generated/api"
import { cn } from "@mindorbit/ui/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as React from "react"

import { Button } from "@mindorbit/ui/components/button"

import type { Layer } from "@/lib/liveblocks.config"
import type { LiveObject } from "@liveblocks/client"
import type { Id } from "@mindorbit/backend/_generated/dataModel"

import { CollaborativeEditor } from "@/components/editor/collaborative-editor"
import { IdeaCanvas } from "@/components/idea-canvas"
import { PresenceBar } from "@/components/presence-bar"

export const Route = createFileRoute("/_dashboard/idea-hub/$ideaId")({
  component: IdeaWorkspacePage,
})

function IdeaWorkspacePage() {
  const { ideaId } = Route.useParams()

  // Use ideaId as the Liveblocks room ID — one room per idea
  const roomId = `idea-${ideaId}`

  // Best Practice: Memoize initialization props to avoid re-creating
  // LiveMap/LiveList on every component render.
  const initialPresence = React.useMemo(
    () => ({ cursor: null, selection: [], pencilColor: null }),
    []
  )

  const initialStorage = React.useMemo(
    () => ({
      layers: new LiveMap<string, LiveObject<Layer>>(),
      layerIds: new LiveList<string>([]),
    }),
    []
  )

  return (
    <RoomProvider
      id={roomId}
      initialPresence={initialPresence}
      initialStorage={initialStorage}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-muted-foreground text-sm">Loading Idea...</p>
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
    <div
      className="bg-background relative flex h-screen w-full overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── Top Navigation (Floating & Transparent) ── */}
      <nav className="pointer-events-none absolute top-0 left-0 z-50 flex h-16 w-full items-center justify-between px-6">
        {/* Left: Back & Title */}
        <div className="bg-background/80 border-border pointer-events-auto flex h-11 items-center rounded-lg border pr-3 pl-1 shadow-sm backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => navigate({ to: "/idea-hub" })}
            className="text-muted-foreground hover:text-foreground"
            title="Back to Idea Hub"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </Button>

          <div className="bg-border/60 mx-1 h-5 w-px" />

          <div
            className="flex w-36 cursor-text items-center px-2 py-1"
            onDoubleClick={() => setIsEditingTitle(true)}
            title="Double click to edit title"
          >
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
                className="w-full bg-transparent text-sm font-bold focus:outline-none"
              />
            ) : (
              <span className="text-foreground/90 truncate text-sm font-bold tracking-tight">
                {idea?.title ?? "Untitled Idea"}
              </span>
            )}
          </div>
        </div>

        {/* Center: Spatial Switcher */}
        <div className="bg-background/80 border-border pointer-events-auto flex h-11 items-center gap-1 rounded-lg border px-1 shadow-sm backdrop-blur-sm">
          <SwitcherTab
            active={activePanel === "canvas"}
            onClick={() => setActivePanel("canvas")}
            icon={<HugeiconsIcon icon={GridIcon} size={16} />}
            label="Canvas"
          />
          <SwitcherTab
            active={activePanel === "notes"}
            onClick={() => setActivePanel("notes")}
            icon={<HugeiconsIcon icon={Note01Icon} size={16} />}
            label="Notes"
          />
          <SwitcherTab
            active={activePanel === "split"}
            onClick={() => setActivePanel("split")}
            icon={<HugeiconsIcon icon={SidebarLeftIcon} size={16} />}
            label="Split"
          />
        </div>

        {/* Right: Presence & Share */}
        <div className="bg-background/80 border-border pointer-events-auto flex h-11 items-center gap-1.5 rounded-lg border pr-1 pl-3 shadow-sm backdrop-blur-sm">
          <PresenceBar />

          <div className="bg-border/60 mx-1 h-5 w-px" />

          <Button
            className="h-9 px-4 font-semibold"
            onClick={() => {}} // Placeholder for share logic
          >
            <HugeiconsIcon icon={Share01Icon} size={16} />
            Share
          </Button>
        </div>
      </nav>

      {/* ── Workspace Body ── */}
      <main className="relative flex h-full w-full overflow-hidden">
        {/* Canvas Panel */}
        <div
          className={cn(
            "relative h-full transition-all duration-500 ease-in-out",
            activePanel === "canvas"
              ? "w-full"
              : activePanel === "split"
                ? "w-[60%]"
                : "w-0 opacity-0"
          )}
        >
          <IdeaCanvas />
        </div>

        {/* Divider (Split view only) */}
        {activePanel === "split" && (
          <div className="bg-border relative z-10 w-px shrink-0">
            <div className="bg-primary absolute top-1/2 left-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20" />
          </div>
        )}

        {/* Notes Panel — pt-16 clears the floating nav bar */}
        <div
          className={cn(
            "relative h-full transition-all duration-500 ease-in-out",
            activePanel === "notes"
              ? "bg-background w-full"
              : activePanel === "split"
                ? "flex-1 overflow-hidden"
                : "w-0 overflow-hidden opacity-0"
          )}
        >
          <div className="flex h-full flex-col pt-16">
            <CollaborativeEditor
              className="flex-1 overflow-hidden"
              narrow={activePanel === "split"}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── Spatial Switcher Tab ──────────────────────────────────────────────────────
function SwitcherTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      className={cn(
        "h-9 gap-2 px-4 font-medium transition-all duration-200",
        active &&
          "bg-foreground text-background hover:bg-foreground/90 scale-[1.02] shadow-md"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}

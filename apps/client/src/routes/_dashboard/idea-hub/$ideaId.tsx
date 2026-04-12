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
    <div className="bg-background relative flex h-screen w-full overflow-hidden">
      {/* ── Top Navigation (Floating & Transparent) ── */}
      <nav className="pointer-events-none absolute top-0 left-0 z-50 flex h-16 w-full items-center justify-between px-6">
        {/* Left: Back & Title */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/idea-hub" })}
            className="bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm backdrop-blur transition-all"
            title="Back to Idea Hub"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>

          <div className="flex flex-col">
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
                className="bg-background/80 border-primary w-64 rounded-lg border px-3 py-1 text-sm font-bold shadow-sm backdrop-blur focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="hover:bg-muted/50 group flex items-center gap-2 rounded-lg px-2 py-1 transition-all"
              >
                <span className="text-sm font-bold tracking-tight">
                  {idea?.title ?? "Untitled Idea"}
                </span>
                <div className="bg-muted h-1 w-1 rounded-full opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Spatial Switcher */}
        <div className="pointer-events-auto flex items-center">
          <div className="bg-background/80 border-border flex items-center gap-1 rounded-2xl border p-1 shadow-lg backdrop-blur">
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
        </div>

        {/* Right: Presence & Share */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="bg-background/80 border-border flex h-10 items-center rounded-2xl border px-3 shadow-md backdrop-blur">
            <PresenceBar />
          </div>

          <button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 flex h-10 items-center gap-2 rounded-2xl px-5 text-sm font-semibold shadow-lg transition-all active:scale-95">
            <HugeiconsIcon icon={Share01Icon} size={16} />
            Share
          </button>
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
                ? "w-1/2"
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

        {/* Notes Panel */}
        <div
          className={cn(
            "bg-background relative h-full transition-all duration-500 ease-in-out",
            activePanel === "notes"
              ? "w-full"
              : activePanel === "split"
                ? "flex-1"
                : "w-0 overflow-hidden opacity-0"
          )}
        >
          <div
            className={cn(
              "h-full w-full",
              activePanel === "split" ? "px-4 py-20" : "px-0 py-0"
            )}
          >
            <div
              className={cn(
                "h-full w-full overflow-hidden",
                activePanel === "split" &&
                  "border-border rounded-3xl border shadow-2xl"
              )}
            >
              <CollaborativeEditor />
            </div>
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
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-foreground text-background scale-[1.02] shadow-md"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

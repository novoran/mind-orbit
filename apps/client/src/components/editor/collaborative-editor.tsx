import { useLiveblocksExtension } from "@liveblocks/react-tiptap"
import { cn } from "@mindorbit/ui/lib/utils"
import { EditorContent, useEditor } from "@tiptap/react"
import { getBaseExtensions } from "./editor-extensions"
import { EditorToolbar } from "./editor-toolbar"

interface CollaborativeEditorProps {
  className?: string
}

export function CollaborativeEditor({ className }: CollaborativeEditorProps) {
  // useLiveblocksExtension sets up Yjs + presence cursors automatically
  // using the room provided by the nearest RoomProvider
  const liveblocks = useLiveblocksExtension({
    initialContent: "<p></p>",
  })

  const editor = useEditor({
    // Required: disable SSR hydration issues
    immediatelyRender: false,

    // Content validation to prevent silent sync failures
    enableContentCheck: true,
    onContentError: ({ editor: e, disableCollaboration }) => {
      disableCollaboration()
      e.setEditable(false, false)
      console.error(
        "[Liveblocks] Content validation error — editor is now read-only."
      )
    },

    extensions: [...getBaseExtensions(), liveblocks],

    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert min-h-full max-w-none",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-p:leading-relaxed prose-pre:bg-muted",
          "px-8 py-6 focus:outline-none"
        ),
      },
    },
  })

  return (
    <div className={cn("bg-background relative flex h-full flex-col overflow-hidden", className)}>
      {/* ── Document Tab Bar (Mockup) ── */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 h-12">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <EditorTab label="Project Brainstorming" active />
          <EditorTab label="Meeting Notes" />
          <EditorTab label="Research" />
          <button className="text-muted-foreground hover:bg-muted ml-2 flex h-6 w-6 items-center justify-center rounded-md transition-colors">
            <HugeiconsIcon icon={AiBeautifyIcon} size={14} className="rotate-45" />
          </button>
        </div>
      </div>

      {/* ── Editor Container ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Floating Toolbar */}
        <div className="pointer-events-none absolute top-4 left-0 z-10 flex w-full justify-center">
          <div className="pointer-events-auto">
            <EditorToolbar editor={editor} />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto pt-16 pb-12">
          <div className="mx-auto max-w-3xl">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Stats footer (best practice: show document status) */}
      <div className="border-border text-muted-foreground flex shrink-0 items-center justify-between border-t px-6 py-2 text-[11px] bg-muted/20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            {editor?.storage.characterCount.words()} words
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            {editor?.storage.characterCount.characters()} characters
          </span>
        </div>
        <div className="bg-emerald-500/10 text-emerald-600 flex items-center gap-2 rounded-full px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
          <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
          Multiplayer active
        </div>
      </div>
    </div>
  )
}

function EditorTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <HugeiconsIcon icon={Note01Icon} size={14} />
      {label}
    </button>
  )
}
import { Note01Icon, AiBeautifyIcon } from "@hugeicons/core-free-icons"

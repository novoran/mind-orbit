import { useLiveblocksExtension } from "@liveblocks/react-tiptap"
import { cn } from "@mindorbit/ui/lib/utils"
import { EditorContent, useEditor } from "@tiptap/react"
import * as React from "react"

import { getBaseExtensions } from "./editor-extensions"
import { EditorToolbar } from "./editor-toolbar"

interface CollaborativeEditorProps {
  /** Pass true when rendering in a narrow split-panel (adds horizontal padding) */
  narrow?: boolean
  className?: string
}

const ZOOM_OPTIONS = [
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "90%", value: 0.9 },
  { label: "100%", value: 1 },
  { label: "125%", value: 1.25 },
  { label: "150%", value: 1.5 },
]

export function CollaborativeEditor({
  narrow,
  className,
}: CollaborativeEditorProps) {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      <NoteEditor narrow={narrow} />
    </div>
  )
}

function NoteEditor({ narrow }: { narrow?: boolean }) {
  const [zoom, setZoom] = React.useState(1)

  const liveblocks = useLiveblocksExtension({
    field: "document",
    initialContent: "<p></p>",
  })

  const [stats, setStats] = React.useState({ words: 0, characters: 0 })

  const editor = useEditor({
    immediatelyRender: false,
    enableContentCheck: true,
    extensions: [...getBaseExtensions(), liveblocks],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert min-h-[60vh] max-w-none",
          "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
          "prose-p:leading-relaxed prose-p:text-foreground/80",
          "focus:outline-none"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
      })
    },
    onCreate: ({ editor }) => {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
      })
    },
  })

  React.useEffect(() => {
    if (editor) {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
      })
    }
  }, [editor])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Google Docs-style Toolbar ──────────────────────────────────────── */}
      <div className="border-border/50 sticky top-0 z-10 flex shrink-0 items-center border-b bg-[#f9fbfd] dark:bg-[#1e1e1e]">
        <EditorToolbar editor={editor} className="flex-1" />

        {/* Zoom selector — right-aligned */}
        <div className="border-border/40 flex shrink-0 items-center border-l px-2">
          <select
            className="text-foreground/70 h-7 cursor-pointer rounded border-none bg-transparent px-1 text-[12px] outline-none hover:bg-black/8 dark:hover:bg-white/8"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            {ZOOM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Canvas Area ────────────────────────────────────────────────────── */}
      <div className="no-scrollbar flex-1 overflow-y-auto bg-[#f0f4f8] dark:bg-[#2d2d2d]">
        {/*
          A4 at 96dpi = 794px wide.
          - Wide/notes view: paper centered with gray margins on sides
          - Narrow/split view: paper gets horizontal padding so it doesn't touch edges
          Zoom is applied via transform-origin: top center + scale.
        */}
        <div
          className={cn(
            "py-8 transition-all",
            // In split mode add horizontal padding so paper doesn't touch the divider
            narrow ? "px-4" : "px-8"
          )}
        >
          <div
            style={{
              transformOrigin: "top center",
              transform: `scale(${zoom})`,
              // Compensate height so the scrollable area doesn't leave a gap
              marginBottom: `calc(${(zoom - 1) * 100}% * -1)`,
            }}
          >
            {/* A4 paper card — no inner padding, let prose handle spacing */}
            <div
              className={cn(
                "mx-auto w-full max-w-[794px]",
                "bg-white dark:bg-[#1a1a1a]",
                // Only show the full drop shadow when not in narrow mode
                narrow
                  ? "shadow-sm dark:shadow-md"
                  : "shadow-[0_1px_4px_rgba(0,0,0,0.10),0_4px_16px_rgba(0,0,0,0.07)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)]"
              )}
            >
              {/*
                Inner content area:
                - Standard document margin: 1 inch (96px) top/bottom, 1.25 inch (120px) left/right
                - In narrow/split mode these shrink to something more compact
              */}
              <div className="min-h-[1123px] p-14">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Footer ───────────────────────────────────────────────────── */}
      <div className="border-border/40 text-muted-foreground flex shrink-0 items-center justify-between border-t bg-[#f9fbfd] px-4 py-1 text-[11px] dark:bg-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <span>{stats.words} words</span>
          <span className="text-foreground/30">·</span>
          <span>{stats.characters} characters</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">
            Live
          </span>
        </div>
      </div>
    </div>
  )
}

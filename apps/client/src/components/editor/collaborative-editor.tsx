import { AiBeautifyIcon, Note01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLiveblocksExtension } from "@liveblocks/react-tiptap"
import {
  useMutation,
  useStorage,
  RoomProvider,
} from "@liveblocks/react/suspense"
import { cn } from "@mindorbit/ui/lib/utils"
import { EditorContent, useEditor } from "@tiptap/react"
import { getBaseExtensions } from "./editor-extensions"
import { EditorToolbar } from "./editor-toolbar"
import * as React from "react"
import { nanoid } from "nanoid"

interface CollaborativeEditorProps {
  className?: string
}

export function CollaborativeEditor({ className }: CollaborativeEditorProps) {
  const notes = useStorage((root) => root.notes)
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null)

  const addNote = useMutation(({ storage }) => {
    const id = nanoid()
    storage.get("notes").push({ id, title: "New Note" })
    setActiveNoteId(id)
  }, [])

  // Initialize with the first note if none active
  React.useEffect(() => {
    if (!activeNoteId && notes && notes.length > 0) {
      setActiveNoteId(notes[0].id)
    } else if (!activeNoteId && notes && notes.length === 0) {
      // Create first note if empty
      addNote()
    }
  }, [notes, activeNoteId, addNote])

  return (
    <div className={cn("bg-transparent relative flex h-full flex-col overflow-hidden", className)}>
      {/* ── Document Tab Bar ── */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 px-4 backdrop-blur-md">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {notes?.map((note) => (
            <EditorTab
              key={note.id}
              label={note.title}
              active={activeNoteId === note.id}
              onClick={() => setActiveNoteId(note.id)}
            />
          ))}
          <button
            onClick={() => addNote()}
            className="text-muted-foreground hover:bg-muted ml-2 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            title="Create New Note"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
          </button>
        </div>

        <button className="text-muted-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
          <HugeiconsIcon icon={AiBeautifyIcon} size={16} className="rotate-45" />
        </button>
      </div>

      {/* ── Editor Container ── */}
      <div className="relative flex-1 overflow-hidden">
        {activeNoteId ? (
          <RoomProvider id={`note-${activeNoteId}`} initialPresence={{ cursor: null, selection: [], pencilColor: null }}>
            <NoteEditor />
          </RoomProvider>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  )
}

function NoteEditor() {
  const liveblocks = useLiveblocksExtension({
    initialContent: "<p></p>",
  })

  // Local state for statistics to ensure "live" client-side re-render
  const [stats, setStats] = React.useState({ words: 0, characters: 0 })

  const editor = useEditor({
    immediatelyRender: false,
    enableContentCheck: true,
    extensions: [...getBaseExtensions(), liveblocks],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert min-h-full max-w-none",
          "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
          "prose-p:leading-relaxed prose-p:text-foreground/80",
          "px-8 py-10 focus:outline-none"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      // Real-time stats update
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters()
      })
    },
    // Initial stats
    onBeforeCreate: ({ editor }) => {
       // Wait for load
    },
    onCreate: ({ editor }) => {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters()
      })
    }
  })

  // Sync stats when editor loads or switches
  React.useEffect(() => {
    if (editor) {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters()
      })
    }
  }, [editor])

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Floating Toolbar */}
      <div className="pointer-events-none absolute top-4 left-0 z-10 flex w-full justify-center">
        <div className="pointer-events-auto">
          <EditorToolbar editor={editor} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto no-scrollbar pt-16 pb-12">
        <div className="mx-auto max-w-3xl">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Stats footer */}
      <div className="border-border/40 text-muted-foreground bg-background/5 flex shrink-0 items-center justify-between border-t px-6 py-2 text-[11px] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <div className="h-1 w-1 rounded-sm bg-slate-400" />
            {stats.words} words
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <div className="h-1 w-1 rounded-sm bg-slate-400" />
            {stats.characters} characters
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-600 uppercase">
          <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Multiplayer active
        </div>
      </div>
    </div>
  )
}

function EditorTab({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg px-3 text-[11px] font-bold transition-all transition-transform active:scale-95",
        active
          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <HugeiconsIcon icon={Note01Icon} size={14} />
      {label}
    </button>
  )
}

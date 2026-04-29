import {
  AiBeautifyIcon,
  Cancel01Icon,
  Note01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLiveblocksExtension } from "@liveblocks/react-tiptap"
import { useMutation, useStorage } from "@liveblocks/react/suspense"
import { cn } from "@mindorbit/ui/lib/utils"
import { EditorContent, useEditor } from "@tiptap/react"
import { nanoid } from "nanoid"
import * as React from "react"
import { getBaseExtensions } from "./editor-extensions"
import { EditorToolbar } from "./editor-toolbar"

interface CollaborativeEditorProps {
  className?: string
}

export function CollaborativeEditor({ className }: CollaborativeEditorProps) {
  const notes = useStorage((root) => root.notes)
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null)
  const hasInitialized = React.useRef(false)

  const addNote = useMutation(({ storage }) => {
    const id = nanoid()
    storage.get("notes").push({ id, title: "New Note" })
    setActiveNoteId(id)
  }, [])

  const deleteNote = useMutation(
    ({ storage }, id: string) => {
      const notes = storage.get("notes")
      const index = notes.findIndex((n) => n.id === id)
      if (index !== -1) {
        notes.delete(index)
        if (activeNoteId === id) {
          setActiveNoteId(notes.get(0)?.id ?? null)
        }
      }
    },
    [activeNoteId]
  )

  const renameNote = useMutation(({ storage }, id: string, title: string) => {
    const notes = storage.get("notes")
    const note = notes.find((n) => n.id === id)
    if (note) {
      note.update({ title })
    }
  }, [])

  // Initialize with the first note if none active
  React.useEffect(() => {
    if (hasInitialized.current) return

    if (notes.length > 0) {
      if (!activeNoteId) {
        setActiveNoteId(notes[0].id)
      }
      hasInitialized.current = true
    } else {
      // Create first note if empty
      addNote()
      hasInitialized.current = true
    }
  }, [notes, activeNoteId, addNote])

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden bg-transparent",
        className
      )}
    >
      {/* ── Document Tab Bar ── */}
      <div className="border-border/40 flex h-12 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {notes.map((note) => (
            <EditorTab
              key={note.id}
              label={note.title}
              active={activeNoteId === note.id}
              onClick={() => setActiveNoteId(note.id)}
              onDelete={() => deleteNote(note.id)}
              onRename={(title) => renameNote(note.id, title)}
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
          <HugeiconsIcon
            icon={AiBeautifyIcon}
            size={16}
            className="rotate-45"
          />
        </button>
      </div>

      {/* ── Editor Container ── */}
      <div className="relative flex-1 overflow-hidden">
        {activeNoteId ? (
          <NoteEditor key={activeNoteId} activeNoteId={activeNoteId} />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  )
}

function NoteEditor({ activeNoteId }: { activeNoteId: string }) {
  const liveblocks = useLiveblocksExtension({
    field: activeNoteId,
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
        characters: editor.storage.characterCount.characters(),
      })
    },
    // Initial stats
    onBeforeCreate: ({ editor }) => {
      // Wait for load
    },
    onCreate: ({ editor }) => {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
      })
    },
  })

  // Sync stats when editor loads or switches
  React.useEffect(() => {
    if (editor) {
      setStats({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
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
      <div className="no-scrollbar h-full overflow-y-auto pt-16 pb-12">
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

function EditorTab({
  label,
  active,
  onClick,
  onDelete,
  onRename,
}: {
  label: string
  active?: boolean
  onClick: () => void
  onDelete: () => void
  onRename: (title: string) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [value, setValue] = React.useState(label)

  const handleBlur = () => {
    setIsEditing(false)
    if (value.trim() && value !== label) {
      onRename(value.trim())
    } else {
      setValue(label)
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-[11px] font-bold transition-all active:scale-95",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <HugeiconsIcon icon={Note01Icon} size={14} className="shrink-0" />

      {isEditing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          className="w-24 border-none bg-transparent p-0 font-bold outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className="max-w-[120px] truncate"
        >
          {label}
        </span>
      )}

      {active && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="hover:bg-primary/20 ml-1 rounded p-0.5 opacity-0 transition-all group-hover:opacity-100"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} />
        </button>
      )}
    </div>
  )
}

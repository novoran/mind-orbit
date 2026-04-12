import { useLiveblocksExtension } from "@liveblocks/react-tiptap"
import { cn } from "@mindorbit/ui/lib/utils"
import { EditorContent } from "@tiptap/react"
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

  const editor = useEdito({
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
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Stats footer (best practice: show document status) */}
      <div className="border-border text-muted-foreground flex shrink-0 items-center justify-between border-t px-4 py-1.5 text-[11px]">
        <div className="flex items-center gap-4">
          <span>{editor?.storage.characterCount.words()} words</span>
          <span>{editor?.storage.characterCount.characters()} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Multiplayer active</span>
        </div>
      </div>
    </div>
  )
}

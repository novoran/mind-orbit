import {
  AiBeautifyIcon,
  CodeIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuoteUpIcon,
  Redo03Icon,
  Task01Icon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  Undo03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

import { Button } from "@mindorbit/ui/components/button"
import type { Editor } from "@tiptap/react"

// ─── Toolbar button ────────────────────────────────────────────────────────

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  tooltip?: string
}

export function ToolbarButton({
  active,
  tooltip,
  className,
  children,
  ...props
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      title={tooltip}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-sm transition-all",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-muted text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────

export function ToolbarSeparator() {
  return <div className="bg-border mx-1 h-5 w-px shrink-0" />
}

// ─── Main Toolbar ─────────────────────────────────────────────────────────

interface EditorToolbarProps {
  editor: Editor | null
  className?: string
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div
      className={cn(
        "bg-background/95 border-border flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5 backdrop-blur",
        className
      )}
    >
      {/* Text style */}
      <ToolbarButton
        tooltip="Bold (Ctrl+B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <HugeiconsIcon icon={TextBoldIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Italic (Ctrl+I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <HugeiconsIcon icon={TextItalicIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Underline (Ctrl+U)"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <HugeiconsIcon icon={TextUnderlineIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <HugeiconsIcon icon={TextStrikethroughIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Highlight"
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <HugeiconsIcon icon={AiBeautifyIcon} size={14} />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarButton
        tooltip="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="w-8 text-xs font-bold"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        tooltip="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="w-8 text-xs font-bold"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        tooltip="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="w-8 text-xs font-bold"
      >
        H3
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarButton
        tooltip="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <HugeiconsIcon icon={LeftToRightListBulletIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Ordered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <HugeiconsIcon icon={LeftToRightListNumberIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Task List"
        active={editor.isActive("taskList")}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <HugeiconsIcon icon={Task01Icon} size={14} />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Alignment */}
      <ToolbarButton
        tooltip="Align Left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <HugeiconsIcon icon={TextAlignLeftIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Align Center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <HugeiconsIcon icon={TextAlignCenterIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Align Right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <HugeiconsIcon icon={TextAlignRightIcon} size={14} />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Block */}
      <ToolbarButton
        tooltip="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <HugeiconsIcon icon={QuoteUpIcon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <HugeiconsIcon icon={CodeIcon} size={14} />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Undo / Redo */}
      <ToolbarButton
        tooltip="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <HugeiconsIcon icon={Undo03Icon} size={14} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Redo (Ctrl+Y)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <HugeiconsIcon icon={Redo03Icon} size={14} />
      </ToolbarButton>
    </div>
  )
}

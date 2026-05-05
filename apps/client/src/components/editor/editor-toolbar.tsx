import {
  AiBeautifyIcon,
  LeftToRightListBulletIcon,
  Task01Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
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
        "flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-all",
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
        "bg-background/80 border-border flex flex-wrap items-center gap-1 rounded-lg border px-3 py-1.5 shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      {/* Text style */}
      <div className="flex items-center gap-0.5">
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
          tooltip="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <HugeiconsIcon icon={AiBeautifyIcon} size={14} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      {/* Headings */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          tooltip="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="w-8 text-[11px] font-bold"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          tooltip="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="w-8 text-[11px] font-bold"
        >
          H2
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      {/* Lists */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          tooltip="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <HugeiconsIcon icon={LeftToRightListBulletIcon} size={14} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Task List"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <HugeiconsIcon icon={Task01Icon} size={14} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      {/* Blocks & AI */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          tooltip="AI Rewrite"
          className="bg-primary/10 text-primary w-auto gap-1.5 px-3"
          onClick={() => {}}
        >
          <HugeiconsIcon icon={AiBeautifyIcon} size={14} />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            AI Rewrite
          </span>
        </ToolbarButton>
      </div>
    </div>
  )
}

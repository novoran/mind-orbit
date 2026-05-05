import {
  HighlighterIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  TextAlignCenterIcon,
  TextAlignJustifyCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

import type { Editor } from "@tiptap/react"

// ─── Force re-render on editor state changes ───────────────────────────────

function useEditorUpdate(editor: Editor | null) {
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0)
  React.useEffect(() => {
    if (!editor) return
    editor.on("transaction", forceUpdate)
    return () => {
      editor.off("transaction", forceUpdate)
    }
  }, [editor])
}

// ─── Toolbar Button ────────────────────────────────────────────────────────

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
    <button
      type="button"
      title={tooltip}
      // onMouseDown prevents focus leaving the editor
      onMouseDown={(e) => {
        e.preventDefault()
        props.onMouseDown?.(e)
      }}
      className={cn(
        "flex h-7 min-w-7 items-center justify-center gap-1 rounded px-1.5 text-sm transition-colors",
        "text-foreground/70 hover:text-foreground cursor-pointer hover:bg-black/8 dark:hover:bg-white/8",
        active &&
          "bg-[#c2e7ff] text-[#001d35] dark:bg-[#004a77] dark:text-[#c2e7ff]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ToolbarSeparator() {
  return <div className="bg-foreground/15 mx-1 h-5 w-px shrink-0" />
}

// ─── Color Picker ──────────────────────────────────────────────────────────
//  Opens a native color input without ever stealing focus from the editor.

function ColorPicker({
  tooltip,
  currentColor,
  onApply,
  children,
}: {
  tooltip: string
  currentColor?: string
  children: React.ReactNode
  onApply: (color: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <button
      type="button"
      title={tooltip}
      // Prevent default so focus stays in the editor
      onMouseDown={(e) => {
        e.preventDefault()
        inputRef.current?.click()
      }}
      className="text-foreground/70 hover:text-foreground flex h-7 min-w-7 items-center justify-center gap-1 rounded px-1.5 text-sm transition-colors hover:bg-black/8 dark:hover:bg-white/8"
    >
      {children}
      <input
        ref={inputRef}
        type="color"
        defaultValue={currentColor ?? "#000000"}
        className="absolute h-0 w-0 opacity-0"
        tabIndex={-1}
        onInput={(e) => onApply((e.target as HTMLInputElement).value)}
      />
    </button>
  )
}

// ─── Main Toolbar ──────────────────────────────────────────────────────────

interface EditorToolbarProps {
  editor: Editor | null
  className?: string
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  // Subscribe to editor state so active-state indicators are always fresh
  useEditorUpdate(editor)

  // Store the selection before the heading <select> steals focus
  const savedSelection = React.useRef<{ from: number; to: number } | null>(null)

  if (!editor) return null

  const currentStyle = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : editor.isActive("heading", { level: 4 })
          ? "h4"
          : "p"

  const currentTextColor =
    (editor.getAttributes("textStyle").color as string | undefined) ?? ""
  const currentHighlightColor =
    (editor.getAttributes("highlight").color as string | undefined) ?? ""

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-0.5 px-3 py-1",
        className
      )}
    >
      {/* ── Paragraph / Heading style ─────────────────────────────────────── */}
      <select
        className="text-foreground/80 mr-1 h-7 cursor-pointer rounded border-none bg-transparent px-2 text-[13px] font-medium outline-none hover:bg-black/8 dark:hover:bg-white/8"
        value={currentStyle}
        // Save selection BEFORE focus leaves the editor
        onMouseDown={() => {
          savedSelection.current = {
            from: editor.state.selection.from,
            to: editor.state.selection.to,
          }
        }}
        onChange={(e) => {
          const val = e.target.value
          // Restore selection, then apply heading
          const chain = savedSelection.current
            ? editor.chain().focus().setTextSelection(savedSelection.current)
            : editor.chain().focus()

          if (val === "p") chain.setParagraph().run()
          else if (val === "h1") chain.setHeading({ level: 1 }).run()
          else if (val === "h2") chain.setHeading({ level: 2 }).run()
          else if (val === "h3") chain.setHeading({ level: 3 }).run()
          else if (val === "h4") chain.setHeading({ level: 4 }).run()

          savedSelection.current = null
        }}
      >
        <option value="p">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      <ToolbarSeparator />

      {/* ── Text formatting ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          tooltip="Bold (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <HugeiconsIcon icon={TextBoldIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Italic (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <HugeiconsIcon icon={TextItalicIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Underline (Ctrl+U)"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <HugeiconsIcon icon={TextUnderlineIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <HugeiconsIcon icon={TextStrikethroughIcon} size={15} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      {/* ── Colors ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        {/* Text color */}
        <ColorPicker
          tooltip="Text color"
          currentColor={currentTextColor || "#000000"}
          onApply={(c) => editor.chain().focus().setColor(c).run()}
        >
          <span
            className="text-[13px] leading-none font-bold"
            style={{
              borderBottom: `3px solid ${currentTextColor || "currentColor"}`,
              paddingBottom: "1px",
            }}
          >
            A
          </span>
        </ColorPicker>

        {/* Highlight / background color */}
        <ColorPicker
          tooltip="Highlight color (background)"
          currentColor={currentHighlightColor || "#ffff00"}
          onApply={(c) =>
            editor.chain().focus().setHighlight({ color: c }).run()
          }
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <HugeiconsIcon icon={HighlighterIcon} size={14} />
            <span
              className="absolute right-0 bottom-0 left-0 h-[3px] rounded-full"
              style={{ backgroundColor: currentHighlightColor || "#facc15" }}
            />
          </span>
        </ColorPicker>
      </div>

      <ToolbarSeparator />

      {/* ── Text alignment ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          tooltip="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <HugeiconsIcon icon={TextAlignLeftIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <HugeiconsIcon icon={TextAlignCenterIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <HugeiconsIcon icon={TextAlignRightIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <HugeiconsIcon icon={TextAlignJustifyCenterIcon} size={15} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      {/* ── Lists ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          tooltip="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <HugeiconsIcon icon={LeftToRightListBulletIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <HugeiconsIcon icon={LeftToRightListNumberIcon} size={15} />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Task list"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <span className="text-base leading-none">☑</span>
        </ToolbarButton>
      </div>
    </div>
  )
}

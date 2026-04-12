import CharacterCount from "@tiptap/extension-character-count"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"

export const getBaseExtensions = (
  placeholder = "Start writing your idea..."
) => [
  StarterKit.configure({
    // Required for Liveblocks collaboration — the extension handles its own history
    undoRedo: false,
  }),
  Placeholder.configure({ placeholder }),
  Underline,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({ openOnClick: false }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color,
  TaskList,
  TaskItem.configure({ nested: true }),
  CharacterCount.configure({ limit: 10000 }),
]

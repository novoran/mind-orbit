import { CharacterCount } from "@tiptap/extension-character-count"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { Link } from "@tiptap/extension-link"
import { Placeholder } from "@tiptap/extension-placeholder"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Underline } from "@tiptap/extension-underline"
import { StarterKit } from "@tiptap/starter-kit"

import type { AnyExtension } from "@tiptap/core"

/**
 * Returns the base set of Tiptap extensions used across the app.
 * We use AnyExtension[] to avoid a common Tiptap v3 type mismatch with StarterKit's internal signatures.
 */
export const getBaseExtensions = (
  placeholder = "Start writing your idea..."
): Array<AnyExtension> => [
  StarterKit.configure({
    // Required for Liveblocks collaboration — Liveblocks handles its own history
    history: false,
  }) as AnyExtension,
  Placeholder.configure({ placeholder }) as AnyExtension,
  Underline.configure() as AnyExtension,
  TextAlign.configure({ types: ["heading", "paragraph"] }) as AnyExtension,
  Link.configure({ openOnClick: false }) as AnyExtension,
  Highlight.configure({ multicolor: true }) as AnyExtension,
  TextStyle.configure() as AnyExtension,
  Color.configure() as AnyExtension,
  TaskList.configure() as AnyExtension,
  TaskItem.configure({ nested: true }) as AnyExtension,
  CharacterCount.configure({ limit: 10000 }) as AnyExtension,
]

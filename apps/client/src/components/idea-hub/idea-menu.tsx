import { Delete02Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import { cn } from "@mindorbit/ui/lib/utils"

import type { Id } from "@mindorbit/backend/_generated/dataModel"

interface IdeaMenuProps {
  ideaId: Id<"ideas">
  onDelete: (id: Id<"ideas">) => void
  triggerClassName?: string
  align?: "start" | "center" | "end"
}

export function IdeaMenu({
  ideaId,
  onDelete,
  triggerClassName,
  align = "end",
}: IdeaMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", triggerClassName)}
            {...props}
            onClick={(e) => {
              e.stopPropagation()
              props.onClick?.(e)
            }}
          >
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              size={16}
              className="text-muted-foreground"
            />
          </Button>
        )}
      />
      <DropdownMenuContent align={align} className="w-44 p-1.5">
        <DropdownMenuItem
          className="group text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(ideaId)
          }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md transition-colors">
            <HugeiconsIcon
              icon={Delete02Icon}
              size={14}
              className="text-destructive"
            />
          </div>
          Delete Idea
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

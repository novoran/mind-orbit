import { Clock01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback } from "@mindorbit/ui/components/avatar"
import { Button } from "@mindorbit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"

import type { ColumnDef } from "@tanstack/react-table"
import type { Doc, Id } from "@mindorbit/backend/_generated/dataModel"

import { DataTable } from "@/components/data-table"

interface IdeaTableProps {
  ideas: Array<Doc<"ideas">>
  onOpen: (id: Id<"ideas">) => void
  onDelete: (id: Id<"ideas">) => void
}

function formatDate(ts: number) {
  const d = new Date(ts)
  const now = Date.now()
  const delta = now - ts
  if (delta < 60_000) return "just now"
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m ago`
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)}h ago`
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function IdeaTable({ ideas, onOpen, onDelete }: IdeaTableProps) {
  const columns: Array<ColumnDef<Doc<"ideas">>> = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-foreground font-semibold">
          {row.original.title}
        </span>
      ),
    },
    {
      id: "owner",
      header: "Owned by",
      cell: () => (
        <div className="flex items-center gap-2">
          <Avatar className="border-background ring-border h-7 w-7 border-2 ring-1">
            <AvatarFallback className="bg-primary/10 text-primary flex items-center justify-center text-center text-[10px] font-bold">
              ME
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground/80 text-sm font-medium">You</span>
        </div>
      ),
    },
    {
      id: "contributors",
      header: "Contributors",
      cell: () => (
        <div className="flex -space-x-2">
          <Avatar className="border-background ring-border h-7 w-7 border-2 shadow-sm ring-1">
            <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
              +0
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "lastOpenedAt",
      header: "Last edited",
      cell: ({ row }) => {
        const idea = row.original
        return (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <HugeiconsIcon icon={Clock01Icon} size={14} />
            <span>{formatDate(idea.lastOpenedAt ?? idea.createdAt)}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="w-[80px]">Actions</div>,
      cell: ({ row }) => {
        const idea = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(idea._id)
                }}
              >
                Delete Idea
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="[&>div]:rounded-lg">
      <DataTable
        columns={columns}
        data={ideas}
        pageSize={10}
        onRowClick={(idea) => onOpen(idea._id)}
        emptyMessage="No ideas found. Try creating a new one!"
      />
    </div>
  )
}

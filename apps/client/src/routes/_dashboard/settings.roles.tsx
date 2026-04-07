import {
  MoreVerticalIcon,
  PencilEdit01Icon,
  UserAdd01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback } from "@mindorbit/ui/components/avatar"
import { Badge } from "@mindorbit/ui/components/badge"
import { Button } from "@mindorbit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mindorbit/ui/components/select"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"

export const Route = createFileRoute("/_dashboard/settings/roles")({
  component: SettingsRolesPage,
})

const MOCK_ROLES = [
  {
    id: "1",
    name: "Admin",
    description: "Full orbit access and security settings.",
    type: "SYSTEM",
    status: "Active",
    membersCount: 3,
  },
  {
    id: "2",
    name: "Member",
    description: "Can create projects and tasks, view team boards.",
    type: "SYSTEM",
    status: "Inactive",
    membersCount: 0,
  },
  {
    id: "3",
    name: "Guest",
    description: "Restricted access to specific items only.",
    type: "SYSTEM",
    status: "Active",
    membersCount: 4,
  },
  {
    id: "4",
    name: "Designer",
    description: "Plus access to Asset Library management.",
    type: "CUSTOM",
    status: "Active",
    membersCount: 2,
  },
  {
    id: "5",
    name: "Product Manager",
    description: "Define product roadmap and manage feature backlogs.",
    type: "CUSTOM",
    status: "Active",
    membersCount: 1,
  },
]

type Role = (typeof MOCK_ROLES)[0]

const columns: Array<ColumnDef<Role>> = [
  {
    accessorKey: "name",
    header: () => <div className="w-[300px]">ROLE NAME</div>,
    cell: ({ row }) => {
      const role = row.original
      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{role.name}</span>
          <span className="text-muted-foreground text-xs">
            {role.description}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => {
      const role = row.original
      return (
        <Badge
          variant="outline"
          className={`font-semibold ${role.type === "SYSTEM" ? "bg-muted text-muted-foreground border-border/50" : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}
        >
          {role.type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const role = row.original
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${role.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span
            className={
              role.status === "Active"
                ? "font-medium text-green-700 dark:text-green-500"
                : "text-muted-foreground"
            }
          >
            {role.status}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "membersCount",
    header: "MEMBERS",
    cell: ({ row }) => {
      const role = row.original
      return <AvatarGroup count={role.membersCount} />
    },
  },
  {
    id: "actions",
    header: () => <div className="w-[80px]">ACTIONS</div>,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button variant="ghost" size="icon" className="h-8 w-8" {...props}>
              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={16}
                className="text-muted-foreground"
              />
            </Button>
          )}
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2 text-nowrap">
            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
            Edit Role
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-nowrap">
            <HugeiconsIcon icon={ViewIcon} size={16} />
            View Permissions
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-nowrap text-blue-600 dark:text-blue-400">
            <HugeiconsIcon icon={UserAdd01Icon} size={16} />
            Assign Members
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function AvatarGroup({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="text-muted-foreground text-sm italic">
        No users assigned
      </span>
    )

  const displayCount = Math.min(count, 3)
  const remaining = count - displayCount

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {Array.from({ length: displayCount }).map((_, i) => (
        <Avatar
          key={i}
          className="ring-background inline-block h-8 w-8 rounded-full bg-slate-200 ring-2"
        >
          <AvatarFallback className="bg-emerald-700/20" />
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="ring-background bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ring-2">
          +{remaining}
        </div>
      )}
    </div>
  )
}

function SettingsRolesPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DataTable
        columns={columns}
        data={MOCK_ROLES}
        searchableColumns={["name", "description", "type", "status"]}
        emptyMessage="No roles found."
        toolbar={
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Status:
              </span>
              <Select defaultValue="All">
                <SelectTrigger className="h-9 w-24">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Type:
              </span>
              <Select defaultValue="All Types">
                <SelectTrigger className="h-9 w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
      />
    </div>
  )
}

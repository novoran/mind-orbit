import {
  Activity01Icon,
  Copy01Icon,
  MoreVerticalIcon,
  PencilEdit01Icon,
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

export const Route = createFileRoute("/_dashboard/settings/members")({
  component: SettingsMembersPage,
})

const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@mindorbit.io",
    role: "Admin",
    lastActive: "Active now",
    roleColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    initials: "AR",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.c@mindorbit.io",
    role: "Member",
    lastActive: "2 hours ago",
    roleColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    initials: "SC",
    avatarBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "marcus@partner.com",
    role: "Guest",
    lastActive: "Yesterday",
    roleColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    initials: "MJ",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "4",
    name: "David Miller",
    email: "david.m@mindorbit.io",
    role: "Member",
    lastActive: "Oct 12, 2023",
    roleColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    initials: "DM",
    avatarBg: "bg-orange-100 text-orange-700",
  },
]

type Member = (typeof MOCK_MEMBERS)[0]

const columns: Array<ColumnDef<Member>> = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className={`h-10 w-10 ${member.avatarBg}`}>
            <AvatarFallback className="bg-transparent">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-muted-foreground text-sm">
              {member.email}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "ROLE",
    cell: ({ row }) => {
      const member = row.original
      return (
        <Badge
          variant="secondary"
          className={`border-none ${member.roleColor}`}
        >
          {member.role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastActive",
    header: "LAST ACTIVE",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("lastActive")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-[80px]">ACTIONS</div>,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={() => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={16}
                className="text-muted-foreground"
              />
            </Button>
          )}
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2">
            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
            Edit Member
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <HugeiconsIcon icon={Activity01Icon} size={16} />
            View Activity
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <HugeiconsIcon icon={Copy01Icon} size={16} />
            Copy Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function SettingsMembersPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DataTable
        columns={columns}
        data={MOCK_MEMBERS}
        searchableColumns={["name", "email", "role"]}
        emptyMessage="No members found."
        toolbar={
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Filter by:
            </span>
            <Select defaultValue="All Roles">
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  )
}

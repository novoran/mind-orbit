import {
  Copy01Icon,
  MoreVerticalIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@mindorbit/ui/components/badge"
import { Button } from "@mindorbit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"

export const Route = createFileRoute("/_dashboard/(spaces)/settings/api-keys")({
  component: SettingsApiKeysPage,
})

const MOCK_API_KEYS = [
  {
    id: "1",
    name: "Production Server",
    key: "mo_live_••••••••abcd",
    created: "Oct 24, 2023",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    name: "Development",
    key: "mo_dev_••••••••x9z2",
    created: "Dec 12, 2023",
    lastUsed: "Never",
  },
  {
    id: "3",
    name: "Analytic Webhook",
    key: "mo_live_••••••••jk77",
    created: "Jan 05, 2024",
    lastUsed: "3 days ago",
  },
]

type ApiKey = (typeof MOCK_API_KEYS)[0]

const columns: Array<ColumnDef<ApiKey>> = [
  {
    accessorKey: "name",
    header: () => <div className="w-50">NAME</div>,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "key",
    header: "KEY",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="text-muted-foreground bg-muted gap-2 px-2 py-1 font-mono"
      >
        {row.original.key}
        <HugeiconsIcon
          icon={Copy01Icon}
          size={14}
          className="hover:text-foreground cursor-pointer"
        />
      </Badge>
    ),
  },
  {
    accessorKey: "created",
    header: "CREATED",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {row.original.created}
      </span>
    ),
  },
  {
    accessorKey: "lastUsed",
    header: "LAST USED",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {row.original.lastUsed}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-20">ACTIONS</div>,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button variant="ghost" size="icon" className="size-8" {...props}>
              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={16}
                className="text-muted-foreground"
              />
            </Button>
          )}
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Revoke Key</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function SettingsApiKeysPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Security notice */}
      <div className="border-border/50 bg-background flex items-start gap-3 rounded-xl border p-4">
        <div className="bg-muted mt-0.5 shrink-0 rounded-lg p-2">
          <HugeiconsIcon
            icon={Shield01Icon}
            size={20}
            className="text-foreground"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Keep your API keys secure</h3>
          <p className="text-muted-foreground text-sm">
            API keys provide full access to your orbit data. Never share them in
            public repositories or client-side code. If a key is compromised,
            revoke it immediately.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_API_KEYS}
        searchableColumns={["name", "key"]}
        emptyMessage="No API keys found."
      />
    </div>
  )
}

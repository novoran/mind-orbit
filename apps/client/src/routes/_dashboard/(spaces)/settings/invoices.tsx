import { Download01Icon, FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@mindorbit/ui/components/badge"
import { Button } from "@mindorbit/ui/components/button"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"

export const Route = createFileRoute("/_dashboard/(spaces)/settings/invoices")({
  component: SettingsInvoicesPage,
})

const MOCK_INVOICES = [
  {
    id: "INV-2024-003",
    date: "Oct 24, 2024",
    amount: "$450.00",
    status: "PAID",
  },
  {
    id: "INV-2024-002",
    date: "Sep 24, 2024",
    amount: "$450.00",
    status: "PAID",
  },
  {
    id: "INV-2024-001",
    date: "Aug 24, 2024",
    amount: "$120.00",
    status: "PENDING",
  },
]

type Invoice = (typeof MOCK_INVOICES)[0]

const columns: Array<ColumnDef<Invoice>> = [
  {
    accessorKey: "id",
    header: () => <div className="w-[180px]">INVOICE ID</div>,
    cell: ({ row }) => <span className="font-semibold">{row.original.id}</span>,
  },
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {row.original.date}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.amount}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          className={`text-[10px] font-semibold uppercase ${
            status === "PAID"
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
          }`}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="w-[80px]">ACTION</div>,
    cell: () => (
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground h-8 w-8"
      >
        <HugeiconsIcon icon={Download01Icon} size={16} />
      </Button>
    ),
  },
]

function SettingsInvoicesPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DataTable
        columns={columns}
        data={MOCK_INVOICES}
        searchableColumns={["id", "status"]}
        emptyMessage="No invoices found."
        toolbar={
          <Button variant="outline" className="bg-muted/30 gap-2">
            <HugeiconsIcon icon={FilterIcon} size={16} />
            Filter
          </Button>
        }
      />

      {/* Support Card */}
      <div className="border-border/50 flex flex-col rounded-xl border bg-blue-50/50 p-6 dark:bg-blue-900/10">
        <h3 className="text-foreground text-sm font-semibold">
          Need help with your billing?
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Our support team is ready to assist you with any payment or invoice
          inquiries.{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}

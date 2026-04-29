import { Button } from "@mindorbit/ui/components/button"
import { SearchInput } from "@mindorbit/ui/components/search-input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mindorbit/ui/components/table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { cn } from "@mindorbit/ui/lib/utils"
import type { ColumnDef, RowData } from "@tanstack/react-table"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DataTableProps<TData extends RowData> {
  /** Column definitions */
  columns: Array<ColumnDef<TData>>
  /** Row data */
  data: Array<TData>
  /**
   * Keys of columns whose string values should be included in the global
   * search. Pass an empty array (or omit) to hide the search bar.
   */
  searchableColumns?: Array<keyof TData>
  /** Number of rows per page (default: 10) */
  pageSize?: number
  /** Extra toolbar content rendered to the right of the search input */
  toolbar?: React.ReactNode
  /** Message shown when there are no rows */
  emptyMessage?: string
  /** Callback when a row is clicked */
  onRowClick?: (data: TData) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTable<TData extends RowData>({
  columns,
  data,
  searchableColumns = [],
  pageSize = 10,
  toolbar,
  emptyMessage = "No results found.",
  onRowClick,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    initialState: {
      pagination: { pageSize },
    },
    globalFilterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue) return true
      const query = filterValue.toLowerCase()
      // Only search in the fields the caller listed
      if (searchableColumns.length === 0) return true
      return searchableColumns.some((key) => {
        const cell = row.original[key]
        return String(cell ?? "")
          .toLowerCase()
          .includes(query)
      })
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { pageIndex } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const start = pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, totalRows)
  const showSearch = searchableColumns.length > 0

  return (
    <div className="border-border/50 bg-background flex flex-col rounded-xl border">
      {/* Toolbar */}
      {(showSearch || toolbar) && (
        <div className="border-border/50 flex flex-wrap items-center justify-between gap-3 border-b p-4">
          {showSearch && (
            <SearchInput
              containerClassName="w-full sm:w-72"
              className="bg-muted/30 border-none rounded-lg"
              placeholder="Search…"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          )}
          {toolbar && (
            <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground h-12 text-xs font-bold tracking-wider uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    onRowClick && "hover:bg-muted/50 cursor-pointer"
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination — always rendered */}
      <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t p-4 text-sm">
        <span>
          {totalRows === 0
            ? "No results"
            : `Showing ${start}–${end} of ${totalRows}`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <span className="sr-only">Previous page</span>
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <span className="sr-only">Next page</span>
            {">"}
          </Button>
        </div>
      </div>
    </div>
  )
}

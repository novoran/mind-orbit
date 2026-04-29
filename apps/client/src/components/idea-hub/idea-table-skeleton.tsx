import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mindorbit/ui/components/table"
import * as React from "react"

export function IdeaTableSkeleton() {
  return (
    <div className="border-border bg-card rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40%] px-6 py-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              NAME
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              OWNED BY
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              CONTRIBUTORS
            </TableHead>
            <TableHead className="px-6 py-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              LAST EDITED
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 animate-pulse rounded-full border-2 border-background bg-muted" />
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

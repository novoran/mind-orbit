import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mindorbit/ui/components/table"

export function IdeaTableSkeleton() {
  return (
    <div className="border-border/50 bg-background overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground w-[40%] px-6 py-4 text-[11px] font-bold tracking-wider uppercase">
              NAME
            </TableHead>
            <TableHead className="text-muted-foreground px-6 py-4 text-[11px] font-bold tracking-wider uppercase">
              OWNED BY
            </TableHead>
            <TableHead className="text-muted-foreground px-6 py-4 text-[11px] font-bold tracking-wider uppercase">
              CONTRIBUTORS
            </TableHead>
            <TableHead className="text-muted-foreground px-6 py-4 text-[11px] font-bold tracking-wider uppercase">
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
                  <div className="bg-muted h-10 w-10 animate-pulse rounded-lg" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-48 animate-pulse rounded" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-muted h-7 w-7 animate-pulse rounded-full" />
                  <div className="bg-muted h-4 w-12 animate-pulse rounded" />
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex -space-x-2">
                  <div className="border-background bg-muted h-7 w-7 animate-pulse rounded-full border-2" />
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="bg-muted h-4 w-20 animate-pulse rounded" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="bg-muted h-8 w-8 animate-pulse rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

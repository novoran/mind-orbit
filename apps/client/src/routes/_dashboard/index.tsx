import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="border-border/50 bg-muted/50 flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border p-6">
          <span className="font-medium">Overview Content</span>
        </div>
        <div className="border-border/50 bg-muted/50 flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border p-6">
          <span className="font-medium">Stats Placeholder</span>
        </div>
        <div className="border-border/50 bg-muted/50 flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border p-6">
          <span className="font-medium">Activity Placeholder</span>
        </div>
      </div>
      <div className="border-border/50 bg-muted/50 flex min-h-screen flex-1 flex-col rounded-xl border p-6 md:min-h-min">
        <p className="text-muted-foreground">
          This is the dashboard overview content.
        </p>
      </div>
    </div>
  )
}

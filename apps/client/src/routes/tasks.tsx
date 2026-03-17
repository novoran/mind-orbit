import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
})

function TasksPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <div className="border-border/50 bg-muted/50 flex min-h-screen flex-1 flex-col rounded-xl border p-6 md:min-h-min">
        <p className="text-muted-foreground">Welcome to Tasks.</p>
      </div>
    </div>
  )
}

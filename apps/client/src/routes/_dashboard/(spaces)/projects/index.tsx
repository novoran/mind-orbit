import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/(spaces)/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <div className="border-border/50 bg-muted/50 flex min-h-screen flex-1 flex-col rounded-xl border p-6 md:min-h-min">
        <p className="text-muted-foreground">Welcome to Projects.</p>
      </div>
    </div>
  )
}

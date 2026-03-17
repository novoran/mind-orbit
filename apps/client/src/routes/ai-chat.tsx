import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/ai-chat")({
  component: AIChatPage,
})

function AIChatPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold">AI Chat</h1>
      <div className="border-border/50 bg-muted/50 flex min-h-screen flex-1 flex-col rounded-xl border p-6 md:min-h-min">
        <p className="text-muted-foreground">Welcome to the AI Chat.</p>
      </div>
    </div>
  )
}

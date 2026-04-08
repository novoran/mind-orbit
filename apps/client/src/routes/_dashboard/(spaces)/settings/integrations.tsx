import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_dashboard/(spaces)/settings/integrations"
)({
  component: SettingsIntegrationsPage,
})

function SettingsIntegrationsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="border-border/50 bg-background flex h-[400px] flex-col items-center justify-center rounded-xl border p-12 text-center">
        <h2 className="mb-2 text-xl font-semibold">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your orbit with Slack, GitHub, Jira, and other tools.
        </p>
      </div>
    </div>
  )
}

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/settings/usage")({
  component: SettingsUsagePage,
})

function SettingsUsagePage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="border-border/50 bg-background flex h-[400px] flex-col items-center justify-center rounded-xl border p-12 text-center">
        <h2 className="mb-2 text-xl font-semibold">Usage</h2>
        <p className="text-muted-foreground">
          Monitor u0045 resource usage, user seats, and feature limits.
        </p>
      </div>
    </div>
  )
}

import { Badge } from "@mindorbit/ui/components/badge"
import { Button } from "@mindorbit/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"
import { createFileRoute } from "@tanstack/react-router"

import { semanticColors } from "@/lib/color-system"

const metrics = [
  {
    label: "Active projects",
    value: "12",
    note: "+2 from last month",
  },
  {
    label: "Tasks in motion",
    value: "48",
    note: "85% completion rate",
  },
  {
    label: "Team velocity",
    value: "x4.2",
    note: "Steady upward trend",
  },
]

const activity = [
  {
    title: "Design system review",
    detail: "Three UI updates are ready for approval across the client app.",
  },
  {
    title: "Workspace sync",
    detail: "Eight members are currently aligned on the active orbit.",
  },
  {
    title: "Delivery focus",
    detail: "Project milestones are holding steady and on schedule.",
  },
]

const pulse = [
  {
    label: "Workspace health",
    value: "Stable",
    detail: "No blockers reported in the current orbit.",
  },
  {
    label: "Open reviews",
    value: "4",
    detail: "Two in design, one in content, one in QA.",
  },
  {
    label: "Focus area",
    value: "Dashboard system",
    detail: "Continue replacing raw palette usage with semantic tokens.",
  },
]

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: "Dashboard | MindOrbit",
      },
      {
        name: "description",
        content: "Overview of your recent activities, tools, and updates.",
      },
    ],
  }),
})

function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-3 lg:p-4">
      <header className="flex flex-col gap-2">
        <Badge className={semanticColors.badge.primary}>Dashboard</Badge>
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            A semantic color baseline for the client. Everything here now uses
            the same token language as the rest of the app.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
        <Card className="border-border/70">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Workspace overview</CardTitle>
              <p className="text-muted-foreground text-sm">
                Current momentum across projects, tasks, and team sync.
              </p>
            </div>
            <Badge className={semanticColors.badge.primary}>Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border-border/70 bg-muted/30 rounded-2xl border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                      {metric.label}
                    </p>
                    <span className={semanticColors.badge.primary}>Synced</span>
                  </div>
                  <div className="text-foreground mt-3 text-3xl font-bold tracking-tight">
                    {metric.value}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <p className="text-muted-foreground text-sm">
              High-signal actions for the current workspace state.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pulse.map((item) => (
              <div
                key={item.label}
                className="border-border/70 bg-background rounded-xl border p-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-foreground text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-primary text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            <Button className={`${semanticColors.action.primary} mt-1 w-full`}>
              Review workspace
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <p className="text-muted-foreground text-sm">
              The latest updates that affect your orbit.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {activity.map((item) => (
              <div
                key={item.title}
                className="border-border/70 bg-muted/20 flex items-start gap-4 rounded-xl border p-4"
              >
                <div className="bg-primary/40 mt-1 size-2.5 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-foreground text-sm font-semibold">
                      {item.title}
                    </h3>
                    <Badge className={semanticColors.badge.muted}>Update</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Team pulse</CardTitle>
            <p className="text-muted-foreground text-sm">
              A quick read on collaboration and capacity.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pulse.map((item) => (
              <div
                key={item.label}
                className="border-border/70 bg-background rounded-xl border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-foreground text-sm font-medium">
                    {item.label}
                  </p>
                  <span className="text-primary text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.detail}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

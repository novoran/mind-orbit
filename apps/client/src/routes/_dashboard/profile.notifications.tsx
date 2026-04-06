import {
  AiChat02Icon,
  Mail01Icon,
  MonitorDotIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"
import { Checkbox } from "@mindorbit/ui/components/checkbox"
import { Separator } from "@mindorbit/ui/components/separator"
import { Switch } from "@mindorbit/ui/components/switch"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

export const Route = createFileRoute("/_dashboard/profile/notifications")({
  component: NotificationsPage,
})

function NotificationsPage() {
  const [workspace, setWorkspace] = React.useState({
    projectUpdates: true,
    milestoneReached: true,
    taskAssignments: true,
    newTeamMembers: false,
  })

  const [ai, setAi] = React.useState({
    insightsReady: true,
    dailySummary: true,
    copilotSuggestions: false,
  })

  const [delivery, setDelivery] = React.useState({
    email: true,
    desktop: false,
  })

  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Workspace Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Notifications</CardTitle>
          <CardDescription>
            Control activity alerts from your shared workspaces and projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          <NotifRow
            label="Project Updates"
            description="Receive alerts when comments or changes are made to projects."
            checked={workspace.projectUpdates}
            onCheckedChange={(v) =>
              setWorkspace((s) => ({ ...s, projectUpdates: v }))
            }
          />
          <Separator />
          <NotifRow
            label="Milestone Reached"
            description="Get notified when key project milestones are completed."
            checked={workspace.milestoneReached}
            onCheckedChange={(v) =>
              setWorkspace((s) => ({ ...s, milestoneReached: v }))
            }
          />
          <Separator />
          <NotifRow
            label="Task Assignments"
            description="Receive a notification when you are assigned a new task."
            checked={workspace.taskAssignments}
            onCheckedChange={(v) =>
              setWorkspace((s) => ({ ...s, taskAssignments: v }))
            }
          />
          <Separator />
          <NotifRow
            label="New Team Members"
            description="Be notified when a new member joins your workspace."
            checked={workspace.newTeamMembers}
            onCheckedChange={(v) =>
              setWorkspace((s) => ({ ...s, newTeamMembers: v }))
            }
          />
        </CardContent>
      </Card>

      {/* AI Assistant Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex size-7 items-center justify-center rounded-md border">
              <HugeiconsIcon
                icon={AiChat02Icon}
                size={14}
                strokeWidth={2}
                className="text-primary"
              />
            </div>
            <div>
              <CardTitle>AI Assistant Notifications</CardTitle>
              <CardDescription className="mt-0.5">
                Manage how the AI Copilot interacts with your workflow.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          <NotifRow
            label="AI Insights Ready"
            description="Alerts when long-running analysis or document processing is complete."
            checked={ai.insightsReady}
            onCheckedChange={(v) => setAi((s) => ({ ...s, insightsReady: v }))}
          />
          <Separator />
          <NotifRow
            label="Daily AI Summary"
            description="Receive a morning brief of your tasks and productivity trends."
            checked={ai.dailySummary}
            onCheckedChange={(v) => setAi((s) => ({ ...s, dailySummary: v }))}
          />
          <Separator />
          <NotifRow
            label="Copilot Suggestions"
            description="Interactive prompts when AI detects possible workspace optimizations."
            checked={ai.copilotSuggestions}
            onCheckedChange={(v) =>
              setAi((s) => ({ ...s, copilotSuggestions: v }))
            }
          />
        </CardContent>
      </Card>

      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
          <CardDescription>
            Choose the channels where you want to stay updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DeliveryRow
            icon={Mail01Icon}
            label="Email Notifications"
            description="Summary of updates sent to your registered email address."
            checked={delivery.email}
            onCheckedChange={(v) => setDelivery((s) => ({ ...s, email: v }))}
          />
          <DeliveryRow
            icon={MonitorDotIcon}
            label="Desktop Notifications"
            description="Real-time alerts directly on your browser or OS."
            checked={delivery.desktop}
            onCheckedChange={(v) => setDelivery((s) => ({ ...s, desktop: v }))}
          />
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function NotifRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5 shrink-0"
      />
    </div>
  )
}

function DeliveryRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted/50 flex size-9 shrink-0 items-center justify-center rounded-md border">
          <HugeiconsIcon
            icon={icon}
            size={16}
            strokeWidth={2}
            className="text-muted-foreground"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(!!v)}
        className="shrink-0"
      />
    </div>
  )
}

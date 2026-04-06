import { Button } from "@mindorbit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"

import { Separator } from "@mindorbit/ui/components/separator"
import { Switch } from "@mindorbit/ui/components/switch"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

export const Route = createFileRoute("/_dashboard/profile/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notification Settings | MindOrbit" },
      {
        name: "description",
        content: "Choose how and when you want to be notified.",
      },
    ],
  }),
})

function NotificationsPage() {
  const [workspace, setWorkspace] = React.useState({
    projectUpdates: true,
    milestoneReached: true,
    taskAssignments: true,
    newTeamMembers: false,
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

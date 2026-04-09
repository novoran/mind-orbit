import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { Switch } from "@mindorbit/ui/components/switch"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { gooeyToast } from "goey-toast"
import * as React from "react"

import { api } from "@mindorbit/backend/_generated/api"

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
  const mutate = useConvexMutation(api.settings.update)
  const { data: settings } = useQuery(convexQuery(api.settings.get, {}))
  const updateSettings = useMutation({
    mutationFn: mutate,
  })

  const [orbit, setOrbit] = React.useState({
    projectUpdates: true,
    milestoneReached: true,
    taskAssignments: true,
    newTeamMembers: false,
  })

  const handleSave = () => {
    const savePromise = updateSettings.mutateAsync({
      projectUpdates: orbit.projectUpdates,
      milestoneReached: orbit.milestoneReached,
      taskAssignments: orbit.taskAssignments,
      newTeamMembers: orbit.newTeamMembers,
    })

    gooeyToast.promise(savePromise, {
      loading: "Updating notification settings...",
      success: "Notification settings updated!",
      error: "Failed to update notification settings",
    })
  }

  // Initialize state from backend data
  React.useEffect(() => {
    if (settings) {
      setOrbit({
        projectUpdates: settings.projectUpdates,
        milestoneReached: settings.milestoneReached,
        taskAssignments: settings.taskAssignments,
        newTeamMembers: settings.newTeamMembers,
      })
    }
  }, [settings])

  if (!settings) {
    return (
      <div className="flex flex-col gap-4">
        {/* <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
                {i < 4 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card> */}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Orbit Notifications */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Orbit Notifications</CardTitle>
          <CardDescription>
            Control activity alerts from your shared orbits and projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          <NotifRow
            label="Project Updates"
            description="Receive alerts when comments or changes are made to projects."
            checked={orbit.projectUpdates}
            onCheckedChange={(v) =>
              setOrbit((s) => ({ ...s, projectUpdates: v }))
            }
          />
          <Separator />
          <NotifRow
            label="Milestone Reached"
            description="Get notified when key project milestones are completed."
            checked={orbit.milestoneReached}
            onCheckedChange={(v) =>
              setOrbit((s) => ({ ...s, milestoneReached: v }))
            }
          />
          <Separator />
          <NotifRow
            label="Task Assignments"
            description="Receive a notification when you are assigned a new task."
            checked={orbit.taskAssignments}
            onCheckedChange={(v) =>
              setOrbit((s) => ({ ...s, taskAssignments: v }))
            }
          />
          <Separator />
          <NotifRow
            label="New Team Members"
            description="Be notified when a new member joins your orbit."
            checked={orbit.newTeamMembers}
            onCheckedChange={(v) =>
              setOrbit((s) => ({ ...s, newTeamMembers: v }))
            }
          />
        </CardContent>
        <CardFooter className="flex items-center justify-end border-t pt-4">
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card> */}
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

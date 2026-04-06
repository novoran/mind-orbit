import { Download05Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mindorbit/ui/components/alert-dialog"
import { Button } from "@mindorbit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"
import { Skeleton } from "@mindorbit/ui/components/skeleton"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

import { Separator } from "@mindorbit/ui/components/separator"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_dashboard/profile/account")({
  component: AccountSettingsPage,
})

function AccountSettingsPage() {
  const session = authClient.useSession()
  const user = session.data?.user
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    // placeholder export logic
    await new Promise((r) => setTimeout(r, 1500))
    setIsExporting(false)
  }

  const handleDeactivate = async () => {
    // placeholder deactivation logic
    alert("Account deactivated (demo only)")
  }

  const handleDelete = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in"
        },
      },
    })
  }

  if (session.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 rounded-lg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Email Address Card */}
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Change your login email and communication address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="bg-background flex size-9 shrink-0 items-center justify-center rounded-md border">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={16}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                  Current Email
                </span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Change Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Control your workspace content and account portability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Export Workspace Data</span>
              <span className="text-muted-foreground text-sm">
                Download a complete archive of your chats, projects, and task
                history in JSON format.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="shrink-0"
            >
              <HugeiconsIcon
                icon={Download05Icon}
                size={14}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription className="text-destructive/70">
            Irreversible actions regarding your account and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          {/* Deactivate */}
          <div className="flex items-start justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Deactivate Account</span>
              <span className="text-muted-foreground text-sm">
                Temporarily disable your account. You can reactivate it at any
                time by logging back in.
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="outline" size="sm" className="shrink-0" />
                }
              >
                Deactivate
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your account will be temporarily disabled. You can log back
                    in at any time to reactivate it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeactivate}
                    variant="outline"
                  >
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          {/* Delete */}
          <div className="flex items-start justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Delete Account</span>
              <span className="text-muted-foreground text-sm">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                  />
                }
              >
                Delete permanently
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is permanent and cannot be undone. All your
                    data, workspaces, and content will be deleted immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    Delete permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@mindorbit/ui/components/avatar"
import { Button } from "@mindorbit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"
import { Input } from "@mindorbit/ui/components/input"
import { Label } from "@mindorbit/ui/components/label"
import { Separator } from "@mindorbit/ui/components/separator"
import { Skeleton } from "@mindorbit/ui/components/skeleton"
import { Textarea } from "@mindorbit/ui/components/textarea"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_dashboard/profile/")({
  component: ProfileIndexPage,
  head: () => ({
    meta: [
      { title: "Profile & Account Settings | MindOrbit" },
      {
        name: "description",
        content:
          "Manage your identity, account credentials, and data portability.",
      },
    ],
  }),
})

function ProfileIndexPage() {
  const session = authClient.useSession()
  const user = session.data?.user

  const [name, setName] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)
  const [message, setMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setDisplayName(user.name.toLowerCase().replace(/\s+/g, "_"))
    }
  }, [user])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      const { error } = await authClient.updateUser({ name })
      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to update profile",
        })
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" })
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsExporting(false)
  }

  const handleDeactivate = () => {
    alert("Account deactivated (demo only)")
  }

  const handleDelete = async () => {
    // Immediate redirect for logout/delete feel
    window.location.href = "/sign-in"
    await authClient.signOut()
  }

  if (session.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Section */}
      <form onSubmit={handleUpdate}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage how others see you on MindOrbit.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <Button type="button" variant="outline" size="sm">
                  Upload New
                </Button>
                <p className="text-muted-foreground text-xs">
                  JPG, GIF or PNG. Max size 2MB.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="full-name"
                  className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
                >
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="display-name"
                  className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
                >
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="arivera_dev"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="prof-title"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                Professional Title
              </Label>
              <Input
                id="prof-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Product Designer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="bio"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Passionate about building intuitive user interfaces..."
                className="min-h-24 resize-none"
              />
            </div>

            {message && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {message.text}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={isUpdating || name === user.name}>
              {isUpdating ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Account Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account credentials and workspace data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
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

          <Separator />

          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Export Workspace Data</span>
              <span className="text-muted-foreground text-sm">
                Download a complete archive of your chats, projects, and task
                history.
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

      {/* Danger Zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive text-xs font-bold tracking-widest uppercase">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/70">
            Irreversible actions regarding your account and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-0 pt-0">
          <div className="flex items-start justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Deactivate Account</span>
              <span className="text-muted-foreground text-sm">
                Temporarily disable your account.
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
                    Your account will be temporarily disabled.
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

          <div className="flex items-start justify-between gap-4 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Delete Account</span>
              <span className="text-muted-foreground text-sm">
                Permanently delete your account and all data.
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
                    This action is permanent and cannot be undone.
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

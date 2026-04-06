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
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"
import { Input } from "@mindorbit/ui/components/input"
import { Label } from "@mindorbit/ui/components/label"
import { Skeleton } from "@mindorbit/ui/components/skeleton"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_dashboard/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  const session = authClient.useSession()
  const user = session.data?.user

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [message, setMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // Sync internal state with session data
  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      const { error } = await authClient.updateUser({
        name,
        // email update usually requires verification, better-auth handles it
      })

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to update profile",
        })
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsUpdating(false)
    }
  }

  if (session.isPending) {
    return (
      <div className="mx-auto flex max-w-4xl flex-1 flex-col gap-6 p-4 lg:p-8">
        <Skeleton className="h-10 w-[200px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="mt-2 h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground text-lg">
          Please sign in to view your profile.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col gap-6 p-4 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          User Profile
        </h1>
        <p className="text-slate-500">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="border-b bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md dark:border-slate-950">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-2xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-base">
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold tracking-wide text-slate-500 uppercase"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold tracking-wide text-slate-500 uppercase"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    placeholder="Email address (cannot be changed here)"
                    className="h-11 cursor-not-allowed bg-slate-50 opacity-70 dark:bg-slate-900"
                  />
                  <p className="mt-1 text-[10px] text-slate-400 italic">
                    Email changes currently requires account support.
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`animate-in fade-in slide-in-from-top-2 rounded-lg border p-4 text-sm ${
                    message.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isUpdating || name === user.name}
                  className="h-11 rounded-lg bg-indigo-600 px-8 font-medium text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
                >
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Details Card (Read-only) */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Account Details</CardTitle>
            <CardDescription>
              System information about your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b py-2 dark:border-slate-800">
              <span className="text-sm text-slate-500">Account ID</span>
              <span className="font-mono text-sm text-slate-900 dark:text-slate-100">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between border-b py-2 dark:border-slate-800">
              <span className="text-sm text-slate-500">Email Verified</span>
              <span
                className={`text-sm font-medium ${user.emailVerified ? "text-emerald-600" : "text-amber-600"}`}
              >
                {user.emailVerified ? "Verified" : "Pending Verification"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

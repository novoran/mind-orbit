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
})

function ProfileIndexPage() {
  const session = authClient.useSession()
  const user = session.data?.user

  const [name, setName] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [message, setMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      // Display name defaults to the part before @ in email if not set
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

  if (session.isPending) {
    return (
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
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </CardContent>
      </Card>
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
    <form onSubmit={handleUpdate}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage how others see you on MindOrbit.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Avatar Section */}
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

          {/* Name Fields */}
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

          {/* Professional Title */}
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

          {/* Bio */}
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
              placeholder="Passionate about building intuitive user interfaces and exploring the intersection of AI and productivity tools."
              className="min-h-24 resize-none"
            />
          </div>

          {/* Feedback Message */}
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
  )
}

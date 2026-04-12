import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { api } from "@mindorbit/backend/_generated/api"
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
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { gooeyToast } from "goey-toast"
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
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const generateUploadUrl = useConvexMutation(api.users.generateUploadUrl)
  const updateImageMutation = useConvexMutation(api.users.updateImage)
  const updateSettingsMutation = useConvexMutation(api.settings.update)

  const session = authClient.useSession()
  const userSession = session.data?.user

  const { data: userData, isPending: isConvexLoading } = useQuery(
    convexQuery(api.users.currentUser, {})
  )

  const isLoading = session.isPending || isConvexLoading

  const [name, setName] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [tagline, setTagline] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  React.useEffect(() => {
    if (userSession) {
      setName(userSession.name || "")
      setDisplayName(userSession.name.toLowerCase().replace(/\s+/g, "_") || "")
    }

    if (userData?.settings) {
      setTagline(userData.settings.tagline || "")
      setBio(userData.settings.bio || "")
    }
  }, [userSession, userData])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    const updatePromise = (async () => {
      // Update basic info via better-auth
      const { error } = await authClient.updateUser({ name })
      if (error) throw new Error(error.message || "Failed to update profile")

      // Update custom fields via Convex
      await updateSettingsMutation({
        bio,
        tagline,
      })
    })()

    gooeyToast.promise(updatePromise, {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: (err: unknown) =>
        (err as { message: string }).message || "Failed to update profile",
    })

    try {
      await updatePromise
    } catch {
      // Error handled by toast
    } finally {
      setIsUpdating(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const uploadPromise = (async () => {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl()

      // 2. Upload to Convex storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })

      const { storageId } = await result.json()

      // 3. Update user image and also tell Better Auth
      const imageUrl = await updateImageMutation({ storageId })
      await authClient.updateUser({ image: imageUrl })

      return imageUrl
    })()

    gooeyToast.promise(uploadPromise, {
      loading: "Uploading image...",
      success: "Profile image updated!",
      error: "Failed to upload image",
    })

    try {
      await uploadPromise
    } catch {
      // Error handled by toast
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDeactivate = () => {
    alert("Account deactivated (demo only)")
  }

  const handleDelete = async () => {
    // Immediate redirect for logout/delete feel
    window.location.href = "/sign-in"
    await authClient.signOut()
  }

  if (isLoading && !userSession) {
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

  if (!userSession) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold">User Not Authenticated</h2>
        <p className="text-muted-foreground mt-2">
          Please sign in to view your profile settings.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => (window.location.href = "/sign-in")}
        >
          Back to Sign In
        </Button>
      </div>
    )
  }

  const user = {
    ...userSession,
    settings: userData?.settings || null,
  }

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
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload New"}
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
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
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
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-4">
            <Button
              type="submit"
              disabled={
                isUpdating ||
                (name === user.name &&
                  tagline === (user.settings?.tagline ?? "") &&
                  bio === (user.settings?.bio ?? ""))
              }
            >
              {isUpdating ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </Card>
      </form>

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

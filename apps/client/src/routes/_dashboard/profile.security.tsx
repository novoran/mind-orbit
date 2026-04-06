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
import { Switch } from "@mindorbit/ui/components/switch"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

import { SecurityIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export const Route = createFileRoute("/_dashboard/profile/security")({
  component: SecurityPage,
  head: () => ({
    meta: [
      { title: "Security Settings | MindOrbit" },
      {
        name: "description",
        content: "Manage your account security and active sessions.",
      },
    ],
  }),
})

function SecurityPage() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [twoFAEnabled, setTwoFAEnabled] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [message, setMessage] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." })
      return
    }
    setIsUpdating(true)
    setMessage(null)
    await new Promise((r) => setTimeout(r, 1000))
    setMessage({ type: "success", text: "Password updated successfully!" })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Change Password */}
      <form onSubmit={handlePasswordUpdate}>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay
              secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="current-password"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="new-password"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="confirm-password"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
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
          <CardFooter className="border-t pt-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          <div className="flex items-start justify-between gap-4 py-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-md border">
                <HugeiconsIcon
                  icon={SecurityIcon}
                  size={16}
                  strokeWidth={2}
                  className="text-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Enable 2FA</span>
                <span className="text-muted-foreground text-sm">
                  Using an authenticator app like Google Authenticator or
                  1Password provides a high level of security by requiring a
                  unique code generated on your mobile device at login.
                </span>
              </div>
            </div>
            <Switch
              checked={twoFAEnabled}
              onCheckedChange={setTwoFAEnabled}
              className="shrink-0"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

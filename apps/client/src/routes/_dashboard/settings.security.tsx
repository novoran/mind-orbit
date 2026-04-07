import {
  GlobalIcon,
  SecurityCheckIcon,
  ShieldKeyIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import { Input } from "@mindorbit/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mindorbit/ui/components/select"
import { Switch } from "@mindorbit/ui/components/switch"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/settings/security")({
  component: SettingsSecurityPage,
})

function SettingsSecurityPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Authentication */}
      <div className="border-border/50 bg-background flex flex-col rounded-xl border p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <HugeiconsIcon icon={ShieldKeyIcon} size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Authentication</h2>
            <p className="text-muted-foreground text-sm">
              Manage how team members access your u0045.
            </p>
          </div>
        </div>

        <div className="bg-muted/30 mb-4 flex flex-col justify-between gap-4 rounded-lg p-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">
              Enforce Two-Factor Authentication
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Require all u0045 members to use 2FA for an additional layer of
              security.
            </p>
          </div>
          <Switch />
        </div>

        <div className="bg-muted/30 flex flex-col justify-between gap-4 rounded-lg p-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Single Sign-On (SSO)</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Configure SAML 2.0 or Okta for enterprise-grade authentication.
            </p>
          </div>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Configure SSO
          </Button>
        </div>
      </div>

      {/* Session Management */}
      <div className="border-border/50 bg-background flex flex-col rounded-xl border p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <HugeiconsIcon icon={Time02Icon} size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Session Management
            </h2>
            <p className="text-muted-foreground text-sm">
              Control active user sessions and idle timeouts.
            </p>
          </div>
        </div>

        <div className="border-border/50 mb-6 flex flex-col justify-between gap-4 border-b pt-2 pb-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Session Timeout</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Automatically sign users out after a period of inactivity.
            </p>
          </div>
          <Select defaultValue="24-hours">
            <SelectTrigger className="bg-muted/30 w-40 sm:w-48">
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-hour">1 hour</SelectItem>
              <SelectItem value="12-hours">12 hours</SelectItem>
              <SelectItem value="24-hours">24 hours</SelectItem>
              <SelectItem value="7-days">7 days</SelectItem>
              <SelectItem value="30-days">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Force Sign-out</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Immediately terminate all active sessions for all members.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20"
          >
            Sign out all active sessions
          </Button>
        </div>
      </div>

      {/* Allowed Domains */}
      <div className="border-border/50 bg-background flex flex-col rounded-xl border p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            <HugeiconsIcon icon={GlobalIcon} size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Allowed Domains
            </h2>
            <p className="text-muted-foreground text-sm">
              Restrict u0045 invitations to specific email domains.
            </p>
          </div>
        </div>

        <div className="relative mb-2">
          <HugeiconsIcon
            icon={GlobalIcon}
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            className="bg-muted/30 pl-9"
            placeholder="e.g. @company.com, @subsidiary.org"
          />
        </div>
        <p className="text-muted-foreground text-[11px]">
          Separate multiple domains with commas. Only users with these email
          domains can join the u0045 via invites or links.
        </p>
      </div>

      {/* Data Protection */}
      <div className="border-border/50 bg-background flex flex-col rounded-xl border p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <HugeiconsIcon icon={SecurityCheckIcon} size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Data Protection
            </h2>
            <p className="text-muted-foreground text-sm">
              Configure data retention policies and encryption settings.
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Activity Log Retention</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Specify how long security logs and activity audits are stored.
            </p>
          </div>
          <Select defaultValue="90-days">
            <SelectTrigger className="bg-muted/30 w-40">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30-days">30 days</SelectItem>
              <SelectItem value="90-days">90 days</SelectItem>
              <SelectItem value="1-year">1 year</SelectItem>
              <SelectItem value="indefinite">Indefinite (Pro)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/30 flex flex-col justify-between gap-4 rounded-lg p-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Export Encryption</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Automatically encrypt all data exports with a secure u0045 key.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  )
}

import { Image01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import { Input } from "@mindorbit/ui/components/input"
import { Label } from "@mindorbit/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mindorbit/ui/components/select"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/settings/")({
  component: SettingsGeneralPage,
})

function SettingsGeneralPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* orbit Identity */}
      <div className="border-border/50 bg-background flex flex-col gap-6 rounded-xl border p-6">
        <div>
          <h2 className="text-lg font-semibold">Orbit Identity</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="orbit-name">Orbit Name</Label>
            <Input id="orbit-name" defaultValue="Global Team" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="orbit-url">Orbit URL</Label>
            <div className="flex">
              <div className="bg-muted text-muted-foreground flex items-center justify-center rounded-l-md border border-r-0 px-3 text-sm">
                mindorbit.com/
              </div>
              <Input
                id="orbit-url"
                defaultValue="global-team-id"
                className="rounded-l-none"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              This is your orbit's unique URL for inviting members.
            </p>
          </div>
        </div>
      </div>

      {/* Orbit Logo */}
      <div className="border-border/50 bg-background flex flex-col gap-6 rounded-xl border p-6">
        <div>
          <h2 className="text-lg font-semibold">Orbit Logo</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="border-border/50 bg-muted/50 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed">
            <HugeiconsIcon
              icon={Image01Icon}
              size={32}
              className="text-muted-foreground opacity-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline">Upload New</Button>
            <p className="text-muted-foreground text-sm">
              Square images (SVG, PNG, or JPG) work best.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="border-border/50 bg-background flex flex-col gap-6 rounded-xl border p-6">
        <div>
          <h2 className="text-lg font-semibold">Privacy Settings</h2>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="visibility">Orbit Visibility</Label>
          <Select defaultValue="private">
            <SelectTrigger id="visibility">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">
                Private (By invitation only)
              </SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold">Note:</span> Private
            orbits are only visible to the members invited by an administrator.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

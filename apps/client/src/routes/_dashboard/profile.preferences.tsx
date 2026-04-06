import {
  AiChat02Icon,
  Calendar02Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui/components/card"
import { Label } from "@mindorbit/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mindorbit/ui/components/select"
import { Switch } from "@mindorbit/ui/components/switch"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"

export const Route = createFileRoute("/_dashboard/profile/preferences")({
  component: PreferencesPage,
  head: () => ({
    meta: [
      { title: "Preferences | MindOrbit" },
      {
        name: "description",
        content:
          "Manage your application appearance, language, and default behaviors.",
      },
    ],
  }),
})

function PreferencesPage() {
  // Language & Region
  const [language, setLanguage] = React.useState("en-US")
  const [timezone, setTimezone] = React.useState("Asia/Dhaka")

  // Date & Time
  const [dateFormat, setDateFormat] = React.useState("MM/DD/YYYY")
  const [timeFormat, setTimeFormat] = React.useState("12h")
  const [weekStart, setWeekStart] = React.useState("monday")

  const [aiSummaries, setAiSummaries] = React.useState(true)

  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDiscard = () => {
    setLanguage("en-US")
    setTimezone("Asia/Dhaka")
    setDateFormat("MM/DD/YYYY")
    setTimeFormat("12h")
    setWeekStart("monday")
    setAiSummaries(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Language & Region */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex size-7 items-center justify-center rounded-md border">
              <HugeiconsIcon
                icon={Globe02Icon}
                size={14}
                strokeWidth={2}
                className="text-primary"
              />
            </div>
            <div>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription className="mt-0.5">
                Set your preferred language and localized time settings.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="language"
              className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
            >
              Primary Language
            </Label>
            <Select
              value={language}
              disabled
              onValueChange={(v) => v && setLanguage(v)}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="bn">Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="timezone"
              className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
            >
              Timezone
            </Label>
            <Select value={timezone} onValueChange={(v) => v && setTimezone(v)}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-44">
                <SelectItem value="America/New_York">
                  New York, USA (GMT-5)
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Los Angeles, USA (GMT-8)
                </SelectItem>
                <SelectItem value="Europe/London">
                  London, UK (GMT+0)
                </SelectItem>
                <SelectItem value="Europe/Paris">
                  Paris, France (GMT+1)
                </SelectItem>
                <SelectItem value="Asia/Dubai">Dubai, UAE (GMT+4)</SelectItem>
                <SelectItem value="Asia/Dhaka">Dhaka, BD (GMT+6)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo, Japan (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex size-7 items-center justify-center rounded-md border">
              <HugeiconsIcon
                icon={Calendar02Icon}
                size={14}
                strokeWidth={2}
                className="text-primary"
              />
            </div>
            <div>
              <CardTitle>Date & Time Format</CardTitle>
              <CardDescription className="mt-0.5">
                Choose how dates and times are displayed throughout the app.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="date-format"
              className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
            >
              Date Format
            </Label>
            <Select
              value={dateFormat}
              onValueChange={(v) => v && setDateFormat(v)}
            >
              <SelectTrigger id="date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="time-format"
              className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
            >
              Time Format
            </Label>
            <Select
              value={timeFormat}
              onValueChange={(v) => v && setTimeFormat(v)}
            >
              <SelectTrigger id="time-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="week-start"
              className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
            >
              Week Starts On
            </Label>
            <Select
              value={weekStart}
              onValueChange={(v) => v && setWeekStart(v)}
            >
              <SelectTrigger id="week-start">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex size-7 items-center justify-center rounded-md border">
              <HugeiconsIcon
                icon={AiChat02Icon}
                size={14}
                strokeWidth={2}
                className="text-primary"
              />
            </div>
            <div>
              <CardTitle>AI Preferences</CardTitle>
              <CardDescription className="mt-0.5">
                Control how AI features assist you across the workspace.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          <PrefRow
            label="Enable AI-powered auto-summaries"
            description="Automatically generate summaries for long project updates and chat threads."
            checked={aiSummaries}
            onCheckedChange={setAiSummaries}
            padded
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div>
            {saved && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                ✓ Preferences saved successfully.
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDiscard}>
              Discard Changes
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function PrefRow({
  label,
  description,
  checked,
  onCheckedChange,
  padded,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  padded?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${padded ? "py-4" : ""}`}
    >
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

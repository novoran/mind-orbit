import {
  CreditCardIcon,
  Invoice01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@mindorbit/ui/components/badge"
import { Button } from "@mindorbit/ui/components/button"
import { Input } from "@mindorbit/ui/components/input"
import { Textarea } from "@mindorbit/ui/components/textarea"
import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/(spaces)/settings/billing")({
  component: SettingsBillingPage,
})

function SettingsBillingPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Current Plan */}
      <div className="border-border/50 bg-background flex flex-col justify-between gap-4 rounded-xl border p-6 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-fit shrink-0 rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <HugeiconsIcon icon={StarIcon} size={24} />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight">
                MindOrbit Pro
              </h2>
              <Badge className="bg-green-100 text-[10px] font-semibold text-green-700 uppercase hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                Active
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              $15 / member / month
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-6 sm:mt-0">
          <div className="hidden text-right sm:block">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Next Renewal Date
            </p>
            <p className="text-sm font-medium">Nov 24, 2024</p>
          </div>
          <Button variant="outline" className="w-full shrink-0 sm:w-auto">
            Change Plan
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-border/50 bg-background flex flex-col rounded-xl border p-6">
        <h3 className="text-muted-foreground mb-4 text-[10px] font-semibold tracking-wider uppercase">
          Payment Method
        </h3>
        <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 shrink-0 items-center justify-center rounded border bg-white px-2 py-1 shadow-sm">
              <HugeiconsIcon
                icon={CreditCardIcon}
                size={20}
                className="text-slate-700"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Visa ending in 4242</p>
              <p className="text-muted-foreground text-xs">Expiry 12/26</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Billing Information */}
      <div className="border-border/50 bg-background flex flex-col rounded-xl border p-6">
        <h3 className="text-muted-foreground mb-6 text-[10px] font-semibold tracking-wider uppercase">
          Billing Information
        </h3>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Billing Email
            </label>
            <Input
              defaultValue="finance@globalteam.com"
              className="bg-muted/30 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Billing Address
            </label>
            <Textarea
              defaultValue="123 Innovation Drive, Suite 400&#10;San Francisco, CA 94103&#10;United States"
              className="bg-muted/30 min-h-24 w-full resize-none"
            />
          </div>

          <div className="border-border/50 flex justify-end border-t pt-4">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Save Details
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 flex justify-center">
        <Link
          to="/settings/invoices"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <HugeiconsIcon icon={Invoice01Icon} size={16} />
          View Invoice History
        </Link>
      </div>
    </div>
  )
}

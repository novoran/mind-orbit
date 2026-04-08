import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"

import {
  CreateOrbitContent,
  CreateOrbitDialog,
  CreateOrbitTrigger,
} from "@/components/create-orbit-dialog"

export function SpacePlaceholder() {
  return (
    <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
      <CreateOrbitDialog>
        <div className="bg-background/50 hover:bg-background/80 border-border hover:border-muted-foreground/30 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-6 text-center transition-all">
          <div className="bg-muted text-muted-foreground border-border flex size-12 items-center justify-center rounded-full border">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} size={24} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold tracking-tight">
              Activate Your Orbit
            </h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Unlock team collaboration, projects, and AI tools by joining or
              creating a dedicated Orbit.
            </p>
          </div>
          <CreateOrbitTrigger
            render={
              <Button
                size="sm"
                className="h-8 w-full rounded-lg text-xs font-semibold transition-transform active:scale-[0.98]"
              >
                Create or Join Orbit
              </Button>
            }
          />
        </div>
        <CreateOrbitContent />
      </CreateOrbitDialog>
    </div>
  )
}

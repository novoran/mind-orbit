import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

export function ToolButton({
  active,
  onClick,
  icon,
  tooltip,
  className = "",
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  tooltip: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "group relative flex h-8 w-8 items-center justify-center rounded-lg transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {icon}
    </button>
  )
}

export function NavButton({
  active,
  onClick,
  icon,
  tooltip,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  tooltip: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
    </button>
  )
}

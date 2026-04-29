import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

import { cn } from "@mindorbit/ui/lib/utils"

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          ref={ref}
          type="text"
          className={cn(
            "border-border bg-background w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm",
            "placeholder:text-muted-foreground/60 focus:ring-primary/20 focus:border-primary focus:ring-0 focus:outline-none",
            "transition-all duration-200",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput }

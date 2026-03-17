import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

import { Button } from "@mindorbit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"

export function TeamSwitcher({
  teams,
}: {
  teams: Array<{
    name: string
    logo: React.ReactNode | React.ComponentProps<typeof HugeiconsIcon>["icon"]
    plan: string
    image?: string
  }>
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="lg"
            className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex h-12 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
          >
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              {activeTeam.image ? (
                <img
                  src={activeTeam.image}
                  alt={activeTeam.name}
                  className="size-full object-cover"
                />
              ) : typeof activeTeam.logo === "function" ||
                Array.isArray(activeTeam.logo) ? (
                <HugeiconsIcon
                  icon={activeTeam.logo as never}
                  className="size-4"
                />
              ) : (
                (activeTeam.logo as React.ReactNode)
              )}
            </div>
            <div className="flex-1 text-left text-sm leading-tight font-semibold">
              {activeTeam.name}
            </div>
          </Button>
        }
      />
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Teams
          </DropdownMenuLabel>
          {teams.map((team, index) => (
            <DropdownMenuItem
              key={team.name}
              onClick={() => setActiveTeam(team)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center overflow-hidden rounded-md border">
                {team.image ? (
                  <img
                    src={team.image}
                    alt={team.name}
                    className="size-full object-cover"
                  />
                ) : typeof team.logo === "function" ||
                  Array.isArray(team.logo) ? (
                  <HugeiconsIcon
                    icon={team.logo as never}
                    className="size-3.5 shrink-0"
                  />
                ) : (
                  (team.logo as React.ReactNode)
                )}
              </div>
              {team.name}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <HugeiconsIcon
                icon={PlusSignIcon}
                strokeWidth={2}
                className="size-4"
              />
            </div>
            <div className="text-muted-foreground font-medium">Add team</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

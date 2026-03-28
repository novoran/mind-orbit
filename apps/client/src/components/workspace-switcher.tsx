import { PlusSignIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@mindorbit/ui/components/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

const getPlanBadgeColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "team":
      return "border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20"
    case "pro":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-500 dark:bg-slate-500/20"
  }
}

export function WorkspaceSwitcher({
  teams,
}: {
  teams: Array<{
    name: string
    logo: any
    plan: string
  }>
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer hover:bg-transparent active:bg-transparent aria-expanded:bg-transparent"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground ml-0! flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={activeTeam.logo} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeTeam.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-3.5 w-fit px-1 text-[9px] font-bold tracking-wider uppercase transition-all duration-200 group-data-[collapsible=icon]:hidden",
                      getPlanBadgeColor(activeTeam.plan)
                    )}
                  >
                    {activeTeam.plan}
                  </Badge>
                </div>
                <HugeiconsIcon
                  icon={UnfoldMoreIcon}
                  strokeWidth={2}
                  className="ml-auto size-4"
                />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workspaces
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="cursor-pointer gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <HugeiconsIcon
                      icon={team.logo}
                      className="size-4 shrink-0"
                    />
                  </div>
                  <span className="flex-1 truncate">{team.name}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-3.5 px-1 text-[9px] font-bold tracking-wider uppercase",
                      getPlanBadgeColor(team.plan)
                    )}
                  >
                    {team.plan}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

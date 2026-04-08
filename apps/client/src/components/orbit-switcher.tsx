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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { cn } from "@mindorbit/ui/lib/utils"
import { gooeyToast } from "goey-toast"
import * as React from "react"

import {
  CreateOrbitContent,
  CreateOrbitDialog,
  CreateOrbitTrigger,
} from "@/components/create-orbit-dialog"
import { authClient } from "@/lib/auth-client"

const getPlanBadgeColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "team":
      return "border-primary/20 bg-primary/10 text-primary"
    case "pro":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

export function OrbitSwitcher({
  orbits,
  activeOrbit,
}: {
  orbits: Array<{
    name: string
    logo: string | null
    plan: string
    id: string
    slug: string
  }>
  activeOrbit?: {
    name: string
    logo: string | null
    plan: string
    id: string
    slug: string
  }
}) {
  const { isMobile } = useSidebar()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleSetActive = async (orbitId: string) => {
    try {
      await authClient.organization.setActive({ organizationId: orbitId })
      gooeyToast.success("Orbit switched")
    } catch {
      gooeyToast.error("Failed to switch orbit")
    }
  }

  const orbitData =
    activeOrbit ||
    orbits[0] ||
    ({
      name: "No Orbit",
      logo: null,
      plan: "Free",
      id: "none",
      slug: "none",
    } as const)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <CreateOrbitDialog>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="cursor-pointer hover:bg-transparent active:bg-transparent aria-expanded:bg-transparent"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground ml-0! flex aspect-square size-8 items-center justify-center rounded-lg">
                    {orbitData.logo ? (
                      <img
                        src={orbitData.logo}
                        alt={orbitData.name}
                        className="size-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-primary text-primary-foreground flex size-full items-center justify-center rounded-lg font-bold uppercase">
                        {orbitData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-sidebar-foreground grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold uppercase">
                      {orbitData.name || "Select Orbit"}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-3.5 w-fit px-1 text-[9px] font-bold tracking-wider uppercase transition-all duration-200 group-data-[collapsible=icon]:hidden",
                        getPlanBadgeColor(orbitData.plan)
                      )}
                    >
                      {orbitData.plan || "free"}
                    </Badge>
                  </div>
                  <HugeiconsIcon
                    icon={UnfoldMoreIcon}
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
                  Orbits
                </DropdownMenuLabel>
                {orbits.map((orbit) => (
                  <DropdownMenuItem
                    key={orbit.id}
                    onSelect={() => handleSetActive(orbit.id)}
                    className="cursor-pointer gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {orbit.logo ? (
                        <img
                          src={orbit.logo}
                          alt={orbit.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold uppercase">
                          {orbit.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="flex-1 truncate">{orbit.name}</span>
                    <DropdownMenuShortcut>
                      {activeOrbit?.id === orbit.id && "active"}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <CreateOrbitTrigger
                render={
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 p-2"
                    onSelect={() => setIsMenuOpen(false)}
                  >
                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                      <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      Add Orbit
                    </div>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateOrbitContent />
        </CreateOrbitDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

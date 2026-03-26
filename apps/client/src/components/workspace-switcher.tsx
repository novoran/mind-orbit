import { PlusSignIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

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

export function WorkspaceSwitcher({
  workspaces,
}: {
  workspaces: Array<{
    name: string
    logo: React.ReactNode | React.ComponentProps<typeof HugeiconsIcon>["icon"]
    plan: string
    image?: string
  }>
}) {
  const { isMobile } = useSidebar()
  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0])

  const LogoDisplay = ({
    workspace,
  }: {
    workspace: (typeof workspaces)[0]
  }) => (
    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
      {workspace.image ? (
        <img
          src={workspace.image}
          alt={workspace.name}
          className="size-full object-cover"
        />
      ) : typeof workspace.logo === "function" ||
        Array.isArray(workspace.logo) ? (
        <HugeiconsIcon
          icon={
            workspace.logo as React.ComponentProps<typeof HugeiconsIcon>["icon"]
          }
          className="size-3.5"
        />
      ) : (
        (workspace.logo as React.ReactNode)
      )}
    </div>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* Base UI: render prop merges trigger behavior onto SidebarMenuButton */}
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:text-sidebar-accent-foreground cursor-pointer hover:bg-transparent active:bg-transparent aria-expanded:bg-transparent data-[state=open]:bg-transparent"
              >
                <LogoDisplay workspace={activeWorkspace} />
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">
                    {activeWorkspace.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeWorkspace.plan}
                  </span>
                </div>
                <HugeiconsIcon
                  icon={UnfoldMoreIcon}
                  strokeWidth={2}
                  size={16}
                  className="ml-auto group-data-[collapsible=icon]:hidden"
                />
              </SidebarMenuButton>
            }
          />

          {/* min-w-56 ensures readable width even when trigger is icon-only */}
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workspaces
              </DropdownMenuLabel>
              {workspaces.map((workspace, index) => (
                <DropdownMenuItem
                  key={workspace.name}
                  onClick={() => setActiveWorkspace(workspace)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center overflow-hidden rounded-md border">
                    {workspace.image ? (
                      <img
                        src={workspace.image}
                        alt={workspace.name}
                        className="size-full object-cover"
                      />
                    ) : typeof workspace.logo === "function" ||
                      Array.isArray(workspace.logo) ? (
                      <HugeiconsIcon
                        icon={
                          workspace.logo as React.ComponentProps<
                            typeof HugeiconsIcon
                          >["icon"]
                        }
                        className="size-3.5 shrink-0"
                      />
                    ) : (
                      (workspace.logo as React.ReactNode)
                    )}
                  </div>
                  {workspace.name}
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
                <div className="text-muted-foreground font-medium">
                  Add workspace
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

import {
  ArrowRightIcon,
  Delete02Icon,
  FolderIcon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { Link } from "@tanstack/react-router"

export function NavProjects({
  projects,
}: {
  projects: Array<{
    title: string
    url: string
    icon: any
  }>
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              render={<Link to={item.url} />}
            >
              <HugeiconsIcon icon={item.icon} strokeWidth={2} />
              <span>{item.title}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                  />
                }
              >
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  strokeWidth={2}
                />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={FolderIcon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={ArrowRightIcon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <HugeiconsIcon
              icon={MoreHorizontalCircle01Icon}
              strokeWidth={2}
              className="text-sidebar-foreground/70"
            />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

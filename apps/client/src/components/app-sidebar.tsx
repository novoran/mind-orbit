import {
  AiChat02Icon,
  Analytics01Icon,
  Briefcase02Icon,
  Chatting01Icon,
  DashboardCircleIcon,
  Flag01Icon,
  Folder01Icon,
  Idea01Icon,
  Logout01Icon,
  MagicWand01Icon,
  QuestionIcon,
  Settings02Icon,
  Task01Icon,
  UserGroupIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@mindorbit/ui/components/sidebar"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { authClient } from "@/lib/auth-client"

interface NavItem {
  title: string
  url: string
  icon: any
  isActive?: boolean
  requiredRole?: Array<string>
}

export const data: {
  mainNav: Array<NavItem>
  spaceNav: Array<NavItem>
} = {
  mainNav: [
    {
      title: "Dashboard",
      url: "/",
      icon: DashboardCircleIcon,
      isActive: true,
    },
    /* {
      title: "AI Chat",
      url: "/ai-chat",
      icon: AiChat02Icon,
    }, */
    {
      title: "Idea Hub",
      url: "/idea-hub",
      icon: Idea01Icon,
    },
  ],
  spaceNav: [
    {
      title: "Team Chat",
      url: "/team-chat",
      icon: Chatting01Icon,
    },
    {
      title: "Meeting",
      url: "/meeting",
      icon: Video01Icon,
    },
    {
      title: "Teams",
      url: "/teams",
      icon: UserGroupIcon,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Briefcase02Icon,
    },
    {
      title: "Milestones",
      url: "/milestones",
      icon: Flag01Icon,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: Task01Icon,
    },
    {
      title: "AI Tools",
      url: "/ai-tools",
      icon: MagicWand01Icon,
    },
    {
      title: "Files",
      url: "/files",
      icon: Folder01Icon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: Analytics01Icon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings02Icon,
      requiredRole: ["admin", "owner"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: orbitsList } = authClient.useListOrganizations()
  const { data: activeOrbitNode } = authClient.useActiveOrganization()
  const { data: activeMember } = authClient.useActiveMember()

  const userRole = activeMember?.role || null

  const orbits = (orbitsList || []).map((org) => {
    let metadata: any = {}
    try {
      metadata =
        typeof org.metadata === "string"
          ? JSON.parse(org.metadata)
          : org.metadata || {}
    } catch {
      metadata = {}
    }

    return {
      name: org.name,
      logo: org.logo || null,
      plan: (metadata.plan as string) || "Free",
      id: org.id,
      slug: org.slug,
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <OrbitSwitcher
          orbits={orbits}
          activeOrbit={(() => {
            if (!activeOrbitNode) return orbits[0]
            let metadata: any = {}
            try {
              metadata =
                typeof activeOrbitNode.metadata === "string"
                  ? JSON.parse(activeOrbitNode.metadata)
                  : activeOrbitNode.metadata || {}
            } catch {
              metadata = {}
            }
            return {
              name: activeOrbitNode.name,
              logo: activeOrbitNode.logo || null,
              plan: (metadata.plan as string) || "Free",
              id: activeOrbitNode.id,
              slug: activeOrbitNode.slug,
            }
          })()}
        /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <NavMain items={data.mainNav} label="Main" />
          {/* <NavMain
            label="Spaces"
            items={
              activeOrbitNode
                ? data.spaceNav.filter((item) => {
                    if (!item.requiredRole) return true
                    return item.requiredRole.includes(userRole || "")
                  })
                : []
            }
            placeholder={<SpacePlaceholder />}
          /> */}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* <Banner /> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Support"
              className="cursor-pointer transition-colors"
            >
              <HugeiconsIcon
                icon={QuestionIcon}
                strokeWidth={2}
                size={18}
                className="shrink-0"
              />
              <span className="text-sm font-normal group-data-[collapsible=icon]:hidden">
                Support
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                window.location.href = "/sign-in"
                await authClient.signOut()
              }}
              tooltip="Logout"
              className="group/logout bg-destructive hover:bg-destructive/90 cursor-pointer text-white transition-all duration-250 hover:text-white!"
            >
              <HugeiconsIcon
                icon={Logout01Icon}
                strokeWidth={2}
                size={18}
                className="group-hover/logout:text-destructive-foreground! shrink-0"
              />
              <span className="text-sm font-normal group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

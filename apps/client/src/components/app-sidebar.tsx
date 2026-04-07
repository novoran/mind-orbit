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

import { Banner } from "@/components/banner"
import { NavMain } from "@/components/nav-main"
import { OrbitSwitcher } from "@/components/orbit-switcher"
import { authClient } from "@/lib/auth-client"

export const data = {
  mainNav: [
    {
      title: "Dashboard",
      url: "/",
      icon: DashboardCircleIcon,
      isActive: true,
    },
    {
      title: "AI Chat",
      url: "/ai-chat",
      icon: AiChat02Icon,
    },
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
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: orbitsList } = authClient.useListOrganizations()
  const { data: activeOrbitNode } = authClient.useActiveOrganization()

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
        <OrbitSwitcher
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
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <NavMain items={data.mainNav} label="Main" />
          <NavMain items={data.spaceNav} label="Spaces" />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Banner />
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
              className="group/logout cursor-pointer bg-red-600 text-white transition-all duration-250 hover:bg-red-700 hover:text-white!"
            >
              <HugeiconsIcon
                icon={Logout01Icon}
                strokeWidth={2}
                size={18}
                className="shrink-0 group-hover/logout:text-white!"
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

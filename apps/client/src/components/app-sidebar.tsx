import {
  Analytics01Icon,
  Briefcase02Icon,
  Chatting01Icon,
  DashboardCircleIcon,
  DashboardSquare02Icon,
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
  SidebarSeparator,
} from "@mindorbit/ui/components/sidebar"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavPro } from "@/components/nav-pro"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"

export const teamsData = [
  {
    name: "Acme Inc",
    logo: DashboardSquare02Icon,
    plan: "Pro",
  },
  {
    name: "Acme Corp.",
    logo: DashboardCircleIcon,
    plan: "Team",
  },
  {
    name: "Evil Corp.",
    logo: DashboardSquare02Icon,
    plan: "Free",
  },
]

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      icon: Chatting01Icon,
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <WorkspaceSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <NavMain items={data.mainNav} label="Main" />
          <SidebarSeparator className="my-2" />
          <NavMain items={data.spaceNav} label="Spaces" />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavPro />
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

import {
  Analytics01Icon,
  Briefcase02Icon,
  Chatting01Icon,
  DashboardCircleIcon,
  Flag01Icon,
  Folder01Icon,
  Idea01Icon,
  Key01Icon,
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@mindorbit/ui/components/sidebar"
import { Link } from "@tanstack/react-router"
import * as React from "react"
import { WorkspaceSwitcher } from "./workspace-switcher"

const teamsData = [
  {
    name: "MindOrbit Hub",
    logo: (
      <div className="bg-primary flex size-full items-center justify-center font-bold text-white">
        M
      </div>
    ),
    plan: "Pro",
    image: "https://avatar.vercel.sh/mindorbit.png",
  },
  {
    name: "Team Galaxy",
    logo: DashboardCircleIcon,
    plan: "Free",
  },
]

const data = {
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
      title: "AI / Tools",
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
    <Sidebar collapsible="icon" {...props} className="border-r">
      <SidebarHeader className="flex h-16 justify-center border-b group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <WorkspaceSwitcher workspaces={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-slate-400 uppercase group-data-[collapsible=icon]:hidden">
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link to={item.url} />}
                  isActive={item.isActive}
                  className="data-active:bg-primary/5 data-active:text-primary cursor-pointer transition-colors"
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    strokeWidth={2}
                    size={18}
                    className="shrink-0"
                  />
                  <span className="text-sm font-normal group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-slate-400 uppercase group-data-[collapsible=icon]:hidden">
            Team
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.spaceNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link to={item.url} />}
                  className="cursor-pointer transition-colors"
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    strokeWidth={2}
                    size={18}
                    className="shrink-0"
                  />
                  <span className="text-sm font-normal group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4 p-4 group-data-[collapsible=icon]:p-2">
        <div className="bg-primary/5 border-primary/10 relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4 group-data-[collapsible=icon]:hidden">
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex size-5 items-center justify-center rounded-md">
                <HugeiconsIcon
                  icon={Key01Icon}
                  className="text-primary size-3"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Unlock Pro
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Get unlimited AI credits and advanced tools.
            </p>
          </div>
          <button className="bg-primary hover:bg-primary/90 w-full cursor-pointer rounded-lg py-1.5 text-xs font-bold text-white transition-all hover:scale-[1.02]">
            Upgrade Now
          </button>
        </div>

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
              className="group cursor-pointer bg-red-600 text-white transition-colors hover:bg-red-700"
            >
              <HugeiconsIcon
                icon={Logout01Icon}
                strokeWidth={2}
                size={18}
                className="shrink-0"
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

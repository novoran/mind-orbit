import { createFileRoute } from "@tanstack/react-router"
import {
  Add01Icon,
  Home01Icon,
  MoreVerticalIcon,
  SearchIcon,
  Settings01Icon,
  Task01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatedThemeToggler } from "@mindorbit/ui/components/animated-theme-toggler"
import { Button } from "@mindorbit/ui/components/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@mindorbit/ui/components/sidebar"

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home01Icon,
    },
    {
      title: "Tasks",
      url: "#",
      icon: Task01Icon,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings01Icon,
    },
    {
      title: "Users",
      url: "#",
      icon: UserIcon,
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-sidebar-border flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2 px-1 py-2">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">MindOrbit</span>
              <span className="text-muted-foreground truncate text-xs">
                Operational Hub
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      tooltip={item.title}
                    >
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-sidebar-border border-t p-2">
          <div className="flex items-center gap-2 px-1 py-2 group-data-[collapsible=icon]:hidden">
            <div className="bg-muted flex size-8 items-center justify-center overflow-hidden rounded-full">
              <HugeiconsIcon icon={UserIcon} className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">User Name</span>
              <span className="text-muted-foreground truncate text-xs">
                user@example.com
              </span>
            </div>
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              className="text-muted-foreground size-4"
            />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
            <div className="bg-muted/50 focus-within:ring-ring flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all focus-within:ring-1">
              <HugeiconsIcon
                icon={SearchIcon}
                className="text-muted-foreground size-4"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-32 border-none bg-transparent text-sm outline-none md:w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedThemeToggler />
            <Button size="sm">New Task</Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="border-border/50 bg-muted/50 flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border p-6">
              <HugeiconsIcon
                icon={Task01Icon}
                className="text-primary size-8"
              />
              <span className="font-medium">Active Tasks</span>
              <span className="text-2xl font-bold">12</span>
            </div>
            <div className="border-border/50 bg-muted/50 flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border p-6">
              <HugeiconsIcon
                icon={UserIcon}
                className="text-secondary size-8"
              />
              <span className="font-medium">Active Users</span>
              <span className="text-2xl font-bold">5</span>
            </div>
            <div className="border-border/50 bg-muted/50 flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border p-6">
              <HugeiconsIcon icon={Home01Icon} className="text-accent size-8" />
              <span className="font-medium">Workspaces</span>
              <span className="text-2xl font-bold">3</span>
            </div>
          </div>
          <div className="border-border/50 bg-muted/50 flex min-h-screen flex-1 flex-col rounded-xl border p-6 md:min-h-min">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="hover:bg-muted flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors"
                >
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={Task01Icon} className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Task "{i}" was updated
                    </p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

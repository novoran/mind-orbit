import { SidebarInset, SidebarProvider } from "@mindorbit/ui/components/sidebar"
import {
  Outlet,
  createFileRoute,
  redirect,
  useMatches,
} from "@tanstack/react-router"

import { cn } from "@mindorbit/ui/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

function DashboardLayout() {
  const { sidebarOpen } = Route.useLoaderData()
  const matches = useMatches()

  // Idea workspace gets a full-screen layout (no sidebar/header)
  // We check if the current active route is the workspace route
  const isWorkspace = matches.some((m) => m.id.includes("$ideaId"))

  return (
    <SidebarProvider defaultOpen={sidebarOpen} open={!isWorkspace}>
      {!isWorkspace && <AppSidebar />}
      <SidebarInset>
        {!isWorkspace && <Header />}
        <div className={cn("flex h-full flex-col", !isWorkspace && "p-4")}>
          <div
            key={isWorkspace ? "workspace" : "dashboard"}
            className={cn(
              "h-full flex-1",
              !isWorkspace && "animate-fade-in-up"
            )}
          >
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
      })
    }
  },
  loader: () => {
    return { sidebarOpen: true }
  },
  component: DashboardLayout,
})

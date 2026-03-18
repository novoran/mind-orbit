import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"

import {
  SIDEBAR_COOKIE_NAME,
  SidebarInset,
  SidebarProvider,
} from "@mindorbit/ui/components/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export const Route = createFileRoute("/_dashboard")({
  loader: ({ context }: { context: { request?: Request } }) => {
    let cookieHeader = ""
    if (context.request) {
      cookieHeader = context.request.headers.get("cookie") ?? ""
    } else if (typeof document !== "undefined") {
      cookieHeader = document.cookie
    }

    const match = cookieHeader.match(
      new RegExp(`(?:^|;)\\s*${SIDEBAR_COOKIE_NAME}=([^;]*)`)
    )
    const sidebarOpen = match ? match[1] === "true" : true
    return { sidebarOpen }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { sidebarOpen } = Route.useLoaderData()
  const location = useLocation()

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-4">
          <div key={location.pathname} className="animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

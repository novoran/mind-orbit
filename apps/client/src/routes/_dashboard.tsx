import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"

import { SidebarInset, SidebarProvider } from "@mindorbit/ui/components/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export const Route = createFileRoute("/_dashboard")({
  loader: () => {
    return { sidebarOpen: false }
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

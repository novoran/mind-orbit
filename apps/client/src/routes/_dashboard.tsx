import { SidebarInset, SidebarProvider } from "@mindorbit/ui/components/sidebar"
import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from "@tanstack/react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

function DashboardLayout() {
  const { sidebarOpen } = Route.useLoaderData()
  const location = useLocation()

  // Idea workspace gets a full-screen layout (no sidebar/header)
  // so it can function like Miro / Figma
  const isWorkspace = /^\/idea-hub\/.+/.test(location.pathname)

  if (isWorkspace) {
    return <Outlet />
  }

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="h-full p-4">
          <div
            key={location.pathname.split("/")[1]}
            className="animate-fade-in-up h-full"
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

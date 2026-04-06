import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { AuthLayout } from "@/components/auth/auth-layout"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    // Shared auth check
    const session = await authClient.getSession()
    if (session.data) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: AuthLayoutWrapper,
})

function AuthLayoutWrapper() {
  return (
    <AuthLayout title="MindOrbit" subtitle="The universe of your productivity.">
      <Outlet />
    </AuthLayout>
  )
}

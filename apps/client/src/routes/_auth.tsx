import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { AuthLayout } from "@/components/auth/auth-layout"

function AuthLayoutWrapper() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    // We already have authentication status from the root loader/beforeLoad
    // Using context prevents redundant async network calls on every transition
    if (context.isAuthenticated) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: AuthLayoutWrapper,
})

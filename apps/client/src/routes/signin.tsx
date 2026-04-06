import { createFileRoute, redirect } from "@tanstack/react-router"
import { AuthLayout } from "../components/auth/auth-layout"
import { LoginForm } from "../components/auth/login-form"
import { authClient } from "../lib/auth-client"

export const Route = createFileRoute("/signin")({
  beforeLoad: async ({ context }) => {
    // If already logged in, redirect to dashboard
    const session = await authClient.getSession()
    if (session.data) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: SignInComponent,
})

function SignInComponent() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Please enter your details to sign in."
    >
      <LoginForm />
    </AuthLayout>
  )
}

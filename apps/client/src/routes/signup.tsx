import { createFileRoute, redirect } from "@tanstack/react-router"
import { AuthLayout } from "../components/auth/auth-layout"
import { SignUpForm } from "../components/auth/signup-form"
import { authClient } from "../lib/auth-client"

export const Route = createFileRoute("/signup")({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (session.data) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: SignUpComponent,
})

function SignUpComponent() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your journey into a more productive orbit."
    >
      <SignUpForm />
    </AuthLayout>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "../../components/auth/login-form"

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: "Sign In | MindOrbit" },
      {
        name: "description",
        content: "Sign in to your MindOrbit account to continue.",
      },
    ],
  }),
})

function SignInPage() {
  return <LoginForm />
}

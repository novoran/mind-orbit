import { createFileRoute } from "@tanstack/react-router"
import { SignUpForm } from "../../components/auth/signup-form"

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: "Sign Up | MindOrbit" },
      {
        name: "description",
        content: "Sign up for a new MindOrbit account.",
      },
    ],
  }),
})

function SignUpPage() {
  return <SignUpForm />
}

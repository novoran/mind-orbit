import { createFileRoute } from "@tanstack/react-router"
import { SignUpForm } from "../../components/auth/signup-form"

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
})

function SignUpPage() {
  return <SignUpForm />
}

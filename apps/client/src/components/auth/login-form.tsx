import { LockPasswordIcon, Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import googleIcon from "@mindorbit/ui/assets/global/google.svg?url"
import slackIcon from "@mindorbit/ui/assets/global/slack.svg?url"
import {
  AuthPasswordField,
  AuthSocialButton,
  AuthTextField,
} from "@mindorbit/ui/components/auth-components"
import { Button } from "@mindorbit/ui/components/button"
import { Checkbox } from "@mindorbit/ui/components/checkbox"
import { Link } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export function LoginForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      })
      if (res.error) {
        setError(res.error.message || "Invalid email or password")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = (provider: "google" | "slack") => {
    void authClient.signIn.social({ provider, callbackURL: "/" })
  }

  return (
    <div className="space-y-5">
      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3">
        <AuthSocialButton
          iconSrc={googleIcon}
          iconAlt="Google"
          label="Google"
          onClick={() => handleSocial("google")}
        />
        <AuthSocialButton
          iconSrc={slackIcon}
          iconAlt="Slack"
          label="Slack"
          onClick={() => handleSocial("slack")}
        />
      </div>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="grow border-t border-slate-200" />
        <span className="mx-4 shrink text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Or with email
        </span>
        <div className="grow border-t border-slate-200" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-100 ring-inset">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthTextField
          id="login-email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />}
        />

        <AuthPasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />}
          rightSlot={
            <Link
              to="/signin"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </Link>
          }
        />

        <Checkbox
          id="login-remember"
          checked={remember}
          onCheckedChange={setRemember}
          label="Keep me signed in for 30 days"
        />

        <Button
          type="submit"
          className="h-11 w-full bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
          loading={loading}
          loadingText="Signing in…"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}

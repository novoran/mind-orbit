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
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export function LoginForm() {
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const res = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: "/",
        })
        if (res.error) {
          setError(res.error.message || "Invalid email or password")
        }
      } catch {
        setError("An unexpected error occurred. Please try again.")
      }
    },
  })

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
          className="cursor-pointer"
          onClick={() => handleSocial("google")}
        />
        <AuthSocialButton
          iconSrc={slackIcon}
          iconAlt="Slack"
          label="Slack"
          className="cursor-pointer"
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
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="email"
          children={(field) => (
            <AuthTextField
              id={field.name}
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              icon={<HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />}
            />
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <AuthPasswordField
              id={field.name}
              label="Password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              icon={
                <HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />
              }
              rightSlot={
                <Link
                  to="/sign-in"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              }
            />
          )}
        />

        <form.Field
          name="remember"
          children={(field) => (
            <Checkbox
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(!!checked)}
              label="Keep me signed in for 30 days"
            />
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="h-11 w-full cursor-pointer bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
              loading={isSubmitting}
              disabled={!canSubmit}
              loadingText="Signing in…"
            >
              Sign In
            </Button>
          )}
        />
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/sign-up"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}

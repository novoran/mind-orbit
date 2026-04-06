import {
  LockPasswordIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
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
import { cn } from "@mindorbit/ui/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setError("Passwords do not match!")
        return
      }
      setError(null)
      try {
        const res = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
          callbackURL: "/",
        })
        if (res.error) {
          setError(res.error.message || "An error occurred during sign up")
        }
      } catch {
        setError("An unexpected error occurred. Please try again.")
      }
    },
  })

  // Password strength
  const getStrength = (pass: string) => {
    if (!pass) return 0
    let s = 0
    if (pass.length > 8) s += 25
    if (/[A-Z]/.test(pass)) s += 25
    if (/[0-9]/.test(pass)) s += 25
    if (/[^A-Za-z0-9]/.test(pass)) s += 25
    return s
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
          name="name"
          children={(field) => (
            <AuthTextField
              id={field.name}
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              icon={<HugeiconsIcon icon={UserIcon} className="h-4 w-4" />}
            />
          )}
        />

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

        <div className="space-y-1.5">
          <form.Field
            name="password"
            children={(field) => {
              const strength = getStrength(field.state.value)
              return (
                <>
                  <AuthPasswordField
                    id={field.name}
                    label="Password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    icon={
                      <HugeiconsIcon
                        icon={LockPasswordIcon}
                        className="h-4 w-4"
                      />
                    }
                  />
                  {/* Strength Meter - Always rendered for LCP/CLS */}
                  <div className="h-6 space-y-1 pt-1">
                    {field.state.value ? (
                      <>
                        <div className="flex h-1 gap-1">
                          {[25, 50, 75, 100].map((step) => (
                            <div
                              key={step}
                              className={cn(
                                "h-full flex-1 rounded-full transition-all duration-500",
                                strength >= step
                                  ? strength <= 50
                                    ? "bg-orange-500"
                                    : "bg-emerald-500"
                                  : "bg-slate-100"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          {strength <= 25
                            ? "Weak"
                            : strength <= 75
                              ? "Medium"
                              : "Strong"}
                        </p>
                      </>
                    ) : (
                      <div className="h-full w-full" /> // Placeholder
                    )}
                  </div>
                </>
              )
            }}
          />
        </div>

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <AuthPasswordField
              id={field.name}
              label="Confirm Password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              icon={
                <HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />
              }
            />
          )}
        />

        <form.Field
          name="agreed"
          children={(field) => (
            <Checkbox
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(!!checked)}
              required
              label={
                <span className="text-slate-500">
                  I agree to the{" "}
                  <Link
                    to="/sign-up"
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/sign-up"
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              }
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
              loadingText="Creating account…"
            >
              Create Account
            </Button>
          )}
        />
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}

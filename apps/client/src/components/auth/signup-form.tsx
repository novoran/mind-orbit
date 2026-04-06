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
import { Link } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [agreed, setAgreed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      })
      if (res.error) {
        setError(res.error.message || "An error occurred during sign up")
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

  // Password strength
  const getStrength = () => {
    if (!password) return 0
    let s = 0
    if (password.length > 8) s += 25
    if (/[A-Z]/.test(password)) s += 25
    if (/[0-9]/.test(password)) s += 25
    if (/[^A-Za-z0-9]/.test(password)) s += 25
    return s
  }
  const strength = getStrength()

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
          id="signup-name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          icon={<HugeiconsIcon icon={UserIcon} className="h-4 w-4" />}
        />

        <AuthTextField
          id="signup-email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />}
        />

        <div className="space-y-1.5">
          <AuthPasswordField
            id="signup-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />}
          />
          {/* Strength Meter */}
          {password && (
            <div className="space-y-1 pt-1">
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
                {strength <= 25 ? "Weak" : strength <= 75 ? "Medium" : "Strong"}
              </p>
            </div>
          )}
        </div>

        <AuthPasswordField
          id="signup-confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          icon={<HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />}
        />

        <Checkbox
          id="signup-terms"
          checked={agreed}
          onCheckedChange={setAgreed}
          required
          label={
            <span className="text-slate-500">
              I agree to the{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          }
        />

        <Button
          type="submit"
          className="h-11 w-full bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
          loading={loading}
          loadingText="Creating account…"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}

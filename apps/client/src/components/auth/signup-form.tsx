import {
  GoogleIcon,
  LockPasswordIcon,
  Mail01Icon,
  SlackIcon,
  UserIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import { Checkbox } from "@mindorbit/ui/components/checkbox"
import { Input } from "@mindorbit/ui/components/input"
import { Label } from "@mindorbit/ui/components/label"
import { cn } from "@mindorbit/ui/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

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

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create your Orbit account
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Join thousands of teams building the future.
        </p>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-10 w-full cursor-pointer justify-center gap-3 border-transparent bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 active:scale-[0.98]"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/" })
          }
        >
          <HugeiconsIcon icon={GoogleIcon} size={16} />
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          className="h-10 w-full cursor-pointer justify-center gap-3 border-transparent bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 active:scale-[0.98]"
          onClick={() =>
            authClient.signIn.social({ provider: "slack", callbackURL: "/" })
          }
        >
          <HugeiconsIcon icon={SlackIcon} size={16} />
          <span>Slack</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px grow bg-slate-100" />
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          or
        </span>
        <div className="h-px grow bg-slate-100" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 ring-1 ring-red-100 ring-inset">
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
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-sm font-bold text-slate-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                  <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
                </div>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="John Doe"
                  className="h-11 rounded-xl border-transparent bg-slate-50 pl-11 font-medium text-slate-900 shadow-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-600"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                />
              </div>
            </div>
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-sm font-bold text-slate-700"
              >
                Email
              </Label>
              <div className="relative">
                <div className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                  <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />
                </div>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="name@company.com"
                  className="h-11 rounded-xl border-transparent bg-slate-50 pl-11 font-medium text-slate-900 shadow-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-600"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                />
              </div>
            </div>
          )}
        />

        <form.Field
          name="password"
          children={(field) => {
            const strength = getStrength(field.state.value)
            return (
              <div className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-bold text-slate-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                    <HugeiconsIcon
                      icon={LockPasswordIcon}
                      className="h-4 w-4"
                    />
                  </div>
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-transparent bg-slate-50 pr-11 pl-11 font-medium text-slate-900 shadow-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-600"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors outline-none hover:text-slate-600"
                  >
                    <HugeiconsIcon
                      icon={showPassword ? ViewOffIcon : ViewIcon}
                      className="h-4 w-4"
                    />
                  </button>
                </div>
                {field.state.value && (
                  <div className="space-y-1.5 pt-0.5">
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
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {strength <= 25
                        ? "Weak"
                        : strength <= 75
                          ? "Medium"
                          : "Strong"}
                    </p>
                  </div>
                )}
              </div>
            )
          }}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-sm font-bold text-slate-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                  <HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />
                </div>
                <Input
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-transparent bg-slate-50 pr-11 pl-11 font-medium text-slate-900 shadow-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-600"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors outline-none hover:text-slate-600"
                >
                  <HugeiconsIcon
                    icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                    className="h-4 w-4"
                  />
                </button>
              </div>
            </div>
          )}
        />

        <form.Field
          name="agreed"
          children={(field) => (
            <div className="flex items-center space-x-2.5">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
                className="rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                required
              />
              <Label
                htmlFor={field.name}
                className="cursor-pointer text-sm text-slate-500 transition-colors hover:text-slate-700"
              >
                I agree to the{" "}
                <Link
                  to="/sign-up"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/sign-up"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Privacy
                </Link>
              </Label>
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="h-11 w-full cursor-pointer rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] disabled:opacity-50"
              loading={isSubmitting}
              disabled={!canSubmit}
            >
              Create Account
            </Button>
          )}
        />
      </form>

      <div className="text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="font-bold text-indigo-600 underline-offset-4 hover:text-indigo-700 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

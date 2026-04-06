import {
  LockPasswordIcon,
  Mail01Icon,
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
          className="h-10 w-full cursor-pointer justify-center gap-3 border-transparent bg-white font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 active:scale-[0.98]"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/" })
          }
        >
          <GoogleLogo className="h-4 w-4" />
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          className="h-10 w-full cursor-pointer justify-center gap-3 border-transparent bg-white font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 active:scale-[0.98]"
          onClick={() =>
            authClient.signIn.social({ provider: "slack", callbackURL: "/" })
          }
        >
          <SlackLogo className="h-4 w-4" />
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
        <div className="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-600 ring-1 ring-red-100 ring-inset">
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
                className="cursor-pointer text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
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

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="1em" height="1em">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2447.6 2452.5" className={className}>
      <g clipRule="evenodd" fillRule="evenodd">
        <path
          d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
          fill="#36c5f0"
        ></path>
        <path
          d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
          fill="#2eb67d"
        ></path>
        <path
          d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
          fill="#ecb22e"
        ></path>
        <path
          d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
          fill="#e01e5a"
        ></path>
      </g>
    </svg>
  )
}

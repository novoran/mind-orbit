import {
  GoogleIcon,
  LockPasswordIcon,
  Mail01Icon,
  SlackIcon,
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
import { useState } from "react"

import { authClient } from "@/lib/auth-client"
import { semanticColors } from "@/lib/color-system"

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-sm">
          Please login to your account
        </p>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className={cn(
            semanticColors.action.secondary,
            "h-10 w-full cursor-pointer justify-center gap-3 border-transparent font-semibold shadow-sm ring-1 transition-all active:scale-[0.98]"
          )}
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: "/" })
          }
        >
          <HugeiconsIcon icon={GoogleIcon} size={16} />
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          className={cn(
            semanticColors.action.secondary,
            "h-10 w-full cursor-pointer justify-center gap-3 border-transparent font-semibold shadow-sm ring-1 transition-all active:scale-[0.98]"
          )}
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
        <div className="bg-border/50 h-px grow" />
        <span className="text-muted-foreground/60 text-xs font-bold tracking-widest uppercase">
          or
        </span>
        <div className="bg-border/50 h-px grow" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive ring-destructive/20 rounded-xl p-3.5 text-sm font-semibold ring-1 ring-inset">
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
        className="flex flex-col gap-4"
      >
        <form.Field
          name="email"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={field.name}
                className="text-foreground text-sm font-bold"
              >
                Email
              </Label>
              <div className="relative">
                <div className="text-muted-foreground/60 absolute top-1/2 left-3.5 -translate-y-1/2">
                  <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4" />
                </div>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="name@company.com"
                  className="bg-muted text-foreground ring-border placeholder:text-muted-foreground/50 focus-visible:bg-background focus-visible:ring-primary h-11 rounded-xl border-transparent pl-11 shadow-none ring-1 transition-all focus-visible:ring-2"
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
          children={(field) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={field.name}
                  className="text-foreground text-sm font-bold"
                >
                  Password
                </Label>
                <Link
                  to="/sign-in"
                  className="text-primary hover:text-primary/90 text-xs font-bold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="text-muted-foreground/60 absolute top-1/2 left-3.5 -translate-y-1/2">
                  <HugeiconsIcon icon={LockPasswordIcon} className="h-4 w-4" />
                </div>
                <Input
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-muted text-foreground ring-border placeholder:text-muted-foreground/50 focus-visible:bg-background focus-visible:ring-primary h-11 rounded-xl border-transparent pr-11 pl-11 shadow-none ring-1 transition-all focus-visible:ring-2"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition-colors outline-none"
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewOffIcon : ViewIcon}
                    className="h-4 w-4"
                  />
                </button>
              </div>
            </div>
          )}
        />

        <form.Field
          name="remember"
          children={(field) => (
            <div className="flex items-center gap-2.5">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
                className="border-border text-primary focus:ring-primary rounded-md"
              />
              <Label
                htmlFor={field.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-semibold transition-colors"
              >
                Keep me signed in
              </Label>
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 h-11 w-full cursor-pointer rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              loading={isSubmitting}
              disabled={!canSubmit}
            >
              Sign In
            </Button>
          )}
        />
      </form>

      <div className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/sign-up"
          className="text-primary hover:text-primary/90 font-bold underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

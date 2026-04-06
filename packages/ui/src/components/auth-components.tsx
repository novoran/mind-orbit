/**
 * Reusable Auth UI Components
 * Shared across all apps in the MindOrbit monorepo.
 */

import * as React from "react"
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@mindorbit/ui/lib/utils"
import { Input } from "@mindorbit/ui/components/input"
import { Button } from "@mindorbit/ui/components/button"

// ---------------------------------------------------------------------------
// AuthSocialButton
// ---------------------------------------------------------------------------

interface AuthSocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconSrc: string
  iconAlt: string
  label: string
}

function AuthSocialButton({
  iconSrc,
  iconAlt,
  label,
  className,
  ...props
}: AuthSocialButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-11 w-full gap-2.5 border-slate-200 font-medium transition-all hover:bg-slate-50 active:scale-95",
        className
      )}
      {...props}
    >
      <img src={iconSrc} alt={iconAlt} className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Button>
  )
}

// ---------------------------------------------------------------------------
// AuthTextField
// ---------------------------------------------------------------------------

interface AuthTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
  error?: string
}

function AuthTextField({
  label,
  icon,
  error,
  id,
  className,
  ...props
}: AuthTextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          className={cn(
            "h-11 border-slate-200",
            icon ? "pl-10" : "",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AuthPasswordField
// ---------------------------------------------------------------------------

interface AuthPasswordFieldProps {
  label: string
  id: string
  icon?: React.ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  rightSlot?: React.ReactNode
}

function AuthPasswordField({
  label,
  id,
  icon,
  value,
  onChange,
  placeholder = "••••••••",
  required,
  error,
  className,
  rightSlot,
}: AuthPasswordFieldProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
        {rightSlot}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={cn(
            "h-11 border-slate-200 pr-10",
            icon ? "pl-10" : "",
            className
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <HugeiconsIcon icon={ViewOffIcon} className="h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export { AuthSocialButton, AuthTextField, AuthPasswordField }

import {
  Navigation03Icon,
  Rocket01Icon,
  SparklesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import * as React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const year = new Date().getFullYear()

  return (
    <div className="grid min-h-screen lg:grid-cols-3">
      {/* Left Sidebar — Title, Logo, Features */}
      <div className="relative hidden flex-col justify-between p-6 lg:flex">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-slate-950 p-12 shadow-2xl">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop)",
            }}
          />
          <div className="absolute inset-0 bg-indigo-950/80 mix-blend-multiply" />

          {/* Content on top of background */}
          <div className="relative z-10 flex h-full flex-col justify-between text-white">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-lg">
                <HugeiconsIcon
                  icon={Rocket01Icon}
                  className="h-5 w-5 text-white"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">
                MindOrbit
              </span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-8">
              <div className="max-w-xs">
                <h1 className="mb-3 text-4xl leading-tight font-bold tracking-tight">
                  Propel your productivity into a new orbit.
                </h1>
                <p className="text-base text-slate-300">
                  AI-first orbit designed for high-performing teams.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <FeatureItem
                  icon={
                    <HugeiconsIcon
                      icon={Navigation03Icon}
                      className="h-5 w-5"
                    />
                  }
                  title="Smart Roadmaps"
                  description="Visual project tracking at light speed."
                />
                <FeatureItem
                  icon={
                    <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5" />
                  }
                  title="AI Summaries"
                  description="Condense hours of work into seconds."
                />
                <FeatureItem
                  icon={
                    <HugeiconsIcon icon={UserGroupIcon} className="h-5 w-5" />
                  }
                  title="Team Sync"
                  description="Real-time collaboration across galaxies."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-slate-400">
              © {year} MindOrbit Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area — Auth Form */}
      <div className="flex flex-col items-center justify-center p-6 lg:col-span-2">
        <div className="m-auto flex w-full max-w-[400px] flex-col items-center gap-8">
          {children}

          {/* Footer Links */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <Link
              to="/"
              hash="privacy"
              className="underline-offset-4 hover:text-indigo-600 hover:underline"
            >
              Privacy
            </Link>
            <Link
              to="/"
              hash="terms"
              className="underline-offset-4 hover:text-indigo-600 hover:underline"
            >
              Terms
            </Link>
            <Link
              to="/"
              hash="cookies"
              className="underline-offset-4 hover:text-indigo-600 hover:underline"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md transition-all hover:bg-white/20">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-slate-300">{description}</p>
      </div>
    </div>
  )
}

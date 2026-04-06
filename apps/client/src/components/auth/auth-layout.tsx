import {
  Navigation03Icon,
  Rocket01Icon,
  SparklesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const year = new Date().getFullYear()

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-4 lg:p-8">
      <div className="flex h-full w-full max-w-6xl overflow-hidden rounded-2xl">
        {/* Left Sidebar — Rounded card style */}
        <div className="relative hidden w-[45%] shrink-0 overflow-hidden rounded-2xl lg:flex">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop")',
            }}
          >
            <div className="absolute inset-0 bg-slate-950/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 text-white">
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
                  AI-first workspace designed for high-performing teams.
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

        {/* Right Column — Auth Form */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto rounded-2xl bg-white p-8">
          <div className="w-full max-w-sm space-y-7">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <HugeiconsIcon
                  icon={Rocket01Icon}
                  className="h-4 w-4 text-white"
                />
              </div>
              <span className="text-lg font-bold">MindOrbit</span>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>

            {children}

            {/* Mobile Footer */}
            <p className="text-center text-xs text-slate-400 lg:hidden">
              © {year} MindOrbit Inc.
            </p>
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-slate-300">{description}</p>
      </div>
    </div>
  )
}

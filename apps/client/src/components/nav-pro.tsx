"use client"

import { Button } from "@mindorbit/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

const BANNERS = [
  {
    id: "pro",
    title: "Mind Orbit Pro",
    description: "Power up your productivity",
    features: ["Unlimited AI Credits", "Advanced Team Analytics"],
    buttonText: "Upgrade Now",
    color: "primary",
  },
  {
    id: "teams",
    title: "Team Spaces",
    description: "Collaborate seamlessly",
    features: ["Shared Workspace", "Real-time Sync"],
    buttonText: "Learn More",
    color: "indigo",
  },
  {
    id: "security",
    title: "Enterprise Security",
    description: "Your data, protected",
    features: ["Role-based Access", "Audit Logs"],
    buttonText: "Contact Sales",
    color: "emerald",
  },
]

export function NavPro() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    if (isCollapsed) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
        setIsTransitioning(false)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [isCollapsed])

  if (isCollapsed) return null

  const currentBanner = BANNERS[currentIndex]

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="border-primary/10 bg-primary/5 relative h-[200px] w-full overflow-hidden rounded-2xl border dark:border-white/10 dark:bg-white/5">
              <div
                className={cn(
                  "absolute inset-0 flex flex-col gap-4 p-4 transition-all duration-500 ease-in-out",
                  isTransitioning
                    ? "translate-x-[-10px] opacity-0"
                    : "translate-x-0 opacity-100"
                )}
              >
                {/* Shiny effect animation */}
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

                <div className="bg-primary/20 absolute top-0 right-0 size-24 translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl" />

                <div className="relative flex flex-col gap-4">
                  <div className="flex flex-col">
                    <h4 className="text-[14px] font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                      {currentBanner.title}
                    </h4>
                    <p className="text-[12px] font-medium text-slate-500 dark:text-zinc-500">
                      {currentBanner.description}
                    </p>
                  </div>

                  <div className="space-y-2 px-1">
                    {currentBanner.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="bg-primary/40 size-1.5 rounded-full" />
                        <span className="text-[12px] leading-none font-medium text-slate-600 dark:text-zinc-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 mt-auto h-9 w-full cursor-pointer rounded-xl text-[13px] font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {currentBanner.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          .animate-shimmer {
            animation: shimmer 4s infinite linear;
          }
        `}
      </style>
    </SidebarGroup>
  )
}

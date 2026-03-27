"use client"

import { Button } from "@mindorbit/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

const BANNERS = [
  {
    id: "pro",
    title: "Mind Orbit Pro",
    description: "Power up your productivity",
    features: [
      "Unlimited AI Credits",
      "Advanced Team Analytics",
      "Exclusive Pro Themes",
    ],
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
    features: ["Role-based Access", "Audit Logs", "SAML SSO"],
    buttonText: "Contact Sales",
    color: "emerald",
  },
]

export function Banner() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (isCollapsed) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
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
            <div className="border-primary/10 bg-primary/5 relative w-full overflow-hidden rounded-2xl border p-4 transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-white/5">
              {/* Shiny effect animation */}
              <div className="animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

              <div className="bg-primary/20 absolute top-0 right-0 size-24 translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 shadow-[0_0_40px_rgba(var(--primary),0.2)] blur-3xl" />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentBanner.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="relative flex flex-col gap-4"
                >
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
                        <div className="bg-primary/40 size-1.5 rounded-full shadow-[0_0_4px_rgba(var(--primary),0.3)]" />
                        <span className="text-[12px] leading-none font-medium text-slate-600 dark:text-zinc-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 mt-2 h-9 w-full cursor-pointer rounded-xl text-[13px] font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {currentBanner.buttonText}
                  </Button>
                </motion.div>
              </AnimatePresence>
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

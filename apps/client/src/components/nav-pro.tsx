"use client"

import { Button } from "@mindorbit/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"

export function NavPro() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isCollapsed) return null

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="group border-primary/10 bg-primary/5 hover:bg-primary/8 dark:border-primary/20 dark:bg-primary/10 dark:hover:bg-primary/12 relative overflow-hidden rounded-2xl border px-4 py-2 transition-all">
              {/* Shiny effect animation */}
              <div className="animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

              <div className="bg-primary/20 absolute top-0 right-0 size-24 translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl transition-opacity group-hover:opacity-80" />

              <div className="relative flex flex-col gap-4">
                <div className="flex flex-col">
                  <h4 className="text-[14px] font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                    Mind Orbit Pro
                  </h4>
                  <p className="text-[12px] font-medium text-slate-500 dark:text-zinc-500">
                    Power up your productivity
                  </p>
                </div>

                <div className="space-y-2 px-1">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/40 size-1.5 rounded-full" />
                    <span className="text-[12px] leading-none font-medium text-slate-600 dark:text-zinc-400">
                      Unlimited AI Credits
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/40 size-1.5 rounded-full" />
                    <span className="text-[12px] leading-none font-medium text-slate-600 dark:text-zinc-400">
                      Advanced Team Analytics
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/40 size-1.5 rounded-full" />
                    <span className="text-[12px] leading-none font-medium text-slate-500 italic dark:text-zinc-500">
                      and many more...
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 h-9 w-full cursor-pointer rounded-xl text-[13px] font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                >
                  Upgrade Now
                </Button>
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

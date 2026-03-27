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

interface BannerItem {
  id: string
  header: {
    title: string
    subtitle?: string
  }
  content: {
    features?: Array<string>
    text?: string
  }
  footer: {
    label: string
    href?: string
    buttonStyle?: string
  }
  background?: {
    type: "color" | "gradient" | "image"
    value: string
  }
}

const BANNERS: Array<BannerItem> = [
  {
    id: "pro",
    header: {
      title: "Mind Orbit Pro",
      subtitle: "Full Power, No Limits",
    },
    content: {
      features: [
        "Unlimited AI Credits",
        "Advanced Team Analytics",
        "Priority Support",
      ],
    },
    footer: {
      label: "Upgrade Plan",
      buttonStyle:
        "bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90",
    },
    background: {
      type: "gradient",
      value:
        "linear-gradient(135deg, rgba(var(--primary), 0.15) 0%, rgba(var(--primary), 0.05) 100%)",
    },
  },
  {
    id: "image-demo",
    header: {
      title: "Your Universe Awaits",
      subtitle: "Start building today",
    },
    content: {
      text: "Experience a productivity tool crafted around the way you think. Intuitive, powerful, and yours.",
    },
    footer: {
      label: "Explore Features",
      buttonStyle:
        "bg-white/90 text-slate-900 hover:bg-white dark:bg-white/20 dark:text-white dark:hover:bg-white/30 backdrop-blur-sm",
    },
    background: {
      type: "image",
      value:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&fit=crop",
    },
  },
  {
    id: "teams",
    header: {
      title: "Team Sync",
      subtitle: "Work better together",
    },
    content: {
      text: "Real-time collaboration tools designed for high-performance teams. Sync your projects instantly.",
    },
    footer: {
      label: "Learn More",
      buttonStyle:
        "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-500/80 dark:hover:bg-indigo-500",
    },
    background: {
      type: "gradient",
      value:
        "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)",
    },
  },
  {
    id: "security",
    header: {
      title: "Secure Workspace",
      subtitle: "Enterprise Grade",
    },
    content: {
      features: ["SAML SSO & SCIM", "Audit Log Export", "Data Residency"],
    },
    footer: {
      label: "View Security",
      buttonStyle:
        "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-500/80 dark:hover:bg-emerald-500",
    },
    background: {
      type: "gradient",
      value:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)",
    },
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
    }, 10000)

    return () => clearInterval(interval)
  }, [isCollapsed])

  if (isCollapsed) return null

  const currentBanner = BANNERS[currentIndex]
  const isImageBanner = currentBanner.background?.type === "image"

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <motion.div
              layout
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="border-primary/10 relative w-full overflow-hidden rounded-2xl border dark:border-white/10"
              style={{
                background: !isImageBanner
                  ? currentBanner.background?.value
                  : undefined,
              }}
            >
              {/* Image background */}
              {isImageBanner && (
                <motion.div
                  key={currentBanner.id + "-bg"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${currentBanner.background!.value})`,
                  }}
                />
              )}

              {/* Overlay — darker for images for readability */}
              <div
                className={`absolute inset-0 z-1 ${isImageBanner ? "bg-black/50 backdrop-blur-[1px]" : "bg-background/10"}`}
              />

              {/* Shiny animation */}
              <div className="animate-shimmer absolute inset-0 z-2 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative z-10 p-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentBanner.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="flex flex-col gap-4"
                  >
                    {/* Header Section */}
                    <div className="flex flex-col gap-1">
                      <h4
                        className={`text-[15px] font-bold tracking-tight ${isImageBanner ? "text-white" : "text-foreground"}`}
                      >
                        {currentBanner.header.title}
                      </h4>
                      {currentBanner.header.subtitle && (
                        <p
                          className={`text-[12px] font-medium ${isImageBanner ? "text-white/70" : "text-slate-500 dark:text-zinc-500"}`}
                        >
                          {currentBanner.header.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="min-h-[48px]">
                      {currentBanner.content.features ? (
                        <div className="space-y-2">
                          {currentBanner.content.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <div
                                className={`size-1.5 rounded-full ${isImageBanner ? "bg-white/60" : "bg-primary/40"}`}
                              />
                              <span
                                className={`text-[12px] leading-tight font-medium ${isImageBanner ? "text-white/80" : "text-slate-600 dark:text-zinc-400"}`}
                              >
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p
                          className={`text-[12px] leading-relaxed font-medium ${isImageBanner ? "text-white/80" : "text-slate-600 dark:text-zinc-400"}`}
                        >
                          {currentBanner.content.text}
                        </p>
                      )}
                    </div>

                    {/* Footer Section */}
                    <div className="mt-1">
                      <Button
                        size="sm"
                        className={`h-8 w-full cursor-pointer rounded-xl text-[12px] font-semibold shadow-sm transition-all active:scale-95 ${currentBanner.footer.buttonStyle ?? "bg-white/80 text-slate-900 hover:bg-white dark:bg-zinc-800/80 dark:text-white dark:hover:bg-zinc-800"}`}
                      >
                        {currentBanner.footer.label}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
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

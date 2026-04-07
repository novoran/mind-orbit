import { Button } from "@mindorbit/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { Link } from "@tanstack/react-router"
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
      href: "/billing",
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
      href: "/",
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
      href: "/teams",
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
      title: "Secure Orbit",
      subtitle: "Enterprise Grade",
    },
    content: {
      features: ["SAML SSO & SCIM", "Audit Log Export", "Data Residency"],
    },
    footer: {
      label: "View Security",
      href: "/settings",
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

const slideVariants = {
  enter: { opacity: 0, x: 6 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -6 },
}

export function Banner() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (isCollapsed) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [isCollapsed])

  if (isCollapsed) return null

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Outer shell — no animation here, just clipping */}
            <div className="border-primary/10 relative w-full overflow-hidden rounded-lg border dark:border-white/10">
              {/* Shiny overlay — static, always on top */}
              <div className="animate-shimmer pointer-events-none absolute inset-0 z-10 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

              {/* The entire banner card (bg + content) slides as one unit */}
              <AnimatePresence mode="wait" initial={false}>
                {BANNERS.map((banner, i) =>
                  i === currentIndex ? (
                    <motion.div
                      key={banner.id}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      style={{
                        willChange: "transform, opacity",
                        background:
                          banner.background?.type !== "image"
                            ? banner.background?.value
                            : undefined,
                      }}
                    >
                      {/* Image background */}
                      {banner.background?.type === "image" && (
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${banner.background.value})`,
                          }}
                        />
                      )}

                      {/* Dark overlay for images */}
                      {banner.background?.type === "image" && (
                        <div className="absolute inset-0 bg-black/50" />
                      )}

                      {/* Content */}
                      <div className="relative z-1 flex flex-col gap-4 px-4 py-3">
                        {/* Header */}
                        <div className="flex flex-col">
                          <h4
                            className={`text-base font-bold tracking-tight ${banner.background?.type === "image" ? "text-white" : "text-foreground"}`}
                          >
                            {banner.header.title}
                          </h4>
                          {banner.header.subtitle && (
                            <p
                              className={`text-xs font-medium ${banner.background?.type === "image" ? "text-white/70" : "text-slate-500 dark:text-zinc-500"}`}
                            >
                              {banner.header.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-h-[48px]">
                          {banner.content.features ? (
                            <div className="space-y-1">
                              {banner.content.features.map((feature, fi) => (
                                <div
                                  key={fi}
                                  className="flex items-center gap-2.5"
                                >
                                  <div
                                    className={`size-1.5 rounded-full ${banner.background?.type === "image" ? "bg-gray-400" : "bg-primary/40"}`}
                                  />
                                  <span
                                    className={`text-xs leading-tight font-medium ${banner.background?.type === "image" ? "text-white" : "text-slate-800 dark:text-zinc-400"}`}
                                  >
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              className={`text-xs leading-tight font-medium ${banner.background?.type === "image" ? "text-white/80" : "text-slate-600 dark:text-zinc-400"}`}
                            >
                              {banner.content.text}
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <Button
                          size="sm"
                          className={`h-8 w-full cursor-pointer rounded-lg text-xs font-semibold shadow-sm transition-all duration-300 active:scale-95 ${banner.footer.buttonStyle ?? "bg-white/80 text-slate-900 hover:bg-white dark:bg-zinc-800/80 dark:text-white dark:hover:bg-zinc-800"}`}
                          render={
                            banner.footer.href ? (
                              banner.footer.href.startsWith("http") ||
                              banner.footer.href.startsWith("//") ? (
                                <a
                                  href={banner.footer.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ) : (
                                <Link to={banner.footer.href} />
                              )
                            ) : undefined
                          }
                        >
                          {banner.footer.label}
                        </Button>
                      </div>
                    </motion.div>
                  ) : null
                )}
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

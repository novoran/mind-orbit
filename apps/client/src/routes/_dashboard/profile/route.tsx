import {
  ComputerSettingsIcon,
  LockPasswordIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Skeleton } from "@mindorbit/ui/components/skeleton"
import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_dashboard/profile")({
  component: ProfileLayout,
})

const navItems = [
  {
    label: "Profile & Account",
    to: "/profile",
    icon: UserCircleIcon,
    exact: true,
  },
  { label: "Security", to: "/profile/security", icon: LockPasswordIcon },
  // {
  //   label: "Notifications",
  //   to: "/profile/notifications",
  //   icon: Notification01Icon,
  // },
  {
    label: "Preferences",
    to: "/profile/preferences",
    icon: ComputerSettingsIcon,
  },
]

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/profile": {
    title: "Profile & Account Settings",
    subtitle: "Manage your identity, account credentials, and data.",
  },
  "/profile/security": {
    title: "Security Settings",
    subtitle: "Manage your account security and active sessions.",
  },
  "/profile/notifications": {
    title: "Notification Settings",
    subtitle: "Choose how and when you want to be notified.",
  },
  "/profile/preferences": {
    title: "Preferences",
    subtitle:
      "Manage your application appearance, language, and default behaviors.",
  },
}

function ProfileLayout() {
  const location = useLocation()
  const session = authClient.useSession()
  const meta = PAGE_TITLES[location.pathname] ?? PAGE_TITLES["/profile"]

  return (
    <div className="flex flex-1 flex-col gap-6 p-3 lg:p-4">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        {session.isPending ? (
          <>
            <Skeleton className="h-8 w-52" />
            <Skeleton className="mt-1 h-4 w-72" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
            <p className="text-muted-foreground text-sm">{meta.subtitle}</p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Side Navigation */}
        <aside className="w-full shrink-0 lg:w-52">
          <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="h-[calc(100vh-13rem)] min-w-0 flex-1 overflow-y-auto p-1 pr-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  label,
  to,
  icon,
  exact,
}: {
  label: string
  to: string
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  exact?: boolean
}) {
  const location = useLocation()
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to)

  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-muted text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        strokeWidth={2}
        className="shrink-0"
      />
      {label}
    </Link>
  )
}

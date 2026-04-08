import {
  AppleIntelligenceIcon,
  CreditCardIcon,
  Invoice01Icon,
  Key01Icon,
  PieChart02Icon,
  PlusSignIcon,
  SecurityCheckIcon,
  Settings01Icon,
  Shield01Icon,
  UserAdd01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@mindorbit/ui/components/button"
import { Skeleton } from "@mindorbit/ui/components/skeleton"
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_dashboard/(spaces)/settings")({
  beforeLoad: ({ context }) => {
    const { activeMember } = context
    if (activeMember?.role !== "owner" && activeMember?.role !== "admin") {
      throw redirect({ to: "/" })
    }
  },
  component: SettingsLayout,
})

const navItems = [
  {
    label: "General",
    to: "/settings",
    icon: Settings01Icon,
    exact: true,
  },
  { label: "Members & Roles", to: "/settings/members", icon: UserGroupIcon },
  { label: "Roles & Permissions", to: "/settings/roles", icon: Shield01Icon },
  { label: "Security", to: "/settings/security", icon: SecurityCheckIcon },
  { label: "API Keys", to: "/settings/api-keys", icon: Key01Icon },
  {
    label: "Integrations",
    to: "/settings/integrations",
    icon: AppleIntelligenceIcon,
  },
  { label: "Usage", to: "/settings/usage", icon: PieChart02Icon },
  { label: "Billing", to: "/settings/billing", icon: CreditCardIcon },
  { label: "Invoices", to: "/settings/invoices", icon: Invoice01Icon },
]

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/settings": {
    title: "Orbit Settings",
    subtitle: "Manage your team's orbit and general preferences.",
  },
  "/settings/members": {
    title: "Members & Roles",
    subtitle: "Manage your orbit members and their permission levels.",
  },
  "/settings/roles": {
    title: "Roles & Permissions",
    subtitle: "Define and manage access levels for your team members.",
  },
  "/settings/security": {
    title: "Security",
    subtitle: "Manage your orbit security settings and requirements.",
  },
  "/settings/api-keys": {
    title: "API Keys",
    subtitle: "Manage API keys for accessing orbit resources.",
  },
  "/settings/integrations": {
    title: "Integrations",
    subtitle: "Connect your orbit with third-party tools.",
  },
  "/settings/usage": {
    title: "Usage",
    subtitle: "Monitor your orbit resource usage and limits.",
  },
  "/settings/billing": {
    title: "Billing",
    subtitle: "Manage your payment methods and subscription plan.",
  },
  "/settings/invoices": {
    title: "Invoices",
    subtitle: "View and download your billing invoices.",
  },
}

function SettingsLayout() {
  const location = useLocation()
  const session = authClient.useSession()
  const meta = PAGE_TITLES[location.pathname] ?? PAGE_TITLES["/settings"]

  return (
    <div className="flex flex-1 flex-col gap-6 p-3 lg:p-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          {session.isPending ? (
            <>
              <Skeleton className="h-8 w-52" />
              <Skeleton className="mt-1 h-4 w-72" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">
                {meta.title}
              </h1>
              <p className="text-muted-foreground text-sm">{meta.subtitle}</p>
            </>
          )}
        </div>

        {!session.isPending && location.pathname === "/settings/members" && (
          <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <HugeiconsIcon icon={UserAdd01Icon} size={16} />
            Invite Member
          </Button>
        )}
        {!session.isPending && location.pathname === "/settings/roles" && (
          <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Create Custom Role
          </Button>
        )}
        {!session.isPending && location.pathname === "/settings/api-keys" && (
          <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Create API Key
          </Button>
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

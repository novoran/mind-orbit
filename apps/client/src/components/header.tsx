import { Share01Icon } from "@hugeicons/core-free-icons"
import { AnimatedThemeToggler } from "@mindorbit/ui/components/animated-theme-toggler"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mindorbit/ui/components/breadcrumb"
import { Link, useLocation } from "@tanstack/react-router"
import * as React from "react"
import { NavUser } from "./nav-user"
import { NotificationCenter } from "./notification-center"

import { authClient } from "@/lib/auth-client"

const teamsData = [
  {
    name: "Global Team",
    logo: Share01Icon,
    image: "https://avatar.vercel.sh/global.png",
  },
  {
    name: "Marketing Team",
    logo: Share01Icon,
    image: "https://avatar.vercel.sh/marketing.png",
  },
  {
    name: "Development Team",
    logo: Share01Icon,
    image: "https://avatar.vercel.sh/development.png",
  },
]

export function Header() {
  const location = useLocation()
  const session = authClient.useSession()
  const user = session.data?.user

  const pathnames = location.pathname.split("/").filter((x) => x)

  return (
    <header className="bg-background cubic-bezier(0.4, 0, 0.2, 1) sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 transition-all duration-200">
      <div className="flex items-center gap-1">
        {/* <SidebarTrigger className="-ml-1 cursor-pointer" /> */}
        <Breadcrumb>
          <BreadcrumbList>
            {/* <BreadcrumbItem>
              <TeamSwitcher teams={teamsData} />
            </BreadcrumbItem>
            <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              {pathnames.length === 0 ? (
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              ) : (
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </BreadcrumbItem>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`
              const isLast = index === pathnames.length - 1
              const displayName = name.charAt(0).toUpperCase() + name.slice(1)

              return (
                <React.Fragment key={routeTo}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{displayName}</BreadcrumbPage>
                    ) : (
                      <Link
                        to={routeTo}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {displayName}
                      </Link>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <NotificationCenter />
        <AnimatedThemeToggler className="cursor-pointer" />
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.image ?? undefined,
            }}
          />
        )}
      </div>
    </header>
  )
}

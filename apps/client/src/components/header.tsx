import { Share01Icon } from "@hugeicons/core-free-icons"
import { AnimatedThemeToggler } from "@mindorbit/ui/components/animated-theme-toggler"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mindorbit/ui/components/breadcrumb"
import { useLocation } from "@tanstack/react-router"
import * as React from "react"
import { NavUser } from "./nav-user"
import { NotificationCenter } from "./notification-center"
import { TeamSwitcher } from "./team-switcher"

const userData = {
  name: "Alex Reed",
  email: "alex@mindorbit.com",
  avatar: "https://avatar.vercel.sh/alex.png",
}

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
  const pathnames = location.pathname.split("/").filter((x) => x)

  return (
    <header className="bg-background cubic-bezier(0.4, 0, 0.2, 1) sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 transition-all duration-200">
      <div className="flex items-center gap-1">
        {/* <SidebarTrigger className="-ml-1 cursor-pointer" /> */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <TeamSwitcher teams={teamsData} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathnames.length === 0 ? (
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`
                const isLast = index === pathnames.length - 1
                const displayName = name.charAt(0).toUpperCase() + name.slice(1)

                return (
                  <React.Fragment key={routeTo}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{displayName}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={routeTo}>
                          {displayName}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <NotificationCenter />
        <AnimatedThemeToggler className="cursor-pointer" />
        <NavUser user={userData} />
      </div>
    </header>
  )
}

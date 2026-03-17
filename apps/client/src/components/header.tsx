import { Notification01Icon, Share01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatedThemeToggler } from "@mindorbit/ui/components/animated-theme-toggler"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mindorbit/ui/components/breadcrumb"
import { Button } from "@mindorbit/ui/components/button"
import { SidebarTrigger } from "@mindorbit/ui/components/sidebar"
import { NavUser } from "./nav-user"
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
    plan: "Free",
    image: "https://avatar.vercel.sh/global.png",
  },
]

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 transition-all ease-linear">
      <div className="flex items-center gap-0.5">
        <SidebarTrigger className="-ml-1" />
        <TeamSwitcher teams={teamsData} />
        <div className="flex items-center text-slate-400">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} size={20} />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full border-2 border-white bg-red-500 dark:border-slate-950" />
        </Button>
        <AnimatedThemeToggler />
        <NavUser user={userData} />
      </div>
    </header>
  )
}

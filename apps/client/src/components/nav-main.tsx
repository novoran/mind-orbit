import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@mindorbit/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@mindorbit/ui/components/sidebar"
import { cn } from "@mindorbit/ui/lib/utils"
import { Link } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

export function NavMain({
  items,
  label,
  placeholder,
}: {
  items: Array<{
    title: string
    url: string
    icon?: any
    isActive?: boolean
    items?: Array<{
      title: string
      url: string
    }>
  }>
  label?: string
  placeholder?: React.ReactNode
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.length > 0
          ? items.map((item) => {
              const hasSubItems = item.items && item.items.length > 0

              if (!hasSubItems) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={({ className, ...props }) => (
                        <Link
                          to={item.url}
                          className={cn(
                            className,
                            "transition-all duration-250"
                          )}
                          activeOptions={{ exact: item.url === "/" }}
                          activeProps={{
                            className:
                              "bg-primary/10 text-primary! dark:bg-white/10 dark:text-white!",
                          }}
                          {...props}
                        >
                          {({ isActive }) => (
                            <>
                              {item.icon && (
                                <div
                                  className={cn(
                                    "flex size-4 shrink-0 items-center justify-center transition-colors duration-250",
                                    isActive && "text-primary dark:text-white"
                                  )}
                                >
                                  <HugeiconsIcon
                                    icon={item.icon}
                                    strokeWidth={2}
                                    className="size-4"
                                  />
                                </div>
                              )}
                              <span
                                className={cn(
                                  "transition-colors duration-250",
                                  isActive && "font-semibold"
                                )}
                              >
                                {item.title}
                              </span>
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      ease: "easeInOut",
                                    }}
                                    className="bg-primary absolute right-2 size-1.5 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)] group-data-[collapsible=icon]:hidden dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                  />
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </Link>
                      )}
                    />
                  </SidebarMenuItem>
                )
              }

              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip={item.title} />}
                  >
                    {item.icon && (
                      <div className="flex size-4 shrink-0 items-center justify-center">
                        <HugeiconsIcon
                          icon={item.icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                      </div>
                    )}
                    <span>{item.title}</span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90"
                      strokeWidth={2}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            render={({ className, ...props }) => (
                              <Link
                                to={subItem.url}
                                className={cn(
                                  className,
                                  "transition-all duration-200"
                                )}
                                activeProps={{
                                  className:
                                    "bg-primary/10 text-primary dark:bg-white/10 dark:text-white!",
                                }}
                                {...props}
                              >
                                {({ isActive }: { isActive: boolean }) => (
                                  <>
                                    <span
                                      className={cn(
                                        "transition-colors duration-250",
                                        isActive &&
                                          "text-primary font-semibold dark:text-white"
                                      )}
                                    >
                                      {subItem.title}
                                    </span>
                                    <AnimatePresence>
                                      {isActive && (
                                        <motion.div
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0, opacity: 0 }}
                                          transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                          }}
                                          className="bg-primary absolute right-2 size-1 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)] group-data-[collapsible=icon]:hidden dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                        />
                                      )}
                                    </AnimatePresence>
                                  </>
                                )}
                              </Link>
                            )}
                          />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              )
            })
          : placeholder && <div className="mt-2">{placeholder}</div>}
      </SidebarMenu>
    </SidebarGroup>
  )
}

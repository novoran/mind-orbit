import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"
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
import { Link } from "@tanstack/react-router"

export function NavMain({
  items,
  label = "Platform",
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
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={({ className, ...props }) => (
                    <Link
                      to={item.url}
                      className={className}
                      activeOptions={{ exact: item.url === "/" }}
                      {...props}
                    >
                      {({ isActive }) => (
                        <>
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
                          {isActive && (
                            <div className="bg-primary absolute right-2 size-1.5 rounded-full" />
                          )}
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
                  strokeWidth={2}
                  className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90"
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
                            className={className}
                            {...props}
                          >
                            {({ isActive }: { isActive: boolean }) => (
                              <>
                                <span
                                  className={cn(
                                    isActive &&
                                      "text-primary font-medium transition-colors"
                                  )}
                                >
                                  {subItem.title}
                                </span>
                                {isActive && (
                                  <div className="bg-primary absolute right-2 size-1 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                )}
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
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

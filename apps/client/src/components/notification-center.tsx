import {
  Alert01Icon,
  Cancel01Icon,
  File01Icon,
  Notification01Icon,
  Settings02Icon,
  SparklesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@mindorbit/ui/components/avatar"
import { Button } from "@mindorbit/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mindorbit/ui/components/popover"
import { Separator } from "@mindorbit/ui/components/separator"
import { cn } from "@mindorbit/ui/lib/utils"
import { formatDistanceToNow, subHours, subMinutes } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

interface Notification {
  id: string
  type: "access" | "insight" | "mention" | "file" | "system"
  title: string
  user?: {
    name: string
    avatar: string
  }
  description: string
  linkedText?: string
  createdAt: Date
  read: boolean
  hasActions?: boolean
}

const MOCK_NOTIFICATIONS: Array<Notification> = [
  {
    id: "1",
    type: "access",
    title: "Guest Access Expired",
    user: {
      name: "Sarah Jenkins",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    description: "guest access to the 'Project Alpha' folder has expired.",
    createdAt: subMinutes(new Date(), 10),
    read: false,
    hasActions: true,
  },
  {
    id: "2",
    type: "insight",
    title: "AI Insight Ready",
    description:
      "Your weekly project summary for MindOrbit is now available to review.",
    createdAt: subHours(new Date(), 1),
    read: false,
  },
  {
    id: "3",
    type: "mention",
    title: "Mentioned in 'Design System'",
    user: {
      name: "Marcus",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    description: 'tagged you: "Should we use the new radius variables here?"',
    createdAt: subHours(new Date(), 3),
    read: false,
  },
  {
    id: "4",
    type: "file",
    title: "New File Shared",
    user: {
      name: "Elena",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
    description: 'shared "Q4 Roadmap.pdf" with the executive team.',
    createdAt: subHours(new Date(), 5),
    read: true,
  },
  {
    id: "5",
    type: "insight",
    title: "AI Insight Ready",
    description:
      "Your weekly project summary for MindOrbit is now available to review.",
    createdAt: subHours(new Date(), 1),
    read: false,
  },
]

const notificationIcon = {
  access: Cancel01Icon,
  insight: SparklesIcon,
  mention: UserGroupIcon,
  file: File01Icon,
  system: Settings02Icon,
}

const iconBg = {
  access: "bg-destructive/10 text-destructive",
  insight: "bg-primary/10 text-primary",
  mention: "bg-primary/10 text-primary",
  file: "bg-muted text-muted-foreground",
  system: "bg-muted text-zinc-500/10",
}

export function NotificationCenter() {
  const [notifications, setNotifications] =
    React.useState<Array<Notification>>(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length
  const filtered = notifications

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <Popover>
      <PopoverTrigger className="group/button hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50">
        <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="border-background bg-destructive absolute top-1.5 right-1.5 size-2.5 rounded-full border-2"
          />
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="border-border w-[380px] gap-0 overflow-hidden border p-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <h2 className="text-foreground text-[20px] font-bold tracking-tight">
              Notifications
            </h2>
          </div>
          <button
            onClick={markAllRead}
            className="text-primary hover:text-primary/90 cursor-pointer text-xs font-semibold"
          >
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="bg-background flex max-h-[450px] flex-col overflow-y-auto border-t">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-muted-foreground/60 text-sm font-medium">
                  No notifications yet
                </p>
              </motion.div>
            ) : (
              filtered.slice(0, 20).map((notification, idx) => (
                <React.Fragment key={notification.id}>
                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => markRead(notification.id)}
                    className={cn(
                      "group relative flex w-full cursor-pointer items-start gap-4 border-none px-4 py-3 text-left transition-all outline-none",
                      idx % 2 === 0 ? "bg-background" : "bg-muted/30",
                      "hover:bg-muted/60"
                    )}
                  >
                    {/* Left: Avatar or Icon */}
                    <div className="shrink-0 pt-0.5">
                      {notification.user ? (
                        <Avatar className="border-border ring-muted/50 size-9 border ring-4">
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback>
                            {notification.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            iconBg[notification.type]
                          )}
                        >
                          <HugeiconsIcon
                            icon={notificationIcon[notification.type]}
                            size={20}
                            strokeWidth={2}
                          />
                        </div>
                      )}
                    </div>

                    {/* Right: Content */}
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="mb-0.5 flex items-start justify-between">
                        <h4 className="text-foreground text-[14px] font-bold tracking-tight">
                          {notification.title}
                        </h4>
                        <span className="text-muted-foreground/60 mt-0.5 text-[11px] font-medium">
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: false,
                          }).replace("about ", "")}{" "}
                          ago
                        </span>
                      </div>

                      <p className="text-muted-foreground mt-0.5 text-[13px] leading-[1.4]">
                        {notification.user && (
                          <span className="text-foreground font-bold">
                            {notification.user.name}
                            {"'"}s{" "}
                          </span>
                        )}
                        {notification.description}
                      </p>

                      {/* Meta/Actions Section */}
                      {notification.hasActions && (
                        <div className="mt-4 flex items-center gap-3">
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 cursor-pointer rounded-lg px-6 text-[13px] font-bold shadow-sm">
                            Renew Access
                          </Button>
                          <Button
                            variant="secondary"
                            className="bg-muted text-foreground hover:bg-muted/80 h-9 cursor-pointer rounded-lg border-none px-6 text-[13px] font-bold"
                          >
                            Manage
                          </Button>
                        </div>
                      )}

                      {/* Secondary Link style meta */}
                      {!notification.hasActions && notification.user && (
                        <div className="mt-1">
                          <span className="text-primary/70 cursor-pointer text-[11px] font-bold hover:underline">
                            View project overview
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Indicator Icon Badge */}
                    {notification.type === "access" && (
                      <div className="bg-destructive ring-background absolute bottom-2.5 left-8.5 flex h-[18px] w-[18px] items-center justify-center rounded-full shadow-sm ring-2">
                        <HugeiconsIcon
                          icon={Alert01Icon}
                          size={10}
                          strokeWidth={3}
                          className="text-destructive-foreground"
                        />
                      </div>
                    )}
                  </motion.button>
                  {idx !== Math.min(filtered.length, 20) - 1 && (
                    <Separator className="bg-border/60" />
                  )}
                </React.Fragment>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-muted/20 border-t px-3 py-2 text-center">
          <button className="text-muted-foreground hover:bg-muted hover:text-foreground w-full cursor-pointer rounded-lg py-2 text-sm font-bold transition-colors duration-300">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

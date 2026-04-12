import { shallow } from "@liveblocks/react"

import { useOthersMapped, useSelf } from "@liveblocks/react/suspense"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function PresenceBar() {
  const self = useSelf()
  const others = useOthersMapped(
    (other) => ({
      name: other.info?.name ?? "Anonymous",
      avatar: other.info?.avatar ?? "",
      color: other.info?.color ?? "#6366f1",
    }),
    shallow
  )

  return (
    <div className="flex items-center gap-1">
      {/* Remote users (up to 4) */}
      {others.slice(0, 4).map(([connectionId, other]) => (
        <div
          key={connectionId}
          title={other.name}
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900"
          style={{ backgroundColor: other.color }}
        >
          {other.avatar ? (
            <img
              src={other.avatar}
              alt={other.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-semibold text-white">
              {getInitials(other.name)}
            </span>
          )}
        </div>
      ))}

      {/* Overflow badge */}
      {others.length > 4 && (
        <div className="bg-muted text-muted-foreground flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-white dark:ring-gray-900">
          +{others.length - 4}
        </div>
      )}

      {/* Self (always last) */}
      {self && (
        <div
          title={`${self.info.name ?? "You"} (You)`}
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900"
          style={{ backgroundColor: self.info.color ?? "#6366f1" }}
        >
          {self.info.avatar ? (
            <img
              src={self.info.avatar}
              alt="You"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-semibold text-white">
              {getInitials(self.info?.name ?? "Me")}
            </span>
          )}
          {/* "You" indicator */}
          <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-white bg-green-500 dark:border-gray-900" />
        </div>
      )}
    </div>
  )
}

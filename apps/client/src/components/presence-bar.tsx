import { shallow } from "@liveblocks/react"
import { useOthersMapped, useSelf } from "@liveblocks/react/suspense"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@mindorbit/ui/components/avatar"

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
      name: other.info.name,
      avatar: other.info.avatar,
      color: other.info.color,
    }),
    shallow
  )

  const visibleOthers = others.slice(0, 4)
  const overflowCount = others.length - visibleOthers.length

  return (
    <AvatarGroup>
      {/* Remote users (up to 4) */}
      {visibleOthers.map(([connectionId, other]) => (
        <Avatar key={connectionId} size="sm" title={other.name}>
          <AvatarImage src={other.avatar} alt={other.name} />
          <AvatarFallback
            style={{ backgroundColor: other.color, color: "white" }}
          >
            {getInitials(other.name)}
          </AvatarFallback>
        </Avatar>
      ))}

      {/* Overflow badge */}
      {overflowCount > 0 && (
        <AvatarGroupCount title={`${overflowCount} more`}>
          +{overflowCount}
        </AvatarGroupCount>
      )}

      {/* Self (always last, with green "You" indicator) */}
      <Avatar size="sm" title={`${self.info.name} (You)`}>
        <AvatarImage src={self.info.avatar} alt="You" />
        <AvatarFallback
          style={{ backgroundColor: self.info.color, color: "white" }}
        >
          {getInitials(self.info.name)}
        </AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
    </AvatarGroup>
  )
}

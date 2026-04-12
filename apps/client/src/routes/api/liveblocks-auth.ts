import { Liveblocks } from "@liveblocks/node"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { getToken } from "@/lib/auth-server"

// Color palette for user presence
const USER_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#64B5F6",
  "#4DB6AC",
  "#81C784",
  "#FFD54F",
  "#FF8A65",
  "#7986CB",
  "#A1887F",
]

function getRandomColor(userId: string): string {
  // Deterministic color based on userId
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY ?? "sk_dev_PLACEHOLDER",
})

const liveblocksAuthFn = createServerFn({ method: "POST" }).handler(
  async ({ request }) => {
    // Get the Better Auth token to identify the user
    const token = await getToken()

    if (!token) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Decode user info from the token (JWT payload)
    let userId = "anonymous"
    let userName = "Anonymous"
    let userAvatar = ""

    try {
      const parts = token.split(".")
      if (parts.length === 3) {
        // Use Buffer instead of atob for server-side reliability
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64").toString("utf8")
        )
        userId = payload.sub || payload.userId || "anonymous"
        userName = payload.name || payload.email || "Anonymous"
        userAvatar = payload.image || payload.picture || ""
      }
    } catch {
      // fallback to anonymous if decode fails
    }

    const { status, body } = await liveblocks.identifyUser(
      {
        userId,
        groupIds: [],
      },
      {
        userInfo: {
          name: userName,
          avatar: userAvatar,
          color: getRandomColor(userId),
        },
      }
    )

    return new Response(body, { status })
  }
)

export const Route = createFileRoute("/api/liveblocks-auth")({
  server: {
    handlers: {
      POST: ({ request }) => liveblocksAuthFn({ request }),
    },
  },
})

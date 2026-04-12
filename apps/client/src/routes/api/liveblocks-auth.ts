import { Liveblocks } from "@liveblocks/node"
import { createFileRoute } from "@tanstack/react-router"

import { getToken } from "@/lib/auth-server"

// Color palette for user presence (Modern & Vibrant)
const USER_COLORS = [
  "#FF5C00", // Orange
  "#00D0FF", // Cyan
  "#9747FF", // Purple
  "#00FFD1", // Teal
  "#FF00C8", // Pink
  "#FFD600", // Yellow
  "#7000FF", // Deep Purple
  "#0057FF", // Blue
  "#33FF00", // Bright Green
  "#FF0000", // Bright Red
]

function getRandomColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

/**
 * Internal handler for Liveblocks Authentication
 * Uses Access Tokens (Session API) for enhanced security and permission control.
 */
async function handleLiveblocksAuth(request: Request) {
  // 1. Get the session token from Better Auth
  const token = await getToken()

  if (!token) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 2. Extract user info from the JWT token
  let userId = "anonymous"
  let userName = "Anonymous"
  let userAvatar = ""

  try {
    const parts = token.split(".")
    if (parts.length === 3) {
      // Decode payload from JWT
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf8")
      )
      userId = payload.sub || payload.userId || "anonymous"
      userName = payload.name || payload.email || "Anonymous User"
      userAvatar = payload.image || payload.picture || ""
    }
  } catch (error) {
    console.error("[Liveblocks Auth] Failed to decode session token:", error)
    return new Response("Invalid Session", { status: 403 })
  }

  // 3. Start a new Liveblocks session
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name: userName,
      avatar: userAvatar,
      color: getRandomColor(userId),
    },
  })

  // 4. Grant permissions based on the requested room
  // For Access Token Auth, the room ID is sent in the request body
  try {
    const { room } = await request.json()
    if (room) {
      // Authenticated users get full access to the room they request
      session.allow(room, session.FULL_ACCESS)
    }
  } catch {
    // If no room is provided or body is empty, we still authorize the session
    // This allows the user to perform global actions (like fetchRoomInfo)
  }

  // 5. Authorize the session and return the response
  const { status, body } = await session.authorize()
  return new Response(body, { status })
}

export const Route = createFileRoute("/api/liveblocks-auth")({
  server: {
    handlers: {
      POST: ({ request }) => handleLiveblocksAuth(request),
    },
  },
})

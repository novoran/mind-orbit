import { createClient } from "@liveblocks/client"
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react"

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16, // Optimized for 60fps updates
})

// Types for our Miro-style Canvas
export type ShapeLayer = {
  type: "rectangle" | "circle" | "diamond" | "triangle" | "sticky"
  x: number
  y: number
  height: number
  width: number
  fill: string
  text?: string
}

export type TextLayer = {
  type: "text"
  x: number
  y: number
  height: number
  width: number
  text: string
  fontSize: number
  fill: string
}

export type Layer = ShapeLayer | TextLayer

declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null
      selection: Array<string>
      pencilColor: string | null
      // User info stored in presence for faster access (synced from userInfo)
      name?: string
      avatar?: string
      color?: string
    }

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      layers: import("@liveblocks/client").LiveMap<
        string,
        import("@liveblocks/client").LiveObject<Layer>
      >
      layerIds: import("@liveblocks/client").LiveList<string>
    }

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string
      info: {
        name: string
        avatar: string
        color: string
      }
    }

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent:
      | {
          type: "CHAT_MESSAGE"
          text: string
        }
      | {
          type: "REACTION"
          emoji: string
        }

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      resolved: boolean
      x: number
      y: number
    }
  }
}

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useCreateThread,
    useEditThreadMetadata,
    useRenameThread,
    useDeleteThread,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext(client)

export const {
  suspense: {
    useInboxNotifications,
    useUnreadInboxNotificationsCount,
    useMarkAllInboxNotificationsAsRead,
    useMarkInboxNotificationAsRead,
    useUser,
    useUsers,
  },
} = createLiveblocksContext(client)

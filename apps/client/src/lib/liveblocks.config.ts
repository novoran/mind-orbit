import { createClient } from "@liveblocks/client"

import type { LiveList, LiveMap, LiveObject } from "@liveblocks/client"

export const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16, // Optimized for 60fps updates
})

// Types for our Miro-style Canvas
export type ShapeLayer = {
  type: "rectangle" | "circle" | "diamond" | "triangle" | "star" | "sticky"
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

export type PathLayer = {
  type: "path"
  x: number
  y: number
  height: number
  width: number
  fill: string
  points: Array<Array<number>> // For pen
}

export type LineLayer = {
  type: "line" | "arrow"
  x: number
  y: number
  height: number
  width: number
  fill: string
  points: Array<{ x: number; y: number }> // [start, control, end]
}

export type Layer = (ShapeLayer | TextLayer | PathLayer | LineLayer) & {
  stroke?: string
  strokeWidth?: number
  textColor?: string
  rotation?: number
}

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
      layers: LiveMap<string, LiveObject<Layer>>
      layerIds: LiveList<string>
      notes: LiveList<{ id: string; title: string }>
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
      x?: number // Canvas position
      y?: number // Canvas position
      rangeId?: string // Tiptap selection anchor
      quote?: string // Tiptap selected text snippet
    }

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      title?: string
      url?: string
    }

    // Custom group info set with resolveGroupsInfo, for useGroupInfo
    GroupInfo: {
      name: string
      badge: string
    }

    // Custom activities data for custom notification kinds
    ActivitiesData: {
      $alert?: {
        title: string
        message: string
      }
    }
  }
}

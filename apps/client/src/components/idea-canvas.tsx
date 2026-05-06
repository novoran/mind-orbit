import {
  ArrowUpRight02Icon,
  CircleIcon,
  CursorMagicSelection04Icon,
  DiamondIcon,
  Hold03Icon,
  LinerIcon,
  PaintBrush01Icon,
  RectangularIcon,
  Redo03Icon,
  StarIcon,
  StickyNote02Icon,
  TextFontIcon,
  TriangleIcon,
  Undo03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { LiveObject } from "@liveblocks/client"
import { shallow } from "@liveblocks/react"
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense"
import { cn } from "@mindorbit/ui/lib/utils"
import { nanoid } from "nanoid"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import { Separator } from "@mindorbit/ui/components/separator"
import { CanvasLayer } from "./canvas/canvas-layer"
import { SHAPE_COLORS, STICKY_COLORS } from "./canvas/constants"
import { ContextToolbar } from "./canvas/context-toolbar"
import { RemoteCursor } from "./canvas/remote-cursor"
import { SelectionHandles } from "./canvas/selection-handles"
import { NavButton, ToolButton } from "./canvas/toolbars"

import type {
  Layer,
  LineLayer,
  PathLayer,
  ShapeLayer,
} from "@/lib/liveblocks.config"

// ────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ────────────────────────────────────────────────────────────────────────────

type CanvasTool =
  | "select"
  | "rectangle"
  | "circle"
  | "diamond"
  | "triangle"
  | "star"
  | "sticky"
  | "text"
  | "pan"
  | "pen"
  | "line"
  | "arrow"

// ─── Canvas Component ────────────────────────────────────────────────────────────

export function IdeaCanvas() {
  const [activeTool, setActiveTool] = React.useState<CanvasTool>("select")
  const [selectedIds, setSelectedIds] = React.useState<Array<string>>([])
  const primarySelectedId = selectedIds[selectedIds.length - 1] || null

  const getBoundingBox = (ids: Array<string>) => {
    if (ids.length === 0) return null
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    let found = false

    ids.forEach((id) => {
      const layer = layers.get(id)
      if (layer) {
        found = true
        minX = Math.min(minX, layer.x)
        minY = Math.min(minY, layer.y)
        maxX = Math.max(maxX, layer.x + layer.width)
        maxY = Math.max(maxY, layer.y + layer.height)
      }
    })

    if (minX === Infinity) return null

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }
  const [selectionBox, setSelectionBox] = React.useState<{
    startX: number
    startY: number
    width: number
    height: number
  } | null>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState<{
    id: string
    startX: number
    startY: number
    initialPositions: Array<{ id: string; x: number; y: number }>
  } | null>(null)
  const [camera, setCamera] = React.useState({ x: 0, y: 0, zoom: 1 })
  const [isPanning, setIsPanning] = React.useState(false)
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 })
  const [resizing, setResizing] = React.useState<{
    ids: Array<string>
    handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w"
    startBoundingBox: { x: number; y: number; width: number; height: number }
    initialLayers: Map<
      string,
      { x: number; y: number; width: number; height: number }
    >
    startX: number
    startY: number
  } | null>(null)
  const [rotating, setRotating] = React.useState<{
    id: string
    startAngle: number
    initialRotation: number
  } | null>(null)
  const [resizingLinePoint, setResizingLinePoint] = React.useState<{
    id: string
    index: number
  } | null>(null)

  const history = useHistory()

  // Batch history for text editing
  React.useEffect(() => {
    if (editingId) {
      history.pause()
    } else {
      history.resume()
    }
  }, [editingId, history])
  const svgRef = React.useRef<SVGSVGElement>(null)

  const updateMyPresence = useUpdateMyPresence()

  // Pull layers from Liveblocks storage
  const layers = useStorage((root) => {
    const map = new Map<string, Layer>()
    // root.layers is a plain object in the selector snapshot and always exists
    for (const [id, obj] of Object.entries(root.layers)) {
      map.set(id, obj as Layer)
    }
    return map
  }, shallow)

  const layerIds = useStorage((root) => [...root.layerIds])

  // Remote cursors
  const others = useOthersMapped(
    (other) => ({
      cursor: other.presence.cursor,
      color: other.info.color || "#6366f1",
      name: other.info.name || "Anonymous",
    }),
    shallow
  )

  // ── Mutations ─────────────────────────────────────────────────────────────

  const insertLayer = useMutation(({ storage }, layer: Layer) => {
    const id = nanoid()
    const liveLayers = storage.get("layers")
    const liveLayerIds = storage.get("layerIds")
    liveLayers.set(id, new LiveObject(layer))
    liveLayerIds.push(id)
    return id
  }, [])

  const moveLayers = useMutation(
    ({ storage }, updates: Array<{ id: string; x: number; y: number }>) => {
      const liveLayers = storage.get("layers")
      updates.forEach(({ id, x, y }) => {
        const layer = liveLayers.get(id)
        if (layer) layer.update({ x, y })
      })
    },
    []
  )

  const finalizeLayer = useMutation(({ storage }, id: string) => {
    const liveLayers = storage.get("layers")
    const layer = liveLayers.get(id)
    if (!layer) return

    const type = layer.get("type")
    const points = layer.get("points") as any

    if (type === "path") {
      if (!points || points.length === 0) return
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      points.forEach((p: any) => {
        const [px, py] = p
        minX = Math.min(minX, px)
        minY = Math.min(minY, py)
        maxX = Math.max(maxX, px)
        maxY = Math.max(maxY, py)
      })

      const width = Math.max(maxX - minX, 10)
      const height = Math.max(maxY - minY, 10)
      const relativePoints = points.map((p: any) => [p[0] - minX, p[1] - minY])

      layer.update({
        x: layer.get("x") + minX,
        y: layer.get("y") + minY,
        width,
        height,
        points: relativePoints,
      })
    } else if (type === "line" || type === "arrow") {
      if (!points || points.length < 3) return
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      points.forEach((p: any) => {
        minX = Math.min(minX, p.x)
        minY = Math.min(minY, p.y)
        maxX = Math.max(maxX, p.x)
        maxY = Math.max(maxY, p.y)
      })

      const width = Math.max(maxX - minX, 10)
      const height = Math.max(maxY - minY, 10)
      const relativePoints = points.map((p: any) => ({
        x: p.x - minX,
        y: p.y - minY,
      }))

      layer.update({
        x: layer.get("x") + minX,
        y: layer.get("y") + minY,
        width,
        height,
        points: relativePoints,
      })
    }
  }, [])

  const updateLayerField = useMutation(
    ({ storage }, id: string, field: keyof Layer, value) => {
      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(id)
      if (layer) layer.set(field, value)
    },
    []
  )

  const duplicateLayers = useMutation(
    ({ storage }, ids: Array<string>) => {
      const liveLayers = storage.get("layers")
      const liveLayerIds = storage.get("layerIds")

      history.pause()
      const newSelectedIds: Array<string> = []

      for (const id of ids) {
        const layer = liveLayers.get(id)
        if (!layer) continue

        const newId = nanoid()
        const data = layer.toObject() as Layer

        liveLayers.set(
          newId,
          new LiveObject({
            ...data,
            x: data.x + 40,
            y: data.y + 40,
          })
        )
        liveLayerIds.push(newId)
        newSelectedIds.push(newId)
      }

      if (newSelectedIds.length > 0) {
        setSelectedIds(newSelectedIds)
      }
      history.resume()
      return newSelectedIds
    },
    [setSelectedIds, history]
  )

  const bringToFront = useMutation(({ storage }, id: string) => {
    const liveLayerIds = storage.get("layerIds")
    const index = liveLayerIds.indexOf(id)
    if (index !== -1 && index !== liveLayerIds.length - 1) {
      liveLayerIds.move(index, liveLayerIds.length - 1)
    }
  }, [])

  const sendToBack = useMutation(({ storage }, id: string) => {
    const liveLayerIds = storage.get("layerIds")
    const index = liveLayerIds.indexOf(id)
    if (index !== -1 && index !== 0) {
      liveLayerIds.move(index, 0)
    }
  }, [])

  const moveForward = useMutation(({ storage }, id: string) => {
    const liveLayerIds = storage.get("layerIds")
    const index = liveLayerIds.indexOf(id)
    if (index !== -1 && index < liveLayerIds.length - 1) {
      liveLayerIds.move(index, index + 1)
    }
  }, [])

  const moveBackward = useMutation(({ storage }, id: string) => {
    const liveLayerIds = storage.get("layerIds")
    const index = liveLayerIds.indexOf(id)
    if (index !== -1 && index > 0) {
      liveLayerIds.move(index, index - 1)
    }
  }, [])

  const rotateLayer = useMutation(
    ({ storage }, id: string, rotation: number) => {
      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(id)
      if (layer) {
        layer.update({ rotation })
      }
    },
    []
  )

  const deleteLayer = useMutation(({ storage }, id: string) => {
    const liveLayers = storage.get("layers")
    const liveLayerIds = storage.get("layerIds")
    liveLayers.delete(id)
    const idx = liveLayerIds.indexOf(id)
    if (idx !== -1) liveLayerIds.delete(idx)
  }, [])

  const updatePath = useMutation(
    ({ storage }, id: string, points: Array<Array<number>>) => {
      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(id) as LiveObject<PathLayer> | undefined
      if (layer) {
        layer.set("points", points)
      }
    },
    []
  )

  const updateLinePoints = useMutation(
    ({ storage }, id: string, points: Array<{ x: number; y: number }>) => {
      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(id) as LiveObject<LineLayer> | undefined
      if (layer) {
        layer.set("points", points)
      }
    },
    []
  )

  const updateLayerDimensions = useMutation(
    (
      { storage },
      id: string,
      dimensions: { x: number; y: number; width: number; height: number }
    ) => {
      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(id)
      if (layer) {
        layer.update(dimensions)
      }
    },
    []
  )

  const updateLayerStyle = useMutation(
    ({ storage }, id: string, style: Partial<Layer>) => {
      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(id)
      if (layer) {
        layer.update(style)
      }
    },
    []
  )

  const zoomToFit = React.useCallback(() => {
    const bbox = getBoundingBox(layerIds)
    if (!bbox || !svgRef.current) return

    const { width: sw, height: sh } = svgRef.current.getBoundingClientRect()
    const padding = 100

    const zoom = Math.min(
      (sw - padding * 2) / bbox.width,
      (sh - padding * 2) / bbox.height,
      2 // Max zoom 200%
    )

    const cx = bbox.x + bbox.width / 2
    const cy = bbox.y + bbox.height / 2

    setCamera({
      x: sw / 2 - cx * zoom,
      y: sh / 2 - cy * zoom,
      zoom,
    })
  }, [layerIds, layers, getBoundingBox])

  const zoomIn = React.useCallback(() => {
    setCamera((c) => ({ ...c, zoom: Math.min(c.zoom * 1.2, 5) }))
  }, [])

  const zoomOut = React.useCallback(() => {
    setCamera((c) => ({ ...c, zoom: Math.max(c.zoom / 1.2, 0.1) }))
  }, [])

  const zoom100 = React.useCallback(() => {
    setCamera((c) => ({ ...c, zoom: 1 }))
  }, [])

  // ── Interaction Handlers ──────────────────────────────────────────────────

  const getCanvasPoint = (e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - camera.x) / camera.zoom,
      y: (e.clientY - rect.top - camera.y) / camera.zoom,
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const pt = getCanvasPoint(e)
    updateMyPresence({ cursor: { x: pt.x, y: pt.y } })

    if (isPanning) {
      setCamera((prev) => ({
        ...prev,
        x: prev.x + e.clientX - panStart.x,
        y: prev.y + e.clientY - panStart.y,
      }))
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }

    if (selectionBox) {
      setSelectionBox({
        ...selectionBox,
        width: pt.x - selectionBox.startX,
        height: pt.y - selectionBox.startY,
      })
      return
    }

    if (resizingLinePoint) {
      const { id, index } = resizingLinePoint
      const layer = layers.get(id) as LineLayer | undefined
      if (layer) {
        const ox = layer.x || 0
        const oy = layer.y || 0
        const newPoints = [...layer.points]
        const dx = pt.x - (ox + newPoints[index].x)
        const dy = pt.y - (oy + newPoints[index].y)

        newPoints[index] = { x: pt.x - ox, y: pt.y - oy }

        // Proportional midpoint update for endpoints
        if (index === 0 || index === 2) {
          newPoints[1] = {
            x: newPoints[1].x + dx / 2,
            y: newPoints[1].y + dy / 2,
          }
        }

        updateLinePoints(id, newPoints)
      }
      return
    }

    if (activeTool === "pen" && dragging) {
      const layer = layers.get(dragging.id) as PathLayer | undefined
      if (layer) {
        // Points are relative to layer.x, layer.y
        const newPoints = [...layer.points, [pt.x - layer.x, pt.y - layer.y]]
        updatePath(dragging.id, newPoints)
      }
      return
    }

    if ((activeTool === "line" || activeTool === "arrow") && dragging) {
      const layer = layers.get(dragging.id) as LineLayer | undefined
      if (layer) {
        const start = { x: 0, y: 0 }
        // Make end point relative to the layer's origin (x, y)
        const end = { x: pt.x - layer.x, y: pt.y - layer.y }
        const control = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2,
        }
        updateLinePoints(dragging.id, [start, control, end])
      }
      return
    }

    if (rotating) {
      const { id, startAngle, initialRotation } = rotating
      const layer = layers.get(id)
      if (!layer) return

      const cx = layer.x + layer.width / 2
      const cy = layer.y + layer.height / 2
      const currentAngle = Math.atan2(pt.y - cy, pt.x - cx)
      const rotation =
        ((currentAngle - startAngle) * 180) / Math.PI + initialRotation
      rotateLayer(id, rotation)
      return
    }

    if (resizing) {
      const { ids, handle, startBoundingBox, initialLayers, startX, startY } =
        resizing
      const dx = pt.x - startX
      const dy = pt.y - startY

      const newBoundingBox = { ...startBoundingBox }

      if (handle === "se") {
        newBoundingBox.width = Math.max(20, startBoundingBox.width + dx)
        newBoundingBox.height = Math.max(20, startBoundingBox.height + dy)
      } else if (handle === "sw") {
        newBoundingBox.x = startBoundingBox.x + dx
        newBoundingBox.width = Math.max(20, startBoundingBox.width - dx)
        newBoundingBox.height = Math.max(20, startBoundingBox.height + dy)
      } else if (handle === "ne") {
        newBoundingBox.y = startBoundingBox.y + dy
        newBoundingBox.width = Math.max(20, startBoundingBox.width + dx)
        newBoundingBox.height = Math.max(20, startBoundingBox.height - dy)
      } else if (handle === "nw") {
        newBoundingBox.x = startBoundingBox.x + dx
        newBoundingBox.y = startBoundingBox.y + dy
        newBoundingBox.width = Math.max(20, startBoundingBox.width - dx)
        newBoundingBox.height = Math.max(20, startBoundingBox.height - dy)
      } else if (handle === "e") {
        newBoundingBox.width = Math.max(20, startBoundingBox.width + dx)
      } else if (handle === "w") {
        newBoundingBox.x = startBoundingBox.x + dx
        newBoundingBox.width = Math.max(20, startBoundingBox.width - dx)
      } else if (handle === "s") {
        newBoundingBox.height = Math.max(20, startBoundingBox.height + dy)
      } else {
        newBoundingBox.y = startBoundingBox.y + dy
        newBoundingBox.height = Math.max(20, startBoundingBox.height - dy)
      }

      const scaleX = newBoundingBox.width / startBoundingBox.width
      const scaleY = newBoundingBox.height / startBoundingBox.height

      ids.forEach((id) => {
        const initial = initialLayers.get(id)
        if (!initial) return

        const relativeX = initial.x - startBoundingBox.x
        const relativeY = initial.y - startBoundingBox.y

        updateLayerDimensions(id, {
          x: newBoundingBox.x + relativeX * scaleX,
          y: newBoundingBox.y + relativeY * scaleY,
          width: initial.width * scaleX,
          height: initial.height * scaleY,
        })
      })
      return
    }

    if (dragging) {
      const dx = pt.x - dragging.startX
      const dy = pt.y - dragging.startY

      moveLayers(
        dragging.initialPositions.map((p) => ({
          id: p.id,
          x: p.x + dx,
          y: p.y + dy,
        }))
      )
      return
    }
  }

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null })
  }

  const handleSvgPointerDown = (e: React.PointerEvent) => {
    if (editingId) setEditingId(null)

    if (
      e.button === 1 ||
      (e.button === 0 && e.altKey) ||
      activeTool === "pan"
    ) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }

    if (activeTool === "select") {
      const pt = getCanvasPoint(e)
      const box = getBoundingBox(selectedIds)

      if (
        box &&
        pt.x >= box.x &&
        pt.x <= box.x + box.width &&
        pt.y >= box.y &&
        pt.y <= box.y + box.height
      ) {
        // Clicked inside the multi-selection bounding box (white space or element)
        const isMultiSelect = selectedIds.length > 1
        const primaryLayer = layers.get(selectedIds[0])
        const isHollow =
          primaryLayer && ["path", "line", "arrow"].includes(primaryLayer.type)

        // Only allow dragging from whitespace if it's a multi-selection
        // or a solid shape (not a path/line/arrow)
        if (isMultiSelect || !isHollow) {
          const initialPositions = selectedIds
            .map((sid) => {
              const l = layers.get(sid)
              if (!l) return null
              return { id: sid, x: l.x, y: l.y }
            })
            .filter(Boolean) as Array<{ id: string; x: number; y: number }>

          history.pause()
          setDragging({
            id: "selection-box-drag",
            startX: pt.x,
            startY: pt.y,
            initialPositions,
          })
          return
        }
      }

      // Otherwise, clear selection and start marquee
      setSelectedIds([])
      setSelectionBox({
        startX: pt.x,
        startY: pt.y,
        width: 0,
        height: 0,
      })
      return
    }

    const pt = getCanvasPoint(e)
    if (activeTool === "pen") {
      history.pause()
      const id = insertLayer({
        type: "path",
        x: pt.x,
        y: pt.y,
        width: 1,
        height: 1,
        fill: "#000000",
        points: [[0, 0]], // Start at relative origin
      })
      setDragging({
        id,
        startX: pt.x,
        startY: pt.y,
        initialPositions: [{ id, x: pt.x, y: pt.y }],
      })
      setSelectedIds([id])
      return
    }

    if (activeTool === "line" || activeTool === "arrow") {
      history.pause()
      const id = insertLayer({
        type: activeTool,
        x: pt.x,
        y: pt.y,
        width: 1,
        height: 1,
        fill: "#000000",
        stroke: "#000000",
        strokeWidth: 2,
        points: [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      })
      setDragging({
        id,
        startX: pt.x,
        startY: pt.y,
        initialPositions: [{ id, x: pt.x, y: pt.y }],
      })
      setSelectedIds([id])
      return
    }

    const fill =
      activeTool === "sticky"
        ? STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)]
        : SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)]

    const newLayer: Layer =
      activeTool === "text"
        ? {
            type: "text",
            x: pt.x,
            y: pt.y,
            width: 200,
            height: 40,
            text: "",
            fontSize: 18,
            fill: "#1a1a2e",
            textAlign: "left",
          }
        : {
            type: activeTool === "sticky" ? "sticky" : activeTool,
            x: pt.x,
            y: pt.y,
            width: activeTool === "sticky" ? 280 : 1,
            height: activeTool === "sticky" ? 320 : 1,
            fill,
            stroke: "#000000",
            strokeWidth: 2,
            text:
              activeTool === "sticky"
                ? "Add your detailed description here..."
                : undefined,
            title: activeTool === "sticky" ? "New Strategy" : undefined,
            badge: activeTool === "sticky" ? "STRATEGY" : undefined,
            textAlign: activeTool === "sticky" ? "left" : "center",
          }

    if (activeTool === "star") {
      ;(newLayer as ShapeLayer).starPoints = 5 // Default to 5-pointed star
    }

    history.pause()
    const id = insertLayer(newLayer)
    // Only auto-select shapes, not pen/line/arrow as requested
    if (
      activeTool !== "pen" &&
      activeTool !== "line" &&
      activeTool !== "arrow"
    ) {
      setSelectedIds([id])
    }

    if (
      ["rectangle", "circle", "triangle", "diamond", "star"].includes(
        activeTool
      )
    ) {
      const initialLayers = new Map()
      initialLayers.set(id, {
        x: newLayer.x,
        y: newLayer.y,
        width: newLayer.width,
        height: newLayer.height,
      })
      setResizing({
        ids: [id],
        handle: "se",
        startBoundingBox: { x: pt.x, y: pt.y, width: 1, height: 1 },
        initialLayers,
        startX: pt.x,
        startY: pt.y,
      })
    } else if (activeTool === "text" || activeTool === "sticky") {
      setEditingId(id)
    }

    setActiveTool("select")
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragging) {
      const pt = getCanvasPoint(e)
      const dx = pt.x - dragging.startX
      const dy = pt.y - dragging.startY
      const dist = Math.hypot(dx, dy)

      // If it was a click on the selection box without moving, clear selection
      if (dist < 5 && dragging.id === "selection-box-drag") {
        setSelectedIds([])
      }
    }

    if (selectionBox) {
      const box = {
        x: Math.min(
          selectionBox.startX,
          selectionBox.startX + selectionBox.width
        ),
        y: Math.min(
          selectionBox.startY,
          selectionBox.startY + selectionBox.height
        ),
        width: Math.abs(selectionBox.width),
        height: Math.abs(selectionBox.height),
      }

      const ids: Array<string> = []
      layers.forEach((layer, id) => {
        const isHollow = ["path", "line", "arrow"].includes(layer.type)

        if (isHollow) {
          // Point-based precision for hollow elements
          const points = layer.points
          const hasPointInside = points.some((p) => {
            const px = Array.isArray(p) ? p[0] : p.x
            const py = Array.isArray(p) ? p[1] : p.y
            const absX = layer.x + px
            const absY = layer.y + py
            return (
              absX >= box.x &&
              absX <= box.x + box.width &&
              absY >= box.y &&
              absY <= box.y + box.height
            )
          })
          if (hasPointInside) ids.push(id)
        } else {
          // Standard bounding box intersection for solid shapes
          if (
            layer.x < box.x + box.width &&
            layer.x + layer.width > box.x &&
            layer.y < box.y + box.height &&
            layer.y + layer.height > box.y
          ) {
            ids.push(id)
          }
        }
      })
      setSelectedIds(ids)
      setSelectionBox(null)
    }

    setDragging(null)
    if (activeTool === "line" || activeTool === "arrow") {
      const lastId = layerIds[layerIds.length - 1]
      const lastLayer = layers.get(lastId) as LineLayer | undefined
      if (lastLayer) {
        const dist = Math.hypot(
          lastLayer.points[2].x - lastLayer.points[0].x,
          lastLayer.points[2].y - lastLayer.points[0].y
        )
        if (dist < 5) {
          deleteLayer(lastId)
          setSelectedIds([])
        } else {
          finalizeLayer(lastId)
        }
      }
    }

    if (activeTool === "pen") {
      const lastId = layerIds[layerIds.length - 1]
      finalizeLayer(lastId)
    }

    setResizing(null)
    setRotating(null)
    setResizingLinePoint(null)
    if (activeTool !== "pan") setIsPanning(false)
    else if (isPanning) setIsPanning(false)

    history.resume()
  }

  const handleLayerPointerDown = (e: React.PointerEvent, id: string) => {
    if ((activeTool !== "select" && activeTool !== "pan") || editingId) return
    e.stopPropagation()
    if (activeTool === "pan") {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }
    const pt = getCanvasPoint(e)

    let newSelectedIds = selectedIds
    if (e.shiftKey) {
      newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    } else if (!selectedIds.includes(id)) {
      newSelectedIds = [id]
    }
    setSelectedIds(newSelectedIds)

    const initialPositions = newSelectedIds
      .map((sid) => {
        const l = layers.get(sid)
        if (!l) return null
        return { id: sid, x: l.x, y: l.y }
      })
      .filter(Boolean) as Array<{ id: string; x: number; y: number }>

    history.pause()
    setDragging({
      id,
      startX: pt.x,
      startY: pt.y,
      initialPositions,
    })
  }

  const handleLayerDoubleClick = (id: string, _layer: Layer) => {
    setEditingId(id)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const zoomDelta = -e.deltaY * 0.001

      setCamera((prev) => {
        const newZoom = Math.min(Math.max(prev.zoom + zoomDelta, 0.1), 5)
        const svg = svgRef.current
        if (!svg) return { ...prev, zoom: newZoom }

        const rect = svg.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // Zoom relative to mouse position
        return {
          zoom: newZoom,
          x: mouseX - ((mouseX - prev.x) / prev.zoom) * newZoom,
          y: mouseY - ((mouseY - prev.y) / prev.zoom) * newZoom,
        }
      })
    } else {
      setCamera((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }))
    }
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0 &&
        !editingId
      ) {
        const tag = document.activeElement?.tagName.toLowerCase()
        if (
          tag === "input" ||
          tag === "textarea" ||
          (document.activeElement as HTMLElement).isContentEditable
        )
          return
        selectedIds.forEach((id) => deleteLayer(id))
        setSelectedIds([])
      }
      if (e.key === "Escape") {
        setEditingId(null)
        setSelectedIds([])
        setActiveTool("select")
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          history.redo()
        } else {
          history.undo()
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        history.redo()
      }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault()
        if (selectedIds.length > 0) {
          duplicateLayers(selectedIds)
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selectedIds, editingId, deleteLayer, history, duplicateLayers])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#f0f2f9] dark:bg-[#0a0a12]">
      {/* Canvas */}
      <svg
        ref={svgRef}
        className={cn(
          "h-full w-full transition-transform duration-75 outline-none select-none",
          activeTool === "select" && "cursor-default",
          activeTool === "pan" &&
            (isPanning ? "cursor-grabbing" : "cursor-grab"),
          activeTool === "text" && "cursor-text",
          !["select", "pan", "text"].includes(activeTool) && "cursor-crosshair",
          (dragging || resizing || rotating) && "select-none"
        )}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handleSvgPointerDown}
        onPointerUp={(e) => handlePointerUp(e)}
        onWheel={handleWheel}
      >
        {/* Spatial Grid Pattern */}
        <defs>
          <pattern
            id="square-grid"
            x={camera.x}
            y={camera.y}
            width={40 * camera.zoom}
            height={40 * camera.zoom}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${40 * camera.zoom} 0 L 0 0 0 ${40 * camera.zoom}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/10"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#square-grid)" />

        {/* Layers Group */}
        <g
          transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`}
        >
          {/* Marquee Selection Box */}
          {selectionBox && (
            <rect
              className="fill-primary/5 stroke-primary"
              x={Math.min(
                selectionBox.startX,
                selectionBox.startX + selectionBox.width
              )}
              y={Math.min(
                selectionBox.startY,
                selectionBox.startY + selectionBox.height
              )}
              width={Math.abs(selectionBox.width)}
              height={Math.abs(selectionBox.height)}
              strokeWidth={1 / camera.zoom}
              strokeDasharray={`${4 / camera.zoom} ${4 / camera.zoom}`}
            />
          )}

          {layerIds.map((id) => {
            const layer = layers.get(id)
            if (!layer) return null
            return (
              <CanvasLayer
                key={id}
                id={id}
                layer={layer}
                isEditing={editingId === id}
                onPointerDown={handleLayerPointerDown}
                onDoubleClick={() => handleLayerDoubleClick(id, layer)}
                onFieldChange={(field, val) =>
                  updateLayerField(id, field as keyof Layer, val)
                }
                onResize={(_id, w, h) => {
                  updateLayerField(_id, "width", w)
                  updateLayerField(_id, "height", h)
                }}
              />
            )
          })}

          {/* Selection Handles & Box */}
          {selectedIds.length > 0 && !editingId && activeTool === "select" && (
            <SelectionHandles
              layer={
                selectedIds.length === 1
                  ? layers.get(selectedIds[0])
                  : {
                      ...(getBoundingBox(selectedIds) || {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                      }),
                      type: "selection",
                      rotation: 0,
                      fill: "transparent",
                    }
              }
              onResizeStart={(handle, e) => {
                history.pause()
                const pt = getCanvasPoint(e)
                const bbox = getBoundingBox(selectedIds)!
                const initialLayers = new Map()
                selectedIds.forEach((id) => {
                  const layer = layers.get(id)!
                  initialLayers.set(id, {
                    x: layer.x,
                    y: layer.y,
                    width: layer.width,
                    height: layer.height,
                  })
                })

                setResizing({
                  ids: selectedIds,
                  handle,
                  startBoundingBox: bbox,
                  initialLayers,
                  startX: pt.x,
                  startY: pt.y,
                })
              }}
              onRotateStart={(e) => {
                if (!primarySelectedId || selectedIds.length > 1) return // Disable rotation for multi-selection for now
                history.pause()
                const pt = getCanvasPoint(e)
                const layer = layers.get(primarySelectedId)!
                const cx = layer.x + layer.width / 2
                const cy = layer.y + layer.height / 2
                setRotating({
                  id: primarySelectedId,
                  startAngle: Math.atan2(pt.y - cy, pt.x - cx),
                  initialRotation: layer.rotation || 0,
                })
              }}
              onLinePointResizeStart={(index, _e) => {
                if (!primarySelectedId || selectedIds.length > 1) return
                history.pause()
                setResizingLinePoint({ id: primarySelectedId, index })
              }}
            />
          )}

          {/* Remote cursors */}
          {others.map(([connectionId, other]) =>
            other.cursor ? (
              <RemoteCursor
                key={connectionId}
                x={other.cursor.x}
                y={other.cursor.y}
                color={other.color}
                name={other.name}
              />
            ) : null
          )}
        </g>
      </svg>

      {/* ── Context Toolbar (Floating near selection) ── */}
      {primarySelectedId && layers.get(primarySelectedId) && (
        <ContextToolbar
          layer={layers.get(primarySelectedId)!}
          onUpdateStyle={(style) => {
            selectedIds.forEach((id) => updateLayerStyle(id, style))
          }}
          onDuplicate={() => {
            duplicateLayers(selectedIds)
          }}
          onDelete={() => {
            selectedIds.forEach((id) => deleteLayer(id))
            setSelectedIds([])
          }}
          onBringToFront={() => {
            selectedIds.forEach((id) => bringToFront(id))
          }}
          onSendToBack={() => {
            selectedIds.forEach((id) => sendToBack(id))
          }}
          onMoveForward={() => {
            selectedIds.forEach((id) => moveForward(id))
          }}
          onMoveBackward={() => {
            selectedIds.forEach((id) => moveBackward(id))
          }}
        />
      )}

      {/* ── Top Tool Sidebar (Horizontal Floating Pill) ── */}
      <div className="absolute top-16 left-1/2 z-40 -translate-x-1/2">
        <div className="bg-background/80 border-border flex items-center gap-1.5 rounded-lg border p-2 shadow-sm backdrop-blur-sm">
          <ToolButton
            active={activeTool === "rectangle"}
            onClick={() => setActiveTool("rectangle")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={RectangularIcon} size={18} />}
            tooltip="Rectangle (R)"
          />
          <ToolButton
            active={activeTool === "circle"}
            onClick={() => setActiveTool("circle")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={CircleIcon} size={18} />}
            tooltip="Circle (O)"
          />
          <ToolButton
            active={activeTool === "triangle"}
            onClick={() => setActiveTool("triangle")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={TriangleIcon} size={18} />}
            tooltip="Triangle (L)"
          />
          <ToolButton
            active={activeTool === "diamond"}
            onClick={() => setActiveTool("diamond")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={DiamondIcon} size={18} />}
            tooltip="Diamond (D)"
          />
          <ToolButton
            active={activeTool === "star"}
            onClick={() => setActiveTool("star")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={StarIcon} size={18} />}
            tooltip="Star (P)"
          />
          <Separator orientation="vertical" className="h-6" />
          <ToolButton
            active={activeTool === "sticky"}
            onClick={() => setActiveTool("sticky")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={StickyNote02Icon} size={18} />}
            tooltip="Sticky Note (S)"
          />
          <ToolButton
            active={activeTool === "text"}
            onClick={() => setActiveTool("text")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={TextFontIcon} size={18} />}
            tooltip="Text (T)"
          />
          <Separator orientation="vertical" className="h-6" />

          <ToolButton
            active={activeTool === "pen"}
            onClick={() => setActiveTool("pen")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={PaintBrush01Icon} size={18} />}
            tooltip="Pen (P)"
          />
          <ToolButton
            active={activeTool === "line"}
            onClick={() => setActiveTool("line")}
            className="cursor-pointer"
            icon={<HugeiconsIcon icon={LinerIcon} size={18} />}
            tooltip="Line (L)"
          />
          <ToolButton
            active={activeTool === "arrow"}
            onClick={() => setActiveTool("arrow")}
            className="cursor-pointer"
            icon={
              <HugeiconsIcon
                icon={ArrowUpRight02Icon}
                size={18}
                className="rotate-45"
              />
            }
            tooltip="Arrow (A)"
          />
        </div>
      </div>

      {/* ── Bottom Navigation Bar (Centered Floating Pill) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-background/80 border-border flex items-center gap-2 rounded-lg border px-2 py-1.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <NavButton
              active={activeTool === "select"}
              onClick={() => setActiveTool("select")}
              icon={
                <HugeiconsIcon icon={CursorMagicSelection04Icon} size={18} />
              }
              tooltip="Select (V)"
            />

            <NavButton
              active={activeTool === "pan"}
              onClick={() => setActiveTool("pan")}
              icon={<HugeiconsIcon icon={Hold03Icon} size={18} />}
              tooltip="Pan tool (H)"
            />
          </div>

          <div className="bg-border h-6 w-px" />

          <DropdownMenu>
            <DropdownMenuTrigger className="text-foreground/80 hover:bg-accent font-variant-numeric flex items-center gap-2 rounded-md px-2 py-1 text-[13px] font-bold tracking-tight transition-colors outline-none">
              {Math.round(camera.zoom * 100)}%
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="w-36">
              <DropdownMenuItem onClick={zoomToFit}>
                Zoom to fit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={zoomIn}>Zoom In</DropdownMenuItem>
              <DropdownMenuItem onClick={zoomOut}>Zoom Out</DropdownMenuItem>
              <DropdownMenuItem onClick={zoom100}>Zoom 100%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="bg-border h-6 w-px" />

          <div className="flex items-center gap-1">
            <NavButton
              active={false}
              onClick={() => history.undo()}
              icon={<HugeiconsIcon icon={Undo03Icon} size={18} />}
              tooltip="Undo (Ctrl+Z)"
            />
            <NavButton
              active={false}
              onClick={() => history.redo()}
              icon={<HugeiconsIcon icon={Redo03Icon} size={18} />}
              tooltip="Redo (Ctrl+Shift+Z)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

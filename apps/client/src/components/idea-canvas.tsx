import {
  ArrowUpRight02Icon,
  CircleIcon,
  CursorMagicSelection04Icon,
  DiamondIcon,
  Hold03Icon,
  Layers01Icon,
  LinerIcon,
  PaintBrush01Icon,
  RectangularIcon,
  StarIcon,
  StickyNote02Icon,
  TextFontIcon,
  TriangleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { LiveObject } from "@liveblocks/client"
import { shallow } from "@liveblocks/react"
import {
  useMutation,
  useOthersMapped,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense"
import { cn } from "@mindorbit/ui/lib/utils"
import { nanoid } from "nanoid"
import * as React from "react"

import { Separator } from "@mindorbit/ui/components/separator"
import { CanvasLayer } from "./canvas/canvas-layer"
import { SHAPE_COLORS, STICKY_COLORS } from "./canvas/constants"
import { ContextToolbar } from "./canvas/context-toolbar"
import { RemoteCursor } from "./canvas/remote-cursor"
import { SelectionHandles } from "./canvas/selection-handles"
import { NavButton, ToolButton } from "./canvas/toolbars"

import type { Layer, LineLayer, PathLayer } from "@/lib/liveblocks.config"

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
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState<{
    id: string
    startX: number
    startY: number
    layerX: number
    layerY: number
  } | null>(null)
  const [camera, setCamera] = React.useState({ x: 0, y: 0, zoom: 1 })
  const [isPanning, setIsPanning] = React.useState(false)
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 })
  const [resizing, setResizing] = React.useState<{
    id: string
    handle: "nw" | "ne" | "sw" | "se"
    startRect: { x: number; y: number; width: number; height: number }
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
  const svgRef = React.useRef<SVGSVGElement>(null)

  const updateMyPresence = useUpdateMyPresence()

  // Pull layers from Liveblocks storage
  const layers = useStorage((root) => {
    const map = new Map<string, Layer>()
    if (root.layers) {
      for (const [id, obj] of Object.entries(root.layers)) {
        map.set(id, obj as Layer)
      }
    }
    return map
  }, shallow)

  const layerIds = useStorage((root) =>
    root.layerIds ? [...root.layerIds] : []
  )

  // Remote cursors
  const others = useOthersMapped(
    (other) => ({
      cursor: other.presence.cursor,
      color: other.info?.color || "#6366f1",
      name: other.info?.name || "Anonymous",
    }),
    shallow
  )

  // ── Mutations ─────────────────────────────────────────────────────────────

  const insertLayer = useMutation(({ storage }, layer: Layer) => {
    const id = nanoid()
    const layers = storage.get("layers")
    const layerIds = storage.get("layerIds")
    if (layers && layerIds) {
      layers.set(id, new LiveObject(layer))
      layerIds.push(id)
    }
    return id
  }, [])

  const moveLayer = useMutation(
    ({ storage }, id: string, x: number, y: number) => {
      const layer = storage.get("layers")?.get(id)
      if (layer) {
        layer.update({ x, y })
      }
    },
    []
  )

  const updateLayerText = useMutation(
    ({ storage }, id: string, text: string) => {
      const layers = storage.get("layers")
      const layer = layers?.get(id)
      if (layer) {
        layer.set("text", text)
      }
    },
    []
  )

  const duplicateLayer = useMutation(({ storage }, id: string) => {
    const layers = storage.get("layers")
    const layerIds = storage.get("layerIds")
    const layer = layers?.get(id)
    if (!layer || !layerIds) return

    const newId = nanoid()
    const data = layer.toObject()

    layers.set(
      newId,
      new LiveObject({
        ...data,
        x: data.x + 20,
        y: data.y + 20,
      })
    )
    layerIds.push(newId)
    setSelectedId(newId)
  }, [])

  const rotateLayer = useMutation(
    ({ storage }, id: string, rotation: number) => {
      const layer = storage.get("layers")?.get(id)
      if (layer) {
        layer.update({ rotation })
      }
    },
    []
  )

  const deleteLayer = useMutation(({ storage }, id: string) => {
    storage.get("layers")?.delete(id)
    const ids = storage.get("layerIds")
    if (ids) {
      const idx = ids.indexOf(id)
      if (idx !== -1) ids.delete(idx)
    }
  }, [])

  const updatePath = useMutation(
    ({ storage }, id: string, points: Array<Array<number>>) => {
      const layer = storage.get("layers")?.get(id) as
        | LiveObject<PathLayer>
        | undefined
      if (layer) {
        layer.set("points", points)
      }
    },
    []
  )

  const updateLinePoints = useMutation(
    ({ storage }, id: string, points: Array<{ x: number; y: number }>) => {
      const layer = storage.get("layers")?.get(id) as
        | LiveObject<LineLayer>
        | undefined
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
      dimensions: Partial<{
        x: number
        y: number
        width: number
        height: number
      }>
    ) => {
      const layer = storage.get("layers")?.get(id)
      if (layer) {
        layer.update(dimensions)
      }
    },
    []
  )

  const updateLayerStyle = useMutation(
    (
      { storage },
      id: string,
      style: Partial<{ fill: string; stroke: string; strokeWidth: number }>
    ) => {
      const layer = storage.get("layers")?.get(id)
      if (layer) {
        layer.update(style)
      }
    },
    []
  )

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

    if (resizingLinePoint) {
      const { id, index } = resizingLinePoint
      const layer = layers.get(id) as LineLayer | undefined
      if (layer) {
        const newPoints = [...layer.points]
        newPoints[index] = { x: pt.x, y: pt.y }
        updateLinePoints(id, newPoints)
      }
      return
    }

    if (activeTool === "pen" && dragging) {
      const layer = layers.get(dragging.id) as PathLayer | undefined
      if (layer) {
        const newPoints = [...layer.points, [pt.x, pt.y]]
        updatePath(dragging.id, newPoints)
      }
      return
    }

    if ((activeTool === "line" || activeTool === "arrow") && dragging) {
      const layer = layers.get(dragging.id) as LineLayer | undefined
      if (layer) {
        const start = layer.points[0]
        const end = { x: pt.x, y: pt.y }
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
      const { id, handle, startRect, startX, startY } = resizing
      const dx = pt.x - startX
      const dy = pt.y - startY

      const newRect = { ...startRect }

      if (handle === "se") {
        newRect.width = Math.max(20, startRect.width + dx)
        newRect.height = Math.max(20, startRect.height + dy)
      } else if (handle === "sw") {
        newRect.x = startRect.x + dx
        newRect.width = Math.max(20, startRect.width - dx)
        newRect.height = Math.max(20, startRect.height + dy)
      } else if (handle === "ne") {
        newRect.y = startRect.y + dy
        newRect.width = Math.max(20, startRect.width + dx)
        newRect.height = Math.max(20, startRect.height - dy)
      } else {
        newRect.x = startRect.x + dx
        newRect.y = startRect.y + dy
        newRect.width = Math.max(20, startRect.width - dx)
        newRect.height = Math.max(20, startRect.height - dy)
      }

      updateLayerDimensions(id, newRect)
      return
    }

    if (dragging) {
      moveLayer(
        dragging.id,
        dragging.layerX + (pt.x - dragging.startX),
        dragging.layerY + (pt.y - dragging.startY)
      )
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
      setSelectedId(null)
      return
    }

    const pt = getCanvasPoint(e)
    if (activeTool === "pen") {
      const id = insertLayer({
        type: "path",
        x: pt.x,
        y: pt.y,
        width: 1,
        height: 1,
        fill: "#000000",
        points: [[pt.x, pt.y]],
      } as any)
      setDragging({
        id,
        startX: pt.x,
        startY: pt.y,
        layerX: pt.x,
        layerY: pt.y,
      })
      setSelectedId(id)
      return
    }

    if (activeTool === "line" || activeTool === "arrow") {
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
          { x: pt.x, y: pt.y },
          { x: pt.x, y: pt.y },
          { x: pt.x, y: pt.y },
        ],
      } as any)
      setDragging({
        id,
        startX: pt.x,
        startY: pt.y,
        layerX: pt.x,
        layerY: pt.y,
      })
      setSelectedId(id)
      return
    }

    const fill =
      activeTool === "sticky"
        ? STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)]
        : SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)]

    const newLayer: Layer =
      activeTool === "text"
        ? ({
            type: "text",
            x: pt.x,
            y: pt.y,
            width: 200,
            height: 40,
            text: "Text",
            fontSize: 18,
            fill: "#1a1a2e",
          } as any)
        : ({
            type: activeTool === "sticky" ? "sticky" : activeTool,
            x: pt.x,
            y: pt.y,
            width: activeTool === "sticky" ? 240 : 120,
            height: activeTool === "sticky" ? 200 : 80,
            fill,
            stroke: "#000000",
            strokeWidth: 2,
            text:
              activeTool === "sticky"
                ? "Write your thoughts here..."
                : undefined,
          } as any)

    if (activeTool === "star") {
      ;(newLayer as any).points = 5 // Default to 5-pointed star
    }

    const id = insertLayer(newLayer)
    setSelectedId(id)
    if (activeTool === "text" || activeTool === "sticky") {
      setEditingId(id)
    }
    setActiveTool("select")
  }

  const handlePointerUp = () => {
    setDragging(null)
    setResizing(null)
    setRotating(null)
    setResizingLinePoint(null)
    if (activeTool !== "pan") setIsPanning(false)
    else if (isPanning) setIsPanning(false)
  }

  const handleLayerPointerDown = (
    e: React.PointerEvent,
    id: string,
    layer: Layer
  ) => {
    if ((activeTool !== "select" && activeTool !== "pan") || editingId) return
    e.stopPropagation()
    if (activeTool === "pan") {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }
    const pt = getCanvasPoint(e)
    setSelectedId(id)
    setDragging({
      id,
      startX: pt.x,
      startY: pt.y,
      layerX: layer.x,
      layerY: layer.y,
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
        selectedId &&
        !editingId
      ) {
        const tag = document.activeElement?.tagName.toLowerCase()
        if (
          tag === "input" ||
          tag === "textarea" ||
          (document.activeElement as HTMLElement).isContentEditable
        )
          return
        deleteLayer(selectedId)
        setSelectedId(null)
      }
      if (e.key === "Escape") {
        setEditingId(null)
        setSelectedId(null)
        setActiveTool("select")
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selectedId, editingId, deleteLayer])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#f0f2f9] dark:bg-[#0a0a12]">
      {/* Canvas */}
      <svg
        ref={svgRef}
        className={cn(
          "h-full w-full transition-transform duration-75 outline-none",
          activeTool === "select" && "cursor-default",
          activeTool === "pan" &&
            (isPanning ? "cursor-grabbing" : "cursor-grab"),
          activeTool === "text" && "cursor-text",
          !["select", "pan", "text"].includes(activeTool) && "cursor-crosshair"
        )}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handleSvgPointerDown}
        onPointerUp={handlePointerUp}
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
          {layerIds.map((id) => {
            const layer = layers.get(id)
            if (!layer) return null
            return (
              <CanvasLayer
                key={id}
                id={id}
                layer={layer}
                isSelected={selectedId === id}
                isEditing={editingId === id}
                onPointerDown={handleLayerPointerDown}
                onDoubleClick={() => handleLayerDoubleClick(id, layer)}
                onTextChange={(val) => updateLayerText(id, val)}
              />
            )
          })}

          {/* Selection Handles & Box */}
          {selectedId && !editingId && layers.get(selectedId) && (
            <SelectionHandles
              layer={layers.get(selectedId)!}
              onResizeStart={(handle, e) => {
                const pt = getCanvasPoint(e)
                const layer = layers.get(selectedId)!
                setResizing({
                  id: selectedId,
                  handle,
                  startRect: {
                    x: layer.x,
                    y: layer.y,
                    width: layer.width,
                    height: layer.height,
                  },
                  startX: pt.x,
                  startY: pt.y,
                })
              }}
              onRotateStart={(e) => {
                const pt = getCanvasPoint(e)
                const layer = layers.get(selectedId)!
                const cx = layer.x + layer.width / 2
                const cy = layer.y + layer.height / 2
                setRotating({
                  id: selectedId,
                  startAngle: Math.atan2(pt.y - cy, pt.x - cx),
                  initialRotation: layer.rotation || 0,
                })
              }}
              onLinePointResizeStart={(index, _e) => {
                setResizingLinePoint({ id: selectedId, index })
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
      {selectedId && !editingId && layers.get(selectedId) && (
        <ContextToolbar
          layer={layers.get(selectedId)!}
          onUpdateStyle={(style) => updateLayerStyle(selectedId, style)}
          onDuplicate={() => duplicateLayer(selectedId)}
          onDelete={() => {
            deleteLayer(selectedId)
            setSelectedId(null)
          }}
          camera={camera}
        />
      )}

      {/* ── Left Tool Sidebar (Vertical Floating Pill) ── */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2">
        <div className="bg-background/80 border-border flex flex-col items-center gap-1.5 rounded-lg border p-2 shadow-lg backdrop-blur-lg">
          <ToolButton
            active={activeTool === "rectangle"}
            onClick={() => setActiveTool("rectangle")}
            icon={<HugeiconsIcon icon={RectangularIcon} size={18} />}
            tooltip="Rectangle (R)"
          />
          <ToolButton
            active={activeTool === "circle"}
            onClick={() => setActiveTool("circle")}
            icon={<HugeiconsIcon icon={CircleIcon} size={18} />}
            tooltip="Circle (O)"
          />
          <ToolButton
            active={activeTool === "triangle"}
            onClick={() => setActiveTool("triangle")}
            icon={<HugeiconsIcon icon={TriangleIcon} size={18} />}
            tooltip="Triangle (L)"
          />
          <ToolButton
            active={activeTool === "diamond"}
            onClick={() => setActiveTool("diamond")}
            icon={<HugeiconsIcon icon={DiamondIcon} size={18} />}
            tooltip="Diamond (D)"
          />
          <ToolButton
            active={activeTool === "star"}
            onClick={() => setActiveTool("star")}
            icon={<HugeiconsIcon icon={StarIcon} size={18} />}
            tooltip="Star (P)"
          />
          <Separator />
          <ToolButton
            active={activeTool === "sticky"}
            onClick={() => setActiveTool("sticky")}
            icon={<HugeiconsIcon icon={StickyNote02Icon} size={18} />}
            tooltip="Sticky Note (S)"
          />
          <ToolButton
            active={activeTool === "text"}
            onClick={() => setActiveTool("text")}
            icon={<HugeiconsIcon icon={TextFontIcon} size={18} />}
            tooltip="Text (T)"
          />
          <Separator />

          <ToolButton
            active={activeTool === "pen"}
            onClick={() => setActiveTool("pen")}
            icon={<HugeiconsIcon icon={PaintBrush01Icon} size={18} />}
            tooltip="Pen (P)"
          />
          <ToolButton
            active={activeTool === "line"}
            onClick={() => setActiveTool("line")}
            icon={<HugeiconsIcon icon={LinerIcon} size={18} />}
            tooltip="Line (L)"
          />
          <ToolButton
            active={activeTool === "arrow"}
            onClick={() => setActiveTool("arrow")}
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
        <div className="bg-background/80 border-border flex items-center gap-4 rounded-lg border px-4 py-2 shadow-xl backdrop-blur-xl">
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

          <div className="text-foreground/80 flex items-center gap-2 px-2 text-[13px] font-bold tracking-tight">
            {Math.round(camera.zoom * 100)}%
          </div>

          <div className="bg-border h-6 w-px" />

          <NavButton
            active={false}
            onClick={() => {}}
            icon={<HugeiconsIcon icon={Layers01Icon} size={18} />}
            tooltip="Layers"
          />
        </div>
      </div>
    </div>
  )
}

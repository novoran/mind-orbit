import {
  CircleIcon,
  Cursor02Icon,
  RectangularIcon,
  Square01Icon,
  StickyNote01Icon,
  TextIcon,
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

import { Button } from "@mindorbit/ui/components/button"

import type { Layer, ShapeLayer, TextLayer } from "@/lib/liveblocks.config"

// ────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ────────────────────────────────────────────────────────────────────────────

type CanvasTool =
  | "select"
  | "rectangle"
  | "circle"
  | "diamond"
  | "triangle"
  | "sticky"
  | "text"

const SHAPE_COLORS = [
  "#fbbf24", // amber
  "#34d399", // emerald
  "#60a5fa", // blue
  "#f87171", // red
  "#a78bfa", // violet
  "#fb923c", // orange
  "#2dd4bf", // teal
  "#e879f9", // fuchsia
]

const STICKY_COLORS = [
  "#fef08a", // yellow
  "#bbf7d0", // green
  "#bfdbfe", // blue
  "#fecaca", // red
  "#e9d5ff", // purple
  "#fed7aa", // orange
]

// ────────────────────────────────────────────────────────────────────────────
// Canvas Component
// ────────────────────────────────────────────────────────────────────────────

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
  const [camera, setCamera] = React.useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = React.useState(false)
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 })
  const svgRef = React.useRef<SVGSVGElement>(null)

  const updateMyPresence = useUpdateMyPresence()

  // Pull layers from Liveblocks storage
  const layers = useStorage((root) => {
    const map = new Map<string, Layer>()
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
      color: other.info.color,
      name: other.info.name,
    }),
    shallow
  )

  // ── Mutations ─────────────────────────────────────────────────────────────

  const insertLayer = useMutation(({ storage }, layer: Layer) => {
    const id = nanoid()
    storage.get("layers").set(id, new LiveObject(layer))
    storage.get("layerIds").push(id)
    return id
  }, [])

  const moveLayer = useMutation(
    ({ storage }, id: string, x: number, y: number) => {
      const layer = storage.get("layers").get(id)
      if (layer) {
        layer.update({ x, y })
      }
    },
    []
  )

  const updateLayerText = useMutation(
    ({ storage }, id: string, text: string) => {
      const layer = storage.get("layers").get(id)
      if (layer) {
        layer.update({ text })
      }
    },
    []
  )

  const deleteLayer = useMutation(({ storage }, id: string) => {
    storage.get("layers").delete(id)
    const ids = storage.get("layerIds")
    const idx = ids.indexOf(id)
    if (idx !== -1) ids.delete(idx)
  }, [])

  // ── Interaction Handlers ──────────────────────────────────────────────────

  const getCanvasPoint = (e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    return {
      x: e.clientX - rect.left - camera.x,
      y: e.clientY - rect.top - camera.y,
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const pt = getCanvasPoint(e)
    updateMyPresence({ cursor: { x: pt.x, y: pt.y } })

    if (isPanning) {
      setCamera((prev) => ({
        x: prev.x + e.clientX - panStart.x,
        y: prev.y + e.clientY - panStart.y,
      }))
      setPanStart({ x: e.clientX, y: e.clientY })
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
    // If we click off an editing element, stop editing
    if (editingId) setEditingId(null)

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }

    if (activeTool === "select") {
      setSelectedId(null)
      return
    }

    const pt = getCanvasPoint(e)
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
          } as TextLayer)
        : ({
            type: activeTool,
            x: pt.x,
            y: pt.y,
            width: activeTool === "sticky" ? 180 : 120,
            height: activeTool === "sticky" ? 180 : 80,
            fill,
            text: activeTool === "sticky" ? "Sticky note" : undefined,
          } as ShapeLayer)

    const id = insertLayer(newLayer)
    setSelectedId(id)
    setActiveTool("select")
  }

  const handlePointerUp = () => {
    setDragging(null)
    setIsPanning(false)
  }

  const handleLayerPointerDown = (
    e: React.PointerEvent,
    id: string,
    layer: Layer
  ) => {
    if (activeTool !== "select" || editingId) return
    e.stopPropagation()
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

  const handleLayerDoubleClick = (id: string, layer: Layer) => {
    if (layer.type === "sticky" || layer.type === "text") {
      setEditingId(id)
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
    <div className="relative flex h-full flex-col overflow-hidden bg-[#f8f9ff] dark:bg-[#0d0e1a]">
      {/* Canvas */}
      <svg
        ref={svgRef}
        className={cn(
          "flex-1 outline-none",
          activeTool !== "select" && "cursor-crosshair",
          isPanning && "cursor-grabbing"
        )}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handleSvgPointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Dot grid */}
        <defs>
          <pattern
            id="dot-grid"
            x={camera.x % 40}
            y={camera.y % 40}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1"
              cy="1"
              r="1"
              fill="currentColor"
              className="text-gray-300 dark:text-gray-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />

        {/* Layers */}
        <g transform={`translate(${camera.x}, ${camera.y})`}>
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

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
      </div>

      {/* Bottom hint */}
      <div className="text-muted-foreground absolute bottom-20 left-1/2 -translate-x-1/2 text-[10px] font-medium tracking-wider opacity-50 transition-opacity hover:opacity-100">
        {activeTool === "select"
          ? "DRAG TO MOVE • DOUBLE CLICK TEXT TO EDIT • ALT+DRAG TO PAN"
          : `CLICK TO PLACE ${activeTool.toUpperCase()}`}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Canvas Layer Renderer
// ────────────────────────────────────────────────────────────────────────────

function CanvasLayer({
  id,
  layer,
  isSelected,
  isEditing,
  onPointerDown,
  onDoubleClick,
  onTextChange,
}: {
  id: string
  layer: Layer
  isSelected: boolean
  isEditing: boolean
  onPointerDown: (e: React.PointerEvent, id: string, layer: Layer) => void
  onDoubleClick: () => void
  onTextChange: (val: string) => void
}) {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return
    onPointerDown(e, id, layer)
  }

  const commonProps = {
    onPointerDown: handlePointerDown,
    onDoubleClick,
    style: { cursor: isEditing ? "text" : "grab" },
  }

  if (layer.type === "sticky") {
    return (
      <g {...commonProps}>
        <rect
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          rx={4}
          fill={layer.fill}
          stroke={isSelected ? "#6366f1" : "transparent"}
          strokeWidth={2}
          className="transition-all duration-200"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        />
        <foreignObject
          x={layer.x + 12}
          y={layer.y + 12}
          width={layer.width - 24}
          height={layer.height - 24}
          style={{ pointerEvents: isEditing ? "all" : "none" }}
        >
          {isEditing ? (
            <textarea
              autoFocus
              className="h-full w-full resize-none border-none bg-transparent p-0 leading-relaxed font-medium text-[#1a1a2e] outline-none"
              defaultValue={layer.text || ""}
              onBlur={(e) => onTextChange(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="line-clamp-6 h-full w-full leading-relaxed font-medium text-[#1a1a2e]">
              {layer.text || ""}
            </div>
          )}
        </foreignObject>
      </g>
    )
  }

  if (layer.type === "text") {
    return (
      <g {...commonProps}>
        <foreignObject
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          style={{ pointerEvents: isEditing ? "all" : "none" }}
        >
          {isEditing ? (
            <input
              autoFocus
              className="w-full border-none bg-transparent p-0 font-semibold text-[#1a1a2e] outline-none"
              style={{ fontSize: layer.fontSize }}
              defaultValue={layer.text || ""}
              onBlur={(e) => onTextChange(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          ) : (
            <div
              className={cn(
                "w-full truncate font-semibold text-[#1a1a2e]",
                isSelected &&
                  "bg-primary/5 ring-primary/20 rounded-sm px-1 ring-1"
              )}
              style={{ fontSize: layer.fontSize }}
            >
              {layer.text || "Text"}
            </div>
          )}
        </foreignObject>
      </g>
    )
  }

  // Shapes
  const ShapeTag =
    layer.type === "circle"
      ? "ellipse"
      : layer.type === "rectangle"
        ? "rect"
        : "polygon"
  const shapeProps: any = {
    ...commonProps,
    fill: layer.fill + "cc",
    stroke: isSelected ? "#6366f1" : layer.fill,
    strokeWidth: isSelected ? 2 : 1.5,
  }

  if (layer.type === "rectangle") {
    shapeProps.x = layer.x
    shapeProps.y = layer.y
    shapeProps.width = layer.width
    shapeProps.height = layer.height
    shapeProps.rx = 8
  } else if (layer.type === "circle") {
    shapeProps.cx = layer.x + layer.width / 2
    shapeProps.cy = layer.y + layer.height / 2
    shapeProps.rx = layer.width / 2
    shapeProps.ry = layer.height / 2
  } else if (layer.type === "diamond") {
    const cx = layer.x + layer.width / 2
    const cy = layer.y + layer.height / 2
    shapeProps.points = `${cx},${layer.y} ${layer.x + layer.width},${cy} ${cx},${layer.y + layer.height} ${layer.x},${cy}`
  } else {
    shapeProps.points = `${layer.x + layer.width / 2},${layer.y} ${layer.x + layer.width},${layer.y + layer.height} ${layer.x},${layer.y + layer.height}`
  }

  return <ShapeTag {...shapeProps} />
}

// ────────────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────────────

function RemoteCursor({
  x,
  y,
  color,
  name,
}: {
  x: number
  y: number
  color: string
  name: string
}) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <path
        d={`M ${x} ${y} L ${x + 7} ${y + 16} L ${x + 13} ${y + 13} L ${x + 16} ${y + 19} L ${x + 19} ${y + 13} L ${x + 13} ${y + 10} L ${x + 19} ${y + 5} Z`}
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
      <rect
        x={x + 18}
        y={y + 12}
        width={name.length * 7 + 10}
        height={18}
        rx={4}
        fill={color}
      />
      <text x={x + 23} y={y + 25} fontSize="10" fill="white" fontWeight="600">
        {name}
      </text>
    </g>
  )
}

function CanvasToolbar({
  activeTool,
  onToolChange,
}: {
  activeTool: CanvasTool
  onToolChange: (t: CanvasTool) => void
}) {
  const tools = [
    { id: "select", icon: Cursor02Icon, color: "#6366f1" },
    { id: "rectangle", icon: RectangularIcon, color: "#f87171" },
    { id: "circle", icon: CircleIcon, color: "#34d399" },
    { id: "diamond", icon: Square01Icon, color: "#fbbf24" },
    { id: "triangle", icon: TriangleIcon, color: "#a78bfa" },
    { id: "sticky", icon: StickyNote01Icon, color: "#fb923c" },
    { id: "text", icon: TextIcon, color: "#64748b" },
  ] as const

  return (
    <div className="flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/70 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          variant={"ghost"}
          size={"icon"}
          className={
            "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300"
          }
        >
          <HugeiconsIcon
            icon={tool.icon}
            size={20}
            strokeWidth={2}
            className={cn(
              "transition-colors duration-300",
              activeTool === tool.id
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          {activeTool === tool.id && (
            <div
              className="absolute -bottom-1 h-1 w-1 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
          )}
        </Button>
      ))}
    </div>
  )
}

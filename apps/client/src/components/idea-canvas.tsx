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
import { cn } from "@mindorbit/ui/lib/utils"
import { nanoid } from "nanoid"
import * as React from "react"

import type { Layer, ShapeLayer } from "@/lib/liveblocks.config"
import {
  useMutation,
  useOthersMapped,
  useStorage,
  useUpdateMyPresence,
} from "@/lib/liveblocks.config"
// ────────────────────────────────────────────────────────────────────────────
// Types
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

  // Pull layers from Liveblocks storage with shallow equality to prevent re-renders
  const layers = useStorage((root) => {
    // In Liveblocks v3 snapshots, layers is a Map-like object
    const map = new Map<string, Layer>()
    root.layers.forEach((obj, id) => {
      map.set(id, obj as Layer)
    })
    return map
  }, shallow)

  const layerIds = useStorage((root) => [...root.layerIds])

  // Remote cursors
  const others = useOthersMapped(
    (other) => ({
      cursor: other.presence.cursor,
      color: other.info?.color ?? "#6366f1",
      name: other.info?.name ?? "Anonymous",
    }),
    shallow
  )

  // ── Mutations ─────────────────────────────────────────────────────────────

  const insertLayer = useMutation(({ storage }, layer: Layer) => {
    const id = nanoid()
    // Explicitly cast to ShapeLayer for LiveObject constructor
    storage.get("layers").set(id, new LiveObject(layer as ShapeLayer))
    storage.get("layerIds").push(id)
    return id
  }, [])

  const moveLayer = useMutation(
    ({ storage }, id: string, x: number, y: number) => {
      const layer = storage.get("layers").get(id)
      if (layer) {
        layer.set("x", x)
        layer.set("y", y)
      }
    },
    []
  )

  const deleteLayer = useMutation(({ storage }, id: string) => {
    storage.get("layers").delete(id)
    const ids = storage.get("layerIds")
    const idx = ids.toArray().indexOf(id)
    if (idx !== -1) ids.delete(idx)
  }, [])

  // ── Pointer events ────────────────────────────────────────────────────────

  const getCanvasPoint = (e: React.PointerEvent) => {
    const svg = svgRef.current!
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

    insertLayer({
      type: activeTool === "text" ? "text" : activeTool,
      x: pt.x,
      y: pt.y,
      width: activeTool === "sticky" ? 180 : activeTool === "text" ? 200 : 120,
      height: activeTool === "sticky" ? 180 : activeTool === "text" ? 40 : 80,
      fill,
      text:
        activeTool === "sticky"
          ? "Write here..."
          : activeTool === "text"
            ? "Text"
            : undefined,
    } as ShapeLayer)

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
    if (activeTool !== "select") return
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

  // ── Keyboard ──────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        // Only if not focused in an input/textarea
        const tag = document.activeElement?.tagName.toLowerCase()
        if (
          tag === "input" ||
          tag === "textarea" ||
          (document.activeElement as HTMLElement)?.isContentEditable
        )
          return
        deleteLayer(selectedId)
        setSelectedId(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selectedId, deleteLayer])

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />

      {/* Canvas */}
      <svg
        ref={svgRef}
        className={cn(
          "flex-1 bg-[#f8f9ff] dark:bg-[#0d0e1a]",
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
          {layerIds?.map((id) => {
            const layer = layers?.get(id)
            if (!layer) return null
            return (
              <CanvasLayer
                key={id}
                id={id}
                layer={layer}
                isSelected={selectedId === id}
                onPointerDown={handleLayerPointerDown}
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

      {/* Bottom hint */}
      <div className="bg-background/80 text-muted-foreground border-border absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-xs backdrop-blur">
        {activeTool === "select"
          ? "Click a shape to select • Delete to remove • Alt+drag to pan"
          : `Click to place a ${activeTool}`}
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
  onPointerDown,
}: {
  id: string
  layer: Layer
  isSelected: boolean
  onPointerDown: (e: React.PointerEvent, id: string, layer: Layer) => void
}) {
  const shape = layer as ShapeLayer

  const selectionProps = {
    onPointerDown: (e: React.PointerEvent) => onPointerDown(e, id, layer),
    style: { cursor: "grab" },
  }

  if (shape.type === "sticky") {
    return (
      <g {...selectionProps}>
        <rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={4}
          fill={shape.fill}
          stroke={isSelected ? "#6366f1" : "transparent"}
          strokeWidth={isSelected ? 2 : 0}
          filter={
            isSelected
              ? "drop-shadow(0 0 6px rgba(99,102,241,0.5))"
              : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
          }
        />
        <foreignObject
          x={shape.x + 8}
          y={shape.y + 8}
          width={shape.width - 16}
          height={shape.height - 16}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "inherit",
              fontSize: 13,
              color: "#1a1a2e",
              wordBreak: "break-word",
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1.5,
            }}
          >
            {shape.text || ""}
          </div>
        </foreignObject>
      </g>
    )
  }

  if (shape.type === "rectangle") {
    return (
      <rect
        {...selectionProps}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rx={8}
        fill={shape.fill + "cc"}
        stroke={isSelected ? "#6366f1" : shape.fill}
        strokeWidth={isSelected ? 2 : 1.5}
        filter={
          isSelected ? "drop-shadow(0 0 6px rgba(99,102,241,0.5))" : undefined
        }
      />
    )
  }

  if (shape.type === "circle") {
    return (
      <ellipse
        {...selectionProps}
        cx={shape.x + shape.width / 2}
        cy={shape.y + shape.height / 2}
        rx={shape.width / 2}
        ry={shape.height / 2}
        fill={shape.fill + "cc"}
        stroke={isSelected ? "#6366f1" : shape.fill}
        strokeWidth={isSelected ? 2 : 1.5}
        filter={
          isSelected ? "drop-shadow(0 0 6px rgba(99,102,241,0.5))" : undefined
        }
      />
    )
  }

  if (shape.type === "diamond") {
    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2
    const points = `${cx},${shape.y} ${shape.x + shape.width},${cy} ${cx},${shape.y + shape.height} ${shape.x},${cy}`
    return (
      <polygon
        {...selectionProps}
        points={points}
        fill={shape.fill + "cc"}
        stroke={isSelected ? "#6366f1" : shape.fill}
        strokeWidth={isSelected ? 2 : 1.5}
        filter={
          isSelected ? "drop-shadow(0 0 6px rgba(99,102,241,0.5))" : undefined
        }
      />
    )
  }

  if (shape.type === "triangle") {
    const points = `${shape.x + shape.width / 2},${shape.y} ${shape.x + shape.width},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}`
    return (
      <polygon
        {...selectionProps}
        points={points}
        fill={shape.fill + "cc"}
        stroke={isSelected ? "#6366f1" : shape.fill}
        strokeWidth={isSelected ? 2 : 1.5}
        filter={
          isSelected ? "drop-shadow(0 0 6px rgba(99,102,241,0.5))" : undefined
        }
      />
    )
  }

  if (shape.type === "text") {
    return (
      <text
        {...selectionProps}
        x={shape.x}
        y={shape.y + 24}
        fontFamily="inherit"
        fontSize={18}
        fill={isSelected ? "#6366f1" : "#1a1a2e"}
        strokeWidth={0}
        style={{ dominantBaseline: "auto" }}
      >
        {shape.text ?? "Text"}
      </text>
    )
  }

  return null
}

// ────────────────────────────────────────────────────────────────────────────
// Remote Cursor
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
      {/* Cursor arrow */}
      <path
        d={`M ${x} ${y} L ${x + 7} ${y + 16} L ${x + 13} ${y + 13} L ${x + 16} ${y + 19} L ${x + 19} ${y + 13} L ${x + 13} ${y + 10} L ${x + 19} ${y + 5} Z`}
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
      {/* Name tag */}
      <rect
        x={x + 20}
        y={y - 4}
        width={name.length * 7 + 12}
        height={20}
        rx={4}
        fill={color}
      />
      <text
        x={x + 26}
        y={y + 10}
        fontSize="11"
        fill="white"
        fontFamily="inherit"
        fontWeight="500"
      >
        {name}
      </text>
    </g>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Canvas Toolbar
// ────────────────────────────────────────────────────────────────────────────

interface CanvasToolbarProps {
  activeTool: CanvasTool
  onToolChange: (tool: CanvasTool) => void
}

function CanvasToolbar({ activeTool, onToolChange }: CanvasToolbarProps) {
  const tools: Array<{
    id: CanvasTool
    label: string
    icon: React.ElementType
    key: string
  }> = [
    { id: "select", label: "Select (V)", icon: Cursor02Icon, key: "v" },
    {
      id: "rectangle",
      label: "Rectangle (R)",
      icon: RectangularIcon,
      key: "r",
    },
    { id: "circle", label: "Circle (C)", icon: CircleIcon, key: "c" },
    { id: "diamond", label: "Diamond (D)", icon: Square01Icon, key: "d" },
    { id: "triangle", label: "Triangle (T)", icon: TriangleIcon, key: "t" },
    {
      id: "sticky",
      label: "Sticky Note (S)",
      icon: StickyNote01Icon,
      key: "s",
    },
    { id: "text", label: "Text (A)", icon: TextIcon, key: "a" },
  ]

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase()
      if (
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      )
        return
      const t = tools.find((t) => t.key === e.key.toLowerCase())
      if (t) onToolChange(t.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onToolChange])

  return (
    <div className="bg-background/95 border-border flex items-center gap-0.5 border-b px-2 py-1.5 backdrop-blur">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          title={tool.label}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            activeTool === tool.id &&
              "bg-primary/10 text-primary ring-primary/30 ring-1"
          )}
        >
          <HugeiconsIcon icon={tool.icon} size={16} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}

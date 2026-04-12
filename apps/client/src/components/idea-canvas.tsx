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

import type { Layer, TextLayer } from "@/lib/liveblocks.config"

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
      const layer = storage.get("layers")?.get(id)
      if (layer) {
        layer.update({ text })
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
            type: activeTool === "sticky" ? "sticky" : activeTool,
            x: pt.x,
            y: pt.y,
            width: activeTool === "sticky" ? 240 : 120,
            height: activeTool === "sticky" ? 200 : 80,
            fill,
            text:
              activeTool === "sticky"
                ? "Write your thoughts here..."
                : undefined,
          } as any)

    const id = insertLayer(newLayer)
    setSelectedId(id)
    setActiveTool("select")
  }

  const handlePointerUp = () => {
    setDragging(null)
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

  const handleLayerDoubleClick = (id: string, layer: Layer) => {
    if (layer.type === "sticky" || layer.type === "text") {
      setEditingId(id)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const zoomDelta = -e.deltaY * 0.001
      setCamera((prev) => ({
        ...prev,
        zoom: Math.min(Math.max(prev.zoom + zoomDelta, 0.1), 5),
      }))
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

      {/* ── Left Tool Sidebar (Vertical Floating Pill) ── */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2">
        <div className="bg-background/80 border-border flex flex-col items-center gap-2 rounded-3xl border p-2 shadow-2xl backdrop-blur-xl">
          <ToolButton
            active={activeTool === "select"}
            onClick={() => setActiveTool("select")}
            icon={<HugeiconsIcon icon={Cursor02Icon} size={20} />}
            tooltip="Select (V)"
          />
          <div className="bg-border my-1 h-px w-8" />
          <ToolButton
            active={activeTool === "rectangle"}
            onClick={() => setActiveTool("rectangle")}
            icon={<HugeiconsIcon icon={RectangularIcon} size={20} />}
            tooltip="Rectangle (R)"
          />
          <ToolButton
            active={activeTool === "circle"}
            onClick={() => setActiveTool("circle")}
            icon={<HugeiconsIcon icon={CircleIcon} size={20} />}
            tooltip="Circle (O)"
          />
          <ToolButton
            active={activeTool === "sticky"}
            onClick={() => setActiveTool("sticky")}
            icon={<HugeiconsIcon icon={StickyNote01Icon} size={20} />}
            tooltip="Sticky Note (S)"
          />
          <ToolButton
            active={activeTool === "text"}
            onClick={() => setActiveTool("text")}
            icon={<HugeiconsIcon icon={TextIcon} size={20} />}
            tooltip="Text (T)"
          />
          <div className="bg-border my-1 h-px w-8" />
          <ToolButton
            active={false}
            onClick={() => {}}
            icon={<div className="text-xs font-bold">+</div>}
            tooltip="Add more"
          />
        </div>
      </div>

      {/* ── Bottom Navigation Bar (Centered Floating Pill) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-background/80 border-border flex items-center gap-4 rounded-2xl border px-4 py-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-1">
            <NavButton
              active={activeTool === "pan"}
              onClick={() => setActiveTool("pan")}
              icon={<HugeiconsIcon icon={Cursor02Icon} size={18} />}
              tooltip="Pan tool (H)"
            />
            <NavButton
              active={false}
              onClick={() => {}}
              icon={
                <HugeiconsIcon
                  icon={Cursor02Icon}
                  size={18}
                  className="rotate-90"
                />
              }
              tooltip="Selection tool"
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
            icon={<HugeiconsIcon icon={Square01Icon} size={18} />}
            tooltip="Layers"
          />
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function ToolButton({
  active,
  onClick,
  icon,
  tooltip,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  tooltip: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
        active
          ? "bg-primary text-primary-foreground shadow-primary/20 scale-110 shadow-lg"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
    </button>
  )
}

function NavButton({
  active,
  onClick,
  icon,
  tooltip,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  tooltip: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
    </button>
  )
}

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

  // ── Idea Card (Sticky Note Upgrade) ──
  if (layer.type === "sticky") {
    return (
      <g {...commonProps}>
        {/* Main Card */}
        <rect
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          rx={24}
          fill="white"
          filter="drop-shadow(0 10px 30px rgba(0,0,0,0.08))"
          className="transition-all duration-300"
        />
        {/* Selection Ring */}
        {isSelected && (
          <rect
            x={layer.x - 2}
            y={layer.y - 2}
            width={layer.width + 4}
            height={layer.height + 4}
            rx={26}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2.5}
            strokeDasharray="4 4"
          />
        )}

        {/* Card Header Section */}
        <g transform={`translate(${layer.x + 20}, ${layer.y + 20})`}>
          {/* Category Pill */}
          <rect width={80} height={24} rx={12} fill="#e0e7ff" />
          <text
            x={40}
            y={16}
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            fill="#4338ca"
            style={{ pointerEvents: "none", letterSpacing: "0.05em" }}
          >
            STRATEGY
          </text>

          {/* Title Placeholder (Mock) */}
          <text
            y={50}
            fontSize="18"
            fontWeight="700"
            fill="#1e1b4b"
            style={{ pointerEvents: "none" }}
          >
            {layer.text?.substring(0, 15) || "Untitled Card"}
          </text>
        </g>

        {/* Menu Dots Right Top */}
        <circle
          cx={layer.x + layer.width - 25}
          cy={layer.y + 25}
          r={1.5}
          fill="#94a3b8"
        />
        <circle
          cx={layer.x + layer.width - 20}
          cy={layer.y + 25}
          r={1.5}
          fill="#94a3b8"
        />
        <circle
          cx={layer.x + layer.width - 15}
          cy={layer.y + 25}
          r={1.5}
          fill="#94a3b8"
        />

        {/* Text Area Body */}
        <foreignObject
          x={layer.x + 20}
          y={layer.y + 75}
          width={layer.width - 40}
          height={layer.height - 95}
          style={{ pointerEvents: isEditing ? "all" : "none" }}
        >
          {isEditing ? (
            <textarea
              autoFocus
              className="h-full w-full resize-none border-none bg-transparent p-0 text-[14px] leading-relaxed text-slate-600 outline-none"
              defaultValue={layer.text || ""}
              onBlur={(e) => onTextChange(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="line-clamp-4 h-full w-full text-[14px] leading-relaxed text-slate-500">
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
              className="w-full border-none bg-transparent p-0 text-xl font-bold text-slate-900 outline-none"
              style={{ fontSize: layer.fontSize }}
              defaultValue={layer.text || ""}
              onBlur={(e) => onTextChange(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          ) : (
            <div
              className={cn(
                "w-full truncate text-xl font-bold text-slate-900 transition-all",
                isSelected &&
                  "bg-primary/5 ring-primary/20 rounded-lg px-2 py-1 ring-1"
              )}
              style={{ fontSize: layer.fontSize }}
            >
              {layer.text || "Text Idea"}
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
    fill: layer.fill,
    fillOpacity: 0.9,
    stroke: isSelected ? "var(--primary)" : "transparent",
    strokeWidth: 3,
    className: "transition-all duration-300 drop-shadow-lg",
  }

  if (layer.type === "rectangle") {
    shapeProps.x = layer.x
    shapeProps.y = layer.y
    shapeProps.width = layer.width
    shapeProps.height = layer.height
    shapeProps.rx = 16
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
    <g
      style={{ pointerEvents: "none" }}
      className="transition-transform duration-100"
    >
      <path
        d={`M ${x} ${y} L ${x} ${y + 18} L ${x + 5} ${y + 13} L ${x + 11} ${y + 13} Z`}
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
      <g transform={`translate(${x + 12}, ${y + 4})`}>
        <rect
          width={name.length * 7 + 12}
          height={18}
          rx={9}
          fill={color}
          className="shadow-sm"
        />
        <text x={6} y={13} fontSize="10" fill="white" fontWeight="800">
          {name}
        </text>
      </g>
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

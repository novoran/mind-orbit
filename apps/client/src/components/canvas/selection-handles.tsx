import * as React from "react"

import type { Layer, LineLayer } from "@/lib/liveblocks.config"

interface SelectionHandlesProps {
  layer: Layer
  onResizeStart: (
    handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
    e: React.PointerEvent
  ) => void
  onRotateStart: (e: React.PointerEvent) => void
  onLinePointResizeStart?: (index: number, e: React.PointerEvent) => void
}

function getResizeCursor(handle: string, rotation: number) {
  const handleAngles: Record<string, number> = {
    n: 0,
    ne: 45,
    e: 90,
    se: 135,
    s: 180,
    sw: 225,
    w: 270,
    nw: 315,
  }
  const baseAngle = handleAngles[handle]
  const total = (rotation + baseAngle + 360) % 360
  if ((total >= 337.5 && total <= 360) || (total >= 0 && total < 22.5))
    return "ns-resize"
  if (total >= 22.5 && total < 67.5) return "nesw-resize"
  if (total >= 67.5 && total < 112.5) return "ew-resize"
  if (total >= 112.5 && total < 157.5) return "nwse-resize"
  if (total >= 157.5 && total < 202.5) return "ns-resize"
  if (total >= 202.5 && total < 247.5) return "nesw-resize"
  if (total >= 247.5 && total < 292.5) return "ew-resize"
  if (total >= 292.5 && total < 337.5) return "nwse-resize"
  return "default"
}

export function SelectionHandles({
  layer,
  onResizeStart,
  onRotateStart,
  onLinePointResizeStart,
}: SelectionHandlesProps) {
  const rotation = layer.rotation || 0

  if (layer.type === "line" || layer.type === "arrow") {
    const lineLayer = layer as LineLayer
    return (
      <g>
        {/* Connection Curve Visual Guide */}
        <path
          d={`M ${lineLayer.points[0].x} ${lineLayer.points[0].y} Q ${lineLayer.points[1].x} ${lineLayer.points[1].y} ${lineLayer.points[2].x} ${lineLayer.points[2].y}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Control Points */}
        {lineLayer.points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 1 ? 4 : 6}
            fill="white"
            stroke="var(--primary)"
            strokeWidth={1.5}
            className="hover:fill-primary/20 cursor-move transition-colors"
            onPointerDown={(e) => {
              e.stopPropagation()
              onLinePointResizeStart?.(i, e)
            }}
          />
        ))}
      </g>
    )
  }

  const cornerHandles: Array<"nw" | "ne" | "sw" | "se"> = [
    "nw",
    "ne",
    "sw",
    "se",
  ]

  return (
    <g
      transform={`rotate(${rotation}, ${layer.x + layer.width / 2}, ${layer.y + layer.height / 2})`}
    >
      {/* Bounding Box Selection */}
      <rect
        x={layer.x - 2}
        y={layer.y - 2}
        width={layer.width + 4}
        height={layer.height + 4}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={1.5}
        style={{ pointerEvents: "none" }}
      />

      {/* Invisible Border Handles for side-by-side resizing */}
      <line
        x1={layer.x}
        y1={layer.y}
        x2={layer.x + layer.width}
        y2={layer.y}
        stroke="transparent"
        strokeWidth={10}
        style={{ cursor: getResizeCursor("n", rotation) }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onResizeStart("n", e)
        }}
      />
      <line
        x1={layer.x}
        y1={layer.y + layer.height}
        x2={layer.x + layer.width}
        y2={layer.y + layer.height}
        stroke="transparent"
        strokeWidth={10}
        style={{ cursor: getResizeCursor("s", rotation) }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onResizeStart("s", e)
        }}
      />
      <line
        x1={layer.x}
        y1={layer.y}
        x2={layer.x}
        y2={layer.y + layer.height}
        stroke="transparent"
        strokeWidth={10}
        style={{ cursor: getResizeCursor("w", rotation) }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onResizeStart("w", e)
        }}
      />
      <line
        x1={layer.x + layer.width}
        y1={layer.y}
        x2={layer.x + layer.width}
        y2={layer.y + layer.height}
        stroke="transparent"
        strokeWidth={10}
        style={{ cursor: getResizeCursor("e", rotation) }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onResizeStart("e", e)
        }}
      />

      {/* Rotation Handle */}
      <circle
        cx={layer.x + layer.width / 2}
        cy={layer.y - 20}
        r={5}
        fill="white"
        stroke="var(--primary)"
        strokeWidth={1.5}
        style={{ cursor: "grab" }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onRotateStart(e)
        }}
      />

      {/* Corner Resize Handles */}
      {cornerHandles.map((h) => {
        const x = h.includes("e") ? layer.x + layer.width : layer.x
        const y = h.includes("s") ? layer.y + layer.height : layer.y

        return (
          <circle
            key={h}
            cx={x}
            cy={y}
            r={5}
            fill="white"
            stroke="var(--primary)"
            strokeWidth={1.5}
            style={{ cursor: getResizeCursor(h, rotation) }}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeStart(h, e)
            }}
          />
        )
      })}
    </g>
  )
}

import * as React from "react"
import { cn } from "@mindorbit/ui/lib/utils"
import type { Layer, LineLayer } from "@/lib/liveblocks.config"

interface SelectionHandlesProps {
  layer: Layer
  onResizeStart: (handle: "nw" | "ne" | "sw" | "se", e: React.PointerEvent) => void
  onRotateStart: (e: React.PointerEvent) => void
  onLinePointResizeStart?: (index: number, e: React.PointerEvent) => void
}

export function SelectionHandles({ 
  layer, 
  onResizeStart, 
  onRotateStart,
  onLinePointResizeStart 
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
            className="cursor-move hover:fill-primary/20 transition-colors"
            onPointerDown={(e) => {
              e.stopPropagation()
              onLinePointResizeStart?.(i, e)
            }}
          />
        ))}
      </g>
    )
  }

  const handles: Array<"nw" | "ne" | "sw" | "se"> = ["nw", "ne", "sw", "se"]

  return (
    <g transform={`rotate(${rotation}, ${layer.x + layer.width / 2}, ${layer.y + layer.height / 2})`}>
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

      {/* Rotation Handle */}
      <line
        x1={layer.x + layer.width / 2}
        y1={layer.y - 2}
        x2={layer.x + layer.width / 2}
        y2={layer.y - 25}
        stroke="var(--primary)"
        strokeWidth={1.5}
      />
      <circle
        cx={layer.x + layer.width / 2}
        cy={layer.y - 25}
        r={5}
        fill="white"
        stroke="var(--primary)"
        strokeWidth={1.5}
        className="cursor-crosshair"
        onPointerDown={(e) => {
          e.stopPropagation()
          onRotateStart(e)
        }}
      />

      {/* Resize Handles */}
      {handles.map((h) => {
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
            className={cn(
              "cursor-nwse-resize",
              (h === "ne" || h === "sw") && "cursor-nesw-resize"
            )}
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

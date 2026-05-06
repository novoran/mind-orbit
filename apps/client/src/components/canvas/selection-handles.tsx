import * as React from "react"

import type { Layer } from "@/lib/liveblocks.config"

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
  const handleSize = 10

  const cornerHandles: Array<"nw" | "ne" | "sw" | "se"> = [
    "nw",
    "ne",
    "sw",
    "se",
  ]

  const isLine = layer.type === "line" || layer.type === "arrow"

  if (isLine) {
    const lineLayer = layer
    const ox = layer.x || 0
    const oy = layer.y || 0
    const p0 = { x: ox + lineLayer.points[0].x, y: oy + lineLayer.points[0].y }
    const p1 = { x: ox + lineLayer.points[1].x, y: oy + lineLayer.points[1].y }
    const p2 = { x: ox + lineLayer.points[2].x, y: oy + lineLayer.points[2].y }

    return (
      <g>
        {/* Connection Curve Visual Guide */}
        <path
          d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={1}
          strokeDasharray="4 4"
          style={{ pointerEvents: "none" }}
        />

        {/* Control Points */}
        {[p0, p1, p2].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 1 ? 4 : 6}
            fill="white"
            stroke="#4f46e5"
            strokeWidth={1.5}
            className="cursor-move transition-colors hover:fill-indigo-50"
            onPointerDown={(e) => {
              e.stopPropagation()
              onLinePointResizeStart?.(i, e)
            }}
          />
        ))}
      </g>
    )
  }

  return (
    <g
      transform={`rotate(${rotation}, ${layer.x + layer.width / 2}, ${layer.y + layer.height / 2})`}
    >
      {/* Bounding Box Selection Border */}
      <rect
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        fill="none"
        stroke="#4f46e5"
        strokeWidth={1.5}
        style={{ pointerEvents: "none" }}
      />

      {/* Side Handles (Invisible Hit Areas) */}
      {(["n", "s", "e", "w"] as const)
        .filter((h) => {
          if (layer.type === "text") return h === "e" || h === "w"
          return true
        })
        .map((h) => {
          let x = layer.x
          let y = layer.y
          let width = layer.width
          let height = layer.height

          if (h === "n" || h === "s") {
            y = h === "s" ? layer.y + layer.height - 5 : layer.y - 5
            height = 10
          } else {
            x = h === "e" ? layer.x + layer.width - 5 : layer.x - 5
            width = 10
          }

          return (
            <rect
              key={h}
              x={x}
              y={y}
              width={width}
              height={height}
              fill="transparent"
              style={{ cursor: getResizeCursor(h, rotation) }}
              onPointerDown={(e) => {
                e.stopPropagation()
                onResizeStart(h, e)
              }}
            />
          )
        })}

      {/* Corner Handles (Squares) & Rotation Zones */}
      {cornerHandles
        .filter(() => layer.type !== "text")
        .map((h) => {
          const x = h.includes("e") ? layer.x + layer.width : layer.x
          const y = h.includes("s") ? layer.y + layer.height : layer.y

          return (
            <g key={h}>
              {/* Rotation Zone (Larger Invisible Area) */}
              <rect
                x={x - handleSize * 1.5}
                y={y - handleSize * 1.5}
                width={handleSize * 3}
                height={handleSize * 3}
                fill="transparent"
                style={{
                  cursor:
                    'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMjIgMTRsLTQgNE0xNCAyMmw0LTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTE2IDEwYzMuMzEzIDAgNiAyLjY4NyA2IDZzLTIuNjg3IDYtNiA2LTAtMi42ODctNi02IDItNiA2LTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+"), auto',
                }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  onRotateStart(e)
                }}
              />
              {/* Resize Handle (Square) */}
              <rect
                x={x - handleSize / 2}
                y={y - handleSize / 2}
                width={handleSize}
                height={handleSize}
                fill="white"
                stroke="#4f46e5"
                strokeWidth={1.5}
                style={{ cursor: getResizeCursor(h, rotation) }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  onResizeStart(h, e)
                }}
              />
            </g>
          )
        })}
    </g>
  )
}

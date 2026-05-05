import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

import type {
  Layer,
  LineLayer,
  PathLayer,
  ShapeLayer,
  TextLayer,
} from "@/lib/liveblocks.config"

interface CanvasLayerProps {
  id: string
  layer: Layer
  isEditing: boolean
  onPointerDown: (e: React.PointerEvent, id: string, layer: Layer) => void
  onDoubleClick: () => void
  onFieldChange: (field: string, val: string) => void
}

export function CanvasLayer({
  id,
  layer,
  isEditing,
  onPointerDown,
  onDoubleClick,
  onFieldChange,
}: CanvasLayerProps) {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return
    onPointerDown(e, id, layer)
  }

  const rotation = layer.rotation || 0
  const cx = layer.x + layer.width / 2
  const cy = layer.y + layer.height / 2

  const commonProps = {
    onPointerDown: handlePointerDown,
    onDoubleClick,
    style: { cursor: isEditing ? "text" : "move" },
  }

  return (
    <g
      transform={`rotate(${rotation}, ${cx}, ${cy})`}
      {...commonProps}
      opacity={layer.opacity ?? 1}
    >
      {/* Redundant selection border removed as requested */}
      {layer.type === "sticky" ? (
        <StickyLayer
          layer={layer}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
      ) : layer.type === "text" ? (
        <TextLayerComponent
          layer={layer}
          isEditing={isEditing}
          onTextChange={(val: string) => onFieldChange("text", val)}
        />
      ) : layer.type === "path" ? (
        <PathLayerComponent layer={layer} />
      ) : layer.type === "line" || layer.type === "arrow" ? (
        <LineLayerComponent layer={layer} />
      ) : (
        <ShapeLayerComponent
          layer={layer as ShapeLayer}
          isEditing={isEditing}
          onTextChange={(val: string) => onFieldChange("text", val)}
        />
      )}
    </g>
  )
}

function PathLayerComponent({ layer }: { layer: PathLayer }) {
  const d =
    layer.points.length > 0
      ? `M ${layer.points[0][0]} ${layer.points[0][1]} ${layer.points
          .map((p) => `L ${p[0]} ${p[1]}`)
          .join(" ")}`
      : ""

  return (
    <path
      d={d}
      fill="none"
      stroke={layer.fill || "#000"}
      strokeWidth={layer.strokeWidth || 2}
      strokeDasharray={layer.dashArray}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

function LineLayerComponent({ layer }: { layer: LineLayer }) {
  const [start, control, end] = layer.points
  const d = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${layer.type}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={layer.stroke || "#000"} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={layer.stroke || "#000"}
        strokeWidth={layer.strokeWidth || 2}
        strokeDasharray={layer.dashArray}
        markerEnd={
          layer.type === "arrow" ? `url(#arrowhead-${layer.type})` : undefined
        }
        strokeLinecap="round"
      />
    </g>
  )
}

interface StickyLayerProps {
  layer: ShapeLayer
  isEditing: boolean
  onFieldChange: (field: string, val: string) => void
}

function StickyLayer({ layer, isEditing, onFieldChange }: StickyLayerProps) {
  const badgeBaseClasses =
    "text-[10px] font-extrabold tracking-wider text-indigo-700 uppercase outline-none"
  const badgeBgClasses = "bg-indigo-50"
  const badgePaddingClasses = "px-2.5"
  const contentClasses = cn(
    "h-full w-full border-none bg-transparent p-0 leading-relaxed break-words whitespace-pre-wrap outline-none placeholder:text-slate-300",
    layer.textAlign === "center"
      ? "text-center"
      : layer.textAlign === "right"
        ? "text-right"
        : "text-left"
  )

  return (
    <g>
      {/* Background with shadow */}
      <rect
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        rx={layer.borderRadius ?? 12}
        fill={layer.fill || "white"}
        stroke={layer.stroke || "transparent"}
        strokeWidth={layer.strokeWidth || 0}
        strokeDasharray={layer.dashArray}
        filter="drop-shadow(0 10px 30px rgba(0,0,0,0.08))"
      />

      {/* 1. Badge Area (Top Left) */}
      <foreignObject
        x={layer.x + 20}
        y={layer.y + 20}
        width={layer.width - 40}
        height={32}
        style={{ pointerEvents: isEditing ? "all" : "none" }}
      >
        <div className="flex h-full items-center">
          <div
            className={cn(
              "relative flex h-5 w-fit items-center justify-center rounded-sm",
              badgeBgClasses,
              badgePaddingClasses
            )}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <div className="relative flex items-center justify-center">
                <span
                  className={cn(badgeBaseClasses, "invisible whitespace-pre")}
                >
                  {layer.badge || "BADGE"}
                </span>
                <input
                  className={cn(
                    badgeBaseClasses,
                    "absolute inset-0 w-full border-none bg-transparent p-0 text-center outline-none"
                  )}
                  value={layer.badge || ""}
                  placeholder="BADGE"
                  autoFocus
                  spellCheck={false}
                  onChange={(e) => onFieldChange("badge", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                />
              </div>
            ) : (
              <div
                className={cn(
                  badgeBaseClasses,
                  "flex items-center justify-center rounded-sm"
                )}
              >
                {layer.badge || "BADGE"}
              </div>
            )}
          </div>
        </div>
      </foreignObject>

      {/* 2. Content Area (Bottom) */}
      <foreignObject
        x={layer.x + 20}
        y={layer.y + 60}
        width={layer.width - 40}
        height={layer.height - 80}
        style={{ pointerEvents: isEditing ? "all" : "none" }}
      >
        {isEditing ? (
          <textarea
            autoFocus
            onFocus={(e) => {
              const val = e.target.value
              e.target.value = ""
              e.target.value = val
            }}
            className={contentClasses + " resize-none overflow-hidden"}
            style={{
              color: layer.textColor,
              fontFamily: layer.fontFamily,
              fontSize: layer.fontSize ?? 14,
            }}
            value={layer.text || ""}
            placeholder="Description..."
            onChange={(e) => onFieldChange("text", e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={contentClasses + " overflow-hidden"}
            style={{
              color: layer.textColor,
              fontFamily: layer.fontFamily,
              fontSize: layer.fontSize ?? 14,
            }}
          >
            {layer.text || "Add content..."}
          </div>
        )}
      </foreignObject>
    </g>
  )
}

interface TextLayerComponentProps {
  layer: TextLayer
  isEditing: boolean
  onTextChange: (val: string) => void
}

function TextLayerComponent({
  layer,
  isEditing,
  onTextChange,
}: TextLayerComponentProps) {
  return (
    <foreignObject
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      className="pointer-events-none"
    >
      <div
        className={cn(
          "flex h-full w-full p-2",
          layer.textAlign === "left"
            ? "items-start justify-start text-left"
            : "items-center justify-center text-center"
        )}
        style={{
          fontSize: layer.fontSize || 18,
          color: layer.fill || "#000000",
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        <div className="max-h-full w-full overflow-hidden wrap-break-word text-ellipsis">
          {isEditing ? (
            <textarea
              autoFocus
              className="h-full w-full resize-none border-none bg-transparent p-0 font-bold outline-none"
              value={layer.text || ""}
              onChange={(e) => onTextChange(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            layer.text || "Text"
          )}
        </div>
      </div>
    </foreignObject>
  )
}

function getRoundedPolygonPath(
  points: Array<{ x: number; y: number }>,
  radius: number
) {
  if (radius <= 0)
    return `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")} Z`

  const path = []
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]
    const p2 = points[(i + 1) % points.length]
    const p0 = points[(i - 1 + points.length) % points.length]

    const v0 = { x: p0.x - p1.x, y: p0.y - p1.y }
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y }

    const d0 = Math.sqrt(v0.x * v0.x + v0.y * v0.y)
    const d1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)

    const actualRadius = Math.min(radius, d0 / 2, d1 / 2)

    const b0 = {
      x: p1.x + (v0.x / d0) * actualRadius,
      y: p1.y + (v0.y / d0) * actualRadius,
    }
    const b1 = {
      x: p1.x + (v1.x / d1) * actualRadius,
      y: p1.y + (v1.y / d1) * actualRadius,
    }

    if (i === 0) path.push(`M ${b0.x},${b0.y}`)
    else path.push(`L ${b0.x},${b0.y}`)

    path.push(`Q ${p1.x},${p1.y} ${b1.x},${b1.y}`)
  }
  return path.join(" ") + " Z"
}

interface ShapeLayerComponentProps {
  layer: ShapeLayer
  isEditing: boolean
  onTextChange: (val: string) => void
}

function ShapeLayerComponent({
  layer,
  isEditing,
  onTextChange,
}: ShapeLayerComponentProps) {
  const ShapeTag =
    layer.type === "circle"
      ? "ellipse"
      : layer.type === "rectangle"
        ? "rect"
        : "path"

  const shapeProps: Record<string, unknown> = {
    fill: layer.fill,
    fillOpacity: 1,
    stroke: layer.stroke || "#000000",
    strokeWidth: layer.strokeWidth || 2,
    strokeDasharray: layer.dashArray,
    className: cn(
      "drop-shadow-lg transition-colors duration-300",
      !isEditing && "cursor-move"
    ),
  }

  const radius = layer.borderRadius ?? 8

  if (layer.type === "rectangle") {
    shapeProps.x = layer.x
    shapeProps.y = layer.y
    shapeProps.width = layer.width
    shapeProps.height = layer.height
    shapeProps.rx = radius
  } else if (layer.type === "circle") {
    shapeProps.cx = layer.x + layer.width / 2
    shapeProps.cy = layer.y + layer.height / 2
    shapeProps.rx = layer.width / 2
    shapeProps.ry = layer.height / 2
  } else {
    let points: Array<{ x: number; y: number }> = []
    const cx = layer.x + layer.width / 2
    const cy = layer.y + layer.height / 2

    if (layer.type === "diamond") {
      points = [
        { x: cx, y: layer.y },
        { x: layer.x + layer.width, y: cy },
        { x: cx, y: layer.y + layer.height },
        { x: layer.x, y: cy },
      ]
    } else if (layer.type === "star") {
      const rx = layer.width / 2
      const ry = layer.height / 2
      const numPoints = layer.starPoints || 5
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints - Math.PI / 2
        const r_x = i % 2 === 0 ? rx : rx * 0.5
        const r_y = i % 2 === 0 ? ry : ry * 0.5
        points.push({
          x: cx + r_x * Math.cos(angle),
          y: cy + r_y * Math.sin(angle),
        })
      }
    } else {
      // triangle
      points = [
        { x: cx, y: layer.y },
        { x: layer.x + layer.width, y: layer.y + layer.height },
        { x: layer.x, y: layer.y + layer.height },
      ]
    }
    shapeProps.d = getRoundedPolygonPath(points, radius)
  }

  return (
    <g>
      <ShapeTag {...shapeProps} />
      <foreignObject
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        style={{ pointerEvents: isEditing ? "all" : "none" }}
      >
        <div
          className={cn(
            "flex h-full w-full items-center px-4 py-2",
            layer.textAlign === "left"
              ? "justify-start text-left"
              : layer.textAlign === "right"
                ? "justify-end text-right"
                : "justify-center text-center"
          )}
          style={{
            color: layer.textColor || "#000",
            fontFamily: layer.fontFamily,
            fontSize: layer.fontSize ?? 14,
          }}
        >
          <div className="max-h-full w-full overflow-hidden wrap-break-word">
            {isEditing ? (
              <textarea
                autoFocus
                className="h-full w-full resize-none border-none bg-transparent p-0 text-inherit outline-none"
                style={{ textAlign: layer.textAlign || "center" }}
                value={layer.text || ""}
                onChange={(e) => onTextChange(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
              />
            ) : (
              layer.text || ""
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

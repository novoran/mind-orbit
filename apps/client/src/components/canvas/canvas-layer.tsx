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
  onResize?: (id: string, width: number, height: number) => void
}

export function CanvasLayer({
  id,
  layer,
  isEditing,
  onPointerDown,
  onDoubleClick,
  onFieldChange,
  onResize,
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
          onResize={(w, h) => onResize?.(id, w, h)}
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
      ? `M ${layer.x + layer.points[0][0]} ${layer.y + layer.points[0][1]} ${layer.points
          .slice(1)
          .map((p) => `L ${layer.x + p[0]} ${layer.y + p[1]}`)
          .join(" ")}`
      : ""

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-move"
      />
      <path
        d={d}
        fill="none"
        stroke={layer.fill || "#000"}
        strokeWidth={layer.strokeWidth || 2}
        strokeDasharray={layer.dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

function LineLayerComponent({ layer }: { layer: LineLayer }) {
  const ox = layer.x || 0
  const oy = layer.y || 0
  const start = { x: ox + layer.points[0].x, y: oy + layer.points[0].y }
  const control = { x: ox + layer.points[1].x, y: oy + layer.points[1].y }
  const end = { x: ox + layer.points[2].x, y: oy + layer.points[2].y }
  const d = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${layer.type}`}
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 2 1.5 L 8.5 5 L 2 8.5 Z"
            fill={layer.stroke || "#000"}
            stroke={layer.stroke || "#000"}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      {/* Invisible hit-test path for easier selection/dragging */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-move"
      />
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
        strokeLinejoin="round"
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
  const contentRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (isEditing && contentRef.current) {
      const timer = setTimeout(() => contentRef.current?.focus(), 10)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

  const badgeBaseClasses =
    "text-[10px] font-extrabold tracking-wider text-indigo-700 uppercase outline-none"
  const badgeBgClasses = "bg-indigo-50"
  const badgePaddingClasses = "px-2.5"
  const contentClasses = cn(
    "m-0 h-full w-full border-none bg-transparent p-0 leading-[1.5] break-words whitespace-pre-wrap outline-none placeholder:text-slate-300",
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
                    "absolute inset-0 m-0 w-full border-none bg-transparent p-0 text-center outline-none"
                  )}
                  value={layer.badge || ""}
                  placeholder="BADGE"
                  autoFocus
                  onFocus={(e) => {
                    const val = e.target.value
                    e.target.value = ""
                    e.target.value = val
                  }}
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
        <div
          className={cn(
            "flex h-full w-full items-start",
            layer.textAlign === "center"
              ? "justify-center"
              : layer.textAlign === "right"
                ? "justify-end"
                : "justify-start"
          )}
        >
          <div className="grid h-full w-full items-start">
            {/* Mirror div to provide height/width */}
            <div
              className={
                contentClasses + " invisible h-auto w-full whitespace-pre-wrap"
              }
              style={{
                gridArea: "1 / 1 / 2 / 2",
                color: layer.textColor,
                fontFamily: layer.fontFamily,
                fontSize: layer.fontSize ?? 14,
                lineHeight: "1.5",
                padding: 0,
                margin: 0,
                boxSizing: "border-box",
              }}
            >
              {(layer.text || "\u00A0") +
                (layer.text?.endsWith("\n") ? "\u00A0" : "")}
            </div>
            {isEditing ? (
              <textarea
                ref={contentRef}
                autoFocus
                rows={1}
                onFocus={(e) => {
                  const val = e.target.value
                  e.target.value = ""
                  e.target.value = val
                }}
                className={
                  contentClasses +
                  " scrollbar-hide m-0 h-auto w-full resize-none overflow-hidden"
                }
                style={{
                  gridArea: "1 / 1 / 2 / 2",
                  color: layer.textColor,
                  fontFamily: layer.fontFamily,
                  fontSize: layer.fontSize ?? 14,
                  lineHeight: "1.5",
                  padding: 0,
                  margin: 0,
                  boxSizing: "border-box",
                }}
                value={layer.text || ""}
                placeholder="Description..."
                spellCheck={false}
                onChange={(e) => onFieldChange("text", e.target.value)}
                onClick={(e) => e.currentTarget.focus()}
                onPointerDown={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className={contentClasses + " h-auto w-full overflow-hidden"}
                style={{
                  gridArea: "1 / 1 / 2 / 2",
                  color: layer.textColor,
                  fontFamily: layer.fontFamily,
                  fontSize: layer.fontSize ?? 14,
                  lineHeight: "1.5",
                  padding: 0,
                  margin: 0,
                  boxSizing: "border-box",
                }}
              >
                {layer.text || "Add content..."}
              </div>
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

interface TextLayerComponentProps {
  layer: TextLayer
  isEditing: boolean
  onTextChange: (val: string) => void
  onResize?: (width: number, height: number) => void
}

function TextLayerComponent({
  layer,
  isEditing,
  onTextChange,
  onResize,
}: TextLayerComponentProps) {
  const textRef = React.useRef<HTMLTextAreaElement>(null)
  const mirrorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isEditing && textRef.current) {
      const timer = setTimeout(() => textRef.current?.focus(), 10)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

  // Auto-resize logic: always ensure the height tightly fits the content
  // Note: we only auto-fit height; width is manual or updated during typing
  React.useLayoutEffect(() => {
    if (mirrorRef.current && onResize) {
      const { height } = mirrorRef.current.getBoundingClientRect()
      const newHeight = Math.max(height, 20)

      if (Math.abs(newHeight - layer.height) > 1) {
        onResize(layer.width, newHeight)
      }
    }
  }, [layer.text, onResize, layer.width, layer.height])

  return (
    <g>
      {/* Hit-test background */}
      <rect
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        fill="transparent"
        className={cn(!isEditing && "cursor-move")}
      />
      <foreignObject
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        style={{
          pointerEvents: isEditing ? "all" : "none",
          fontSize: layer.fontSize || 18,
          color: layer.fill || "#000000",
          fontWeight: 500,
          lineHeight: "1.2",
        }}
      >
        <div
          className={cn(
            "flex h-full w-full items-start",
            layer.textAlign === "center"
              ? "justify-center"
              : layer.textAlign === "right"
                ? "justify-end"
                : "justify-start"
          )}
        >
          <div className="grid h-full w-full items-start">
            {/* Mirror div to provide accurate measurements */}
            <div
              ref={mirrorRef}
              className="invisible h-auto w-full overflow-hidden wrap-break-word whitespace-pre-wrap"
              style={{
                gridArea: "1 / 1 / 2 / 2",
                fontSize: layer.fontSize || 18,
                fontWeight: 500,
                lineHeight: "1.2",
                padding: 0,
                margin: 0,
                boxSizing: "border-box",
              }}
            >
              {(layer.text || "\u00A0") +
                (layer.text?.endsWith("\n") ? "\u00A0" : "")}
            </div>
            {isEditing ? (
              <textarea
                ref={textRef}
                autoFocus
                rows={1}
                onFocus={(e) => {
                  const val = e.target.value
                  e.target.value = ""
                  e.target.value = val
                }}
                className="scrollbar-hide m-0 h-full w-full resize-none overflow-hidden border-none bg-transparent p-0 font-bold outline-none"
                style={{
                  gridArea: "1 / 1 / 2 / 2",
                  fontSize: layer.fontSize || 18,
                  color: layer.fill || "#000000",
                  fontWeight: 500,
                  lineHeight: "1.2",
                  padding: 0,
                  margin: 0,
                  boxSizing: "border-box",
                  textAlign: layer.textAlign || "left",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                value={layer.text || ""}
                spellCheck={false}
                onChange={(e) => onTextChange(e.target.value)}
                onClick={(e) => e.currentTarget.focus()}
                onPointerDown={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="overflow-hidden wrap-break-word text-ellipsis"
                style={{
                  gridArea: "1 / 1 / 2 / 2",
                  fontSize: layer.fontSize || 18,
                  color: layer.fill || "#000000",
                  fontWeight: 500,
                  lineHeight: "1.2",
                  padding: 0,
                  margin: 0,
                  boxSizing: "border-box",
                  textAlign: layer.textAlign || "left",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {layer.text || ""}
              </div>
            )}
          </div>
        </div>
      </foreignObject>
    </g>
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
  const shapeTextRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (isEditing && shapeTextRef.current) {
      const timer = setTimeout(() => shapeTextRef.current?.focus(), 10)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

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
    const w = layer.width
    const h = layer.height

    if (layer.type === "diamond") {
      points = [
        { x: w / 2, y: 0 },
        { x: w, y: h / 2 },
        { x: w / 2, y: h },
        { x: 0, y: h / 2 },
      ]
    } else if (layer.type === "star") {
      const numPoints = layer.starPoints || 5
      const outerR = 0.5
      const innerR = 0.25
      const tempPoints = []
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints - Math.PI / 2
        const r = i % 2 === 0 ? outerR : innerR
        tempPoints.push({
          x: 0.5 + r * Math.cos(angle),
          y: 0.5 + r * Math.sin(angle),
        })
      }
      // Normalize to [0, 1]
      const minX = Math.min(...tempPoints.map((p) => p.x))
      const maxX = Math.max(...tempPoints.map((p) => p.x))
      const minY = Math.min(...tempPoints.map((p) => p.y))
      const maxY = Math.max(...tempPoints.map((p) => p.y))
      const rangeX = maxX - minX
      const rangeY = maxY - minY

      points = tempPoints.map((p) => ({
        x: ((p.x - minX) / rangeX) * w,
        y: ((p.y - minY) / rangeY) * h,
      }))
    } else {
      // triangle - full height/width
      points = [
        { x: w / 2, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ]
    }
    // Add layer.x/y offset
    const finalPoints = points.map((p) => ({
      x: p.x + layer.x,
      y: p.y + layer.y,
    }))
    shapeProps.d = getRoundedPolygonPath(finalPoints, radius)
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
            "flex h-full w-full items-center px-[15%] py-[10%]",
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
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={cn(
                "grid h-full w-full items-center",
                layer.textAlign === "left"
                  ? "justify-items-start"
                  : layer.textAlign === "right"
                    ? "justify-items-end"
                    : "justify-items-center"
              )}
            >
              <div
                className="invisible h-auto w-full overflow-hidden wrap-break-word whitespace-pre-wrap"
                style={{
                  gridArea: "1 / 1 / 2 / 2",
                  fontFamily: layer.fontFamily,
                  fontSize: layer.fontSize ?? 14,
                  lineHeight: "1.5",
                  padding: 0,
                  margin: 0,
                  boxSizing: "border-box",
                }}
              >
                {(layer.text ?? "\u00A0") +
                  (layer.text?.endsWith("\n") ? "\u00A0" : "")}
              </div>
              {isEditing ? (
                <textarea
                  ref={shapeTextRef}
                  autoFocus
                  rows={1}
                  onFocus={(e) => {
                    const val = e.target.value
                    e.target.value = ""
                    e.target.value = val
                  }}
                  className="scrollbar-hide m-0 h-auto w-full resize-none overflow-hidden border-none bg-transparent p-0 text-inherit outline-none"
                  style={{
                    gridArea: "1 / 1 / 2 / 2",
                    textAlign: layer.textAlign || "center",
                    display: "block",
                    fontFamily: layer.fontFamily,
                    fontSize: layer.fontSize ?? 14,
                    color: layer.textColor || "#000",
                    lineHeight: "1.5",
                    padding: 0,
                    margin: 0,
                    boxSizing: "border-box",
                  }}
                  value={layer.text || ""}
                  spellCheck={false}
                  onChange={(e) => onTextChange(e.target.value)}
                  onClick={(e) => e.currentTarget.focus()}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className="overflow-hidden wrap-break-word"
                  style={{
                    gridArea: "1 / 1 / 2 / 2",
                    textAlign: layer.textAlign || "center",
                    fontFamily: layer.fontFamily,
                    fontSize: layer.fontSize ?? 14,
                    color: layer.textColor || "#000",
                    lineHeight: "1.5",
                    padding: 0,
                    margin: 0,
                    boxSizing: "border-box",
                  }}
                >
                  {layer.text || ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

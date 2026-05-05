import { cn } from "@mindorbit/ui/lib/utils"
import * as React from "react"

import type { Layer, LineLayer, PathLayer } from "@/lib/liveblocks.config"

interface CanvasLayerProps {
  id: string
  layer: Layer
  isSelected: boolean
  isEditing: boolean
  onPointerDown: (e: React.PointerEvent, id: string, layer: Layer) => void
  onDoubleClick: () => void
  onFieldChange: (field: string, val: string) => void
}

export function CanvasLayer({
  id,
  layer,
  isSelected,
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
      {isSelected && !isEditing && (
        <rect
          x={layer.x - 4}
          y={layer.y - 4}
          width={layer.width + 8}
          height={layer.height + 8}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeOpacity={0.5}
          rx={layer.borderRadius ? layer.borderRadius + 4 : 4}
          style={{ pointerEvents: "none" }}
        />
      )}
      {layer.type === "sticky" ? (
        <StickyLayer
          layer={layer}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
      ) : layer.type === "text" ? (
        <TextLayerComponent
          layer={layer}
          isSelected={isSelected}
          isEditing={isEditing}
          onTextChange={(val) => onFieldChange("text", val)}
        />
      ) : layer.type === "path" ? (
        <PathLayerComponent layer={layer as PathLayer} />
      ) : layer.type === "line" || layer.type === "arrow" ? (
        <LineLayerComponent layer={layer as LineLayer} />
      ) : (
        <ShapeLayerComponent
          layer={layer}
          isEditing={isEditing}
          onTextChange={(val) => onFieldChange("text", val)}
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
      strokeWidth={2}
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

function StickyLayer({ layer, isEditing, onFieldChange }: any) {
  const badgeBaseClasses =
    "text-[10px] font-extrabold tracking-wider text-indigo-700 uppercase outline-none"
  const badgeBgClasses = "bg-indigo-50"
  const badgePaddingClasses = "px-2.5"
  const contentClasses = cn(
    "h-full w-full border-none bg-transparent p-0 leading-relaxed outline-none placeholder:text-slate-300 whitespace-pre-wrap break-words",
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

function TextLayerComponent({
  layer,
  isSelected,
  isEditing,
  onTextChange,
}: any) {
  return (
    <foreignObject
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      style={{ pointerEvents: isEditing ? "all" : "none" }}
    >
      {isEditing ? (
        <textarea
          autoFocus
          className={cn(
            "h-full w-full resize-none border-none bg-transparent p-0 font-bold outline-none",
            layer.textAlign === "center"
              ? "text-center"
              : layer.textAlign === "right"
                ? "text-right"
                : "text-left"
          )}
          style={{
            fontSize: layer.fontSize ?? 20,
            fontFamily: layer.fontFamily,
            color: layer.textColor || "#0f172a",
          }}
          value={layer.text || ""}
          onChange={(e) => onTextChange(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
        />
      ) : (
        <div
          className={cn(
            "h-full w-full font-bold wrap-break-word whitespace-pre-wrap transition-all",
            isSelected && "bg-primary/5 rounded-lg px-2 py-1",
            layer.textAlign === "center"
              ? "text-center"
              : layer.textAlign === "right"
                ? "text-right"
                : "text-left"
          )}
          style={{
            fontSize: layer.fontSize ?? 20,
            fontFamily: layer.fontFamily,
            color: layer.textColor || "#0f172a",
          }}
        >
          {layer.text || "Text Idea"}
        </div>
      )}
    </foreignObject>
  )
}

function ShapeLayerComponent({ layer, isEditing, onTextChange }: any) {
  const ShapeTag =
    layer.type === "circle"
      ? "ellipse"
      : layer.type === "rectangle"
        ? "rect"
        : "polygon"

  const shapeProps: any = {
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

  if (layer.type === "rectangle") {
    shapeProps.x = layer.x
    shapeProps.y = layer.y
    shapeProps.width = layer.width
    shapeProps.height = layer.height
    shapeProps.rx = layer.borderRadius ?? 8
  } else if (layer.type === "circle") {
    shapeProps.cx = layer.x + layer.width / 2
    shapeProps.cy = layer.y + layer.height / 2
    shapeProps.rx = layer.width / 2
    shapeProps.ry = layer.height / 2
  } else if (layer.type === "diamond") {
    const cx = layer.x + layer.width / 2
    const cy = layer.y + layer.height / 2
    shapeProps.points = `${cx},${layer.y} ${layer.x + layer.width},${cy} ${cx},${layer.y + layer.height} ${layer.x},${cy}`
  } else if (layer.type === "star") {
    const cx = layer.x + layer.width / 2
    const cy = layer.y + layer.height / 2
    const rx = layer.width / 2
    const ry = layer.height / 2
    const points = []
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2
      const r_x = i % 2 === 0 ? rx : rx * 0.5
      const r_y = i % 2 === 0 ? ry : ry * 0.5
      points.push(`${cx + r_x * Math.cos(angle)},${cy + r_y * Math.sin(angle)}`)
    }
    shapeProps.points = points.join(" ")
  } else {
    shapeProps.points = `${layer.x + layer.width / 2},${layer.y} ${layer.x + layer.width},${layer.y + layer.height} ${layer.x},${layer.y + layer.height}`
  }

  return (
    <g>
      <ShapeTag {...shapeProps} />
      <foreignObject
        x={layer.x + 10}
        y={layer.y + 10}
        width={layer.width - 20}
        height={layer.height - 20}
        style={{ pointerEvents: isEditing ? "all" : "none" }}
      >
        <div
          className={cn(
            "flex h-full w-full items-center overflow-hidden",
            layer.textAlign === "left"
              ? "justify-start"
              : layer.textAlign === "right"
                ? "justify-end"
                : "justify-center"
          )}
        >
          {isEditing ? (
            <div className="grid w-full">
              <div
                className={cn(
                  "invisible col-start-1 row-start-1 p-0 text-sm font-bold wrap-break-word whitespace-pre-wrap",
                  layer.textAlign === "center"
                    ? "text-center"
                    : layer.textAlign === "right"
                      ? "text-right"
                      : "text-left"
                )}
                style={{
                  fontFamily: layer.fontFamily,
                  fontSize: layer.fontSize ?? 14,
                }}
              >
                {(layer.text || "") + " "}
              </div>
              <textarea
                rows={1}
                autoFocus
                className={cn(
                  "col-start-1 row-start-1 h-full min-h-0 w-full resize-none overflow-hidden border-none bg-transparent p-0 text-sm font-bold outline-none",
                  layer.textAlign === "center"
                    ? "text-center"
                    : layer.textAlign === "right"
                      ? "text-right"
                      : "text-left"
                )}
                style={{
                  color: layer.textColor || "#000",
                  fontFamily: layer.fontFamily,
                  fontSize: layer.fontSize ?? 14,
                }}
                value={layer.text || ""}
                onChange={(e) => onTextChange(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
              />
            </div>
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center overflow-hidden text-sm font-bold wrap-break-word whitespace-pre-wrap",
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
              {layer.text}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

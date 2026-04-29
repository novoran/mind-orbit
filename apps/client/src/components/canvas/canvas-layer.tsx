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
  onTextChange: (val: string) => void
}

export function CanvasLayer({
  id,
  layer,
  isSelected,
  isEditing,
  onPointerDown,
  onDoubleClick,
  onTextChange,
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
    <g transform={`rotate(${rotation}, ${cx}, ${cy})`} {...commonProps}>
      {layer.type === "sticky" ? (
        <StickyLayer
          layer={layer}
          isEditing={isEditing}
          onTextChange={onTextChange}
        />
      ) : layer.type === "text" ? (
        <TextLayerComponent
          layer={layer}
          isSelected={isSelected}
          isEditing={isEditing}
          onTextChange={onTextChange}
        />
      ) : layer.type === "path" ? (
        <PathLayerComponent layer={layer as PathLayer} />
      ) : layer.type === "line" || layer.type === "arrow" ? (
        <LineLayerComponent layer={layer as LineLayer} />
      ) : (
        <ShapeLayerComponent
          layer={layer}
          isEditing={isEditing}
          onTextChange={onTextChange}
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
        markerEnd={layer.type === "arrow" ? `url(#arrowhead-${layer.type})` : undefined}
        strokeLinecap="round"
      />
    </g>
  )
}

function StickyLayer({ layer, isEditing, onTextChange }: any) {
  return (
    <g>
      <rect
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        rx={8}
        fill={layer.fill || "white"}
        filter="drop-shadow(0 10px 30px rgba(0,0,0,0.08))"
        className="transition-all duration-300"
      />
      <g transform={`translate(${layer.x + 20}, ${layer.y + 20})`}>
        <rect width={80} height={24} rx={4} fill="#e0e7ff" />
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
        <text
          y={50}
          fontSize="18"
          fontWeight="700"
          fill={layer.textColor || "#1e1b4b"}
          style={{ pointerEvents: "none" }}
        >
          {layer.text?.substring(0, 15) || "Untitled Card"}
        </text>
      </g>
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
            className="h-full w-full resize-none border-none bg-transparent p-0 text-[14px] leading-relaxed outline-none"
            style={{ color: layer.textColor || "#475569" }}
            defaultValue={layer.text || ""}
            onBlur={(e) => onTextChange(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="line-clamp-4 h-full w-full text-[14px] leading-relaxed"
            style={{ color: layer.textColor || "#64748b" }}
          >
            {layer.text || ""}
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
        <input
          autoFocus
          className="w-full border-none bg-transparent p-0 text-xl font-bold outline-none"
          style={{
            fontSize: layer.fontSize,
            color: layer.textColor || "#0f172a",
          }}
          defaultValue={layer.text || ""}
          onBlur={(e) => onTextChange(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      ) : (
        <div
          className={cn(
            "trunct-xl w-full font-bold transition-all",
            isSelected && "bg-primary/5 rounded-lg px-2 py-1"
          )}
          style={{
            fontSize: layer.fontSize,
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
    fillOpacity: 0.9,
    stroke: layer.stroke || "#000000",
    strokeWidth: layer.strokeWidth || 2,
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
  } else if (layer.type === "star") {
    const cx = layer.x + layer.width / 2
    const cy = layer.y + layer.height / 2
    const outerRadius = Math.min(layer.width, layer.height) / 2
    const innerRadius = outerRadius * 0.5
    const points = []
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      points.push(
        `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`
      )
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
        y={layer.y + layer.height / 2 - 15}
        width={layer.width - 20}
        height={30}
        style={{ pointerEvents: isEditing ? "all" : "none" }}
      >
        {isEditing ? (
          <input
            autoFocus
            className="w-full border-none bg-transparent p-0 text-center text-sm font-bold outline-none"
            style={{ color: layer.textColor || "#000" }}
            defaultValue={layer.text || ""}
            onBlur={(e) => onTextChange(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
        ) : (
          <div
            className="w-full truncate text-center text-sm font-bold"
            style={{ color: layer.textColor || "#000" }}
          >
            {layer.text}
          </div>
        )}
      </foreignObject>
    </g>
  )
}

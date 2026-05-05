import { CopyIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"
import { SHAPE_COLORS } from "./constants"

import type { Layer } from "@/lib/liveblocks.config"

interface ContextToolbarProps {
  layer: Layer
  onUpdateStyle: (
    style: Partial<{
      fill: string
      stroke: string
      strokeWidth: number
      textColor?: string
    }>
  ) => void
  onDuplicate: () => void
  onDelete: () => void
  camera: { x: number; y: number; zoom: number }
}

export function ContextToolbar({
  layer,
  onUpdateStyle,
  onDuplicate,
  onDelete,
  camera,
}: ContextToolbarProps) {
  const x = layer.x * camera.zoom + camera.x
  const y = layer.y * camera.zoom + camera.y - 60 // Float above

  return (
    <div
      className="bg-background/90 border-border animate-in fade-in zoom-in-95 absolute z-50 flex items-center gap-1.5 rounded-lg border p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-200"
      style={{
        left: Math.max(20, x + (layer.width * camera.zoom) / 2),
        top: Math.max(20, y),
        transform: "translateX(-50%)",
      }}
    >
      {/* Background Colors (including transparent) */}
      <div className="flex items-center gap-1 px-1">
        {["transparent", ...SHAPE_COLORS.slice(0, 5)].map((color) => (
          <button
            key={color}
            onClick={(e) => {
              e.stopPropagation()
              onUpdateStyle({ fill: color })
            }}
            className={cn(
              "h-5 w-5 cursor-pointer rounded-sm transition-transform hover:scale-110 border border-border flex items-center justify-center overflow-hidden",
              layer.fill === color && "ring-ring ring-2 ring-offset-1"
            )}
            style={{ backgroundColor: color === "transparent" ? "white" : color }}
            title={color === "transparent" ? "Transparent" : `Fill ${color}`}
          >
            {color === "transparent" && (
              <div className="h-[1px] w-full rotate-45 bg-red-500" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-border mx-1 h-4 w-px" />

      {/* Border Color Picker (also sets Text Color for shapes) */}
      <div className="flex items-center gap-1 px-1">
        {["#000000", "#ef4444", "#3b82f6", "#ffffff"].map((color) => (
          <button
            key={color}
            onClick={(e) => {
              e.stopPropagation()
              onUpdateStyle({
                stroke: color,
                strokeWidth: 2,
                ...(layer.type !== "sticky" && layer.type !== "text"
                  ? { textColor: color }
                  : {}),
              })
            }}
            className={cn(
              "border-border flex h-5 w-5 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-transform hover:scale-110",
              layer.stroke === color && "ring-ring ring-2 ring-offset-1"
            )}
            style={{
              backgroundColor: color,
            }}
            title={`Border ${color}`}
          />
        ))}
      </div>

      <div className="bg-border mx-1 h-4 w-px" />

      {/* Text Color Picker (Available for all layers) */}
      <div className="flex items-center gap-1 px-1">
        {["#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981"].map(
          (color) => (
            <button
              key={color}
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ textColor: color } as any)
              }}
              className={cn(
                "border-border h-4 w-4 cursor-pointer rounded-full border transition-transform hover:scale-110",
                (layer as any).textColor === color &&
                  "ring-ring ring-1 ring-offset-1"
              )}
              style={{ backgroundColor: color }}
              title={`Text ${color}`}
            />
          )
        )}
      </div>

      <div className="bg-border mx-1 h-4 w-px" />

      {/* Border Styles */}
      <div className="flex items-center gap-1 px-1">
        {[
          { label: "Solid", value: undefined },
          { label: "Dashed", value: "8 4" },
          { label: "Dotted", value: "2 2" },
        ].map((style) => (
          <button
            key={style.label}
            onClick={(e) => {
              e.stopPropagation()
              onUpdateStyle({ dashArray: style.value } as any)
            }}
            className={cn(
              "border-border flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border transition-transform hover:scale-110",
              layer.dashArray === style.value && "bg-accent border-primary"
            )}
            title={style.label}
          >
            <div
              className={cn(
                "w-full border-t-2 border-foreground",
                style.label === "Dashed"
                  ? "border-dashed"
                  : style.label === "Dotted"
                    ? "border-dotted"
                    : "border-solid"
              )}
            />
          </button>
        ))}
      </div>

      <div className="bg-border mx-1 h-4 w-px" />

      {/* Corner Radius (Roundedness) */}
      <div className="flex items-center gap-1 px-1">
        {[
          { label: "None", value: 0, icon: "M2 2h8v8H2z" }, // Square
          { label: "MD", value: 8, icon: "M2 2h4c2.2 0 4 1.8 4 4v4H2z" }, // Rounded
          { label: "XL", value: 16, icon: "M2 2h2c3.3 0 6 2.7 6 6v2H2z" }, // Extra Rounded
        ].map((radius) => (
          <button
            key={radius.label}
            onClick={(e) => {
              e.stopPropagation()
              onUpdateStyle({ borderRadius: radius.value } as any)
            }}
            className={cn(
              "border-border flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border transition-transform hover:scale-110",
              (layer.borderRadius ?? (layer.type === "sticky" ? 12 : 8)) ===
                radius.value && "bg-accent border-primary"
            )}
            title={`Radius ${radius.label}`}
          >
            <svg
              viewBox="0 0 12 12"
              className="h-3 w-3 fill-none stroke-current"
              strokeWidth="2"
            >
              <path d={radius.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <div className="bg-border mx-1 h-4 w-px" />

      {/* Duplicate Action */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDuplicate()
        }}
        className="text-muted-foreground hover:bg-muted flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
        title="Duplicate"
      >
        <HugeiconsIcon icon={CopyIcon} size={14} />
      </button>

      {/* Delete Action */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="text-destructive hover:bg-destructive/10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
        title="Delete (Eraser)"
      >
        <HugeiconsIcon icon={Delete02Icon} size={14} />
      </button>
    </div>
  )
}

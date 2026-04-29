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
            onClick={() => onUpdateStyle({ fill: color })}
            className={cn(
              "h-5 w-5 rounded-sm transition-transform hover:scale-110 border border-border flex items-center justify-center overflow-hidden",
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
            onClick={() =>
              onUpdateStyle({
                stroke: color,
                strokeWidth: 2,
                ...(layer.type !== "sticky" && layer.type !== "text"
                  ? { textColor: color }
                  : {}),
              })
            }
            className={cn(
              "border-border flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border transition-transform hover:scale-110",
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

      {/* Text Color Picker (Only for sticky and text) */}
      {(layer.type === "sticky" || layer.type === "text") && (
        <>
          <div className="flex items-center gap-1 px-1">
            {["#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981"].map(
              (color) => (
                <button
                  key={color}
                  onClick={() => onUpdateStyle({ textColor: color } as any)}
                  className={cn(
                    "border-border h-4 w-4 rounded-full border transition-transform hover:scale-110",
                    (layer as any).textColor === color &&
                      "ring-ring ring-1 ring-offset-1"
                  )}
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
          <div className="bg-border mx-1 h-4 w-px" />
        </>
      )}

      {/* Duplicate Action */}
      <button
        onClick={onDuplicate}
        className="text-muted-foreground hover:bg-muted flex h-7 w-7 items-center justify-center rounded-md transition-colors"
        title="Duplicate"
      >
        <HugeiconsIcon icon={CopyIcon} size={14} />
      </button>

      {/* Delete Action */}
      <button
        onClick={onDelete}
        className="text-destructive hover:bg-destructive/10 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
        title="Delete (Eraser)"
      >
        <HugeiconsIcon icon={Delete02Icon} size={14} />
      </button>
    </div>
  )
}

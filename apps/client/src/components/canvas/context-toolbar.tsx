import {
  CopyIcon,
  Delete02Icon,
  LayerBringForwardIcon,
  LayerBringToFrontIcon,
  LayerSendBackwardIcon,
  LayerSendToBackIcon,
  PaintBucketIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"

import type { Layer } from "@/lib/liveblocks.config"

interface ContextToolbarProps {
  layer: Layer
  onUpdateStyle: (
    style: Partial<{
      fill: string
      stroke: string
      strokeWidth: number
      textColor?: string
      opacity?: number
      textAlign?: "left" | "center" | "right"
      fontFamily?: string
      fontSize?: number
      dashArray?: string
      borderRadius?: number
    }>
  ) => void
  onDuplicate: () => void
  onDelete: () => void
  onBringToFront: () => void
  onSendToBack: () => void
  onMoveForward: () => void
  onMoveBackward: () => void
}

const FONTS = [
  { name: "Sans", value: "ui-sans-serif, system-ui, sans-serif" },
  { name: "Serif", value: "ui-serif, Georgia, serif" },
  { name: "Mono", value: "ui-monospace, monospace" },
  { name: "Hand", value: "'Caveat', cursive" },
]

const FONT_SIZES = [
  { label: "S", value: 14 },
  { label: "M", value: 20 },
  { label: "L", value: 32 },
  { label: "XL", value: 48 },
]

function ToolbarSection({
  title,
  children,
  className,
  extra,
}: {
  title: string
  children: React.ReactNode
  className?: string
  extra?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground/70 text-[10px] font-bold tracking-wider">
          {title}
        </span>
        {extra}
      </div>
      <div className="flex flex-row flex-wrap items-center gap-1">
        {children}
      </div>
    </div>
  )
}

function ColorPicker({
  colors,
  selectedColor,
  onChange,
  shape = "rounded-full",
  showTransparent = false,
}: {
  colors: Array<string>
  selectedColor?: string
  onChange: (color: string) => void
  shape?: "rounded-sm" | "rounded-full"
  showTransparent?: boolean
}) {
  const isCustom =
    selectedColor &&
    selectedColor !== "transparent" &&
    !colors.includes(selectedColor)

  return (
    <>
      {showTransparent && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onChange("transparent")
          }}
          className={cn(
            "border-border flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden border bg-white transition-all hover:scale-110",
            shape,
            selectedColor === "transparent" &&
              "ring-primary ring-1 ring-offset-1"
          )}
          title="Transparent"
        >
          <div className="h-px w-full rotate-45 bg-red-500" />
        </button>
      )}
      {colors.map((color) => (
        <button
          key={color}
          onClick={(e) => {
            e.stopPropagation()
            onChange(color)
          }}
          className={cn(
            "border-border h-6 w-6 cursor-pointer border transition-all hover:scale-110",
            shape,
            selectedColor === color && "ring-primary ring-2 ring-offset-2"
          )}
          style={{ backgroundColor: color }}
          title={`Color ${color}`}
        />
      ))}
      <div className="relative h-6 w-6">
        <input
          type="color"
          value={selectedColor?.startsWith("#") ? selectedColor : "#000000"}
          onChange={(e) => {
            e.stopPropagation()
            onChange(e.target.value)
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className={cn(
            "border-border pointer-events-none flex h-6 w-6 items-center justify-center border transition-all",
            shape,
            isCustom && "ring-primary ring-2 ring-offset-2"
          )}
          style={{
            backgroundColor: isCustom ? selectedColor : "transparent",
          }}
        >
          <HugeiconsIcon
            icon={PaintBucketIcon}
            size={12}
            className={cn(
              "text-muted-foreground/50",
              isCustom && "text-white mix-blend-difference"
            )}
          />
        </div>
      </div>
    </>
  )
}

export function ContextToolbar({
  layer,
  onUpdateStyle,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onMoveForward,
  onMoveBackward,
}: ContextToolbarProps) {
  const commonColors = [
    "#000000",
    "#ffffff",
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
  ]

  return (
    <div className="bg-background/90 border-border animate-in fade-in slide-in-from-left-4 fixed top-1/2 left-6 z-50 flex w-60 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-xl border shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="scrollbar-hide flex max-h-[75vh] flex-col gap-1.5 overflow-y-auto p-4">
        <ToolbarSection title="Background">
          <ColorPicker
            colors={commonColors}
            selectedColor={layer.fill}
            onChange={(color) => onUpdateStyle({ fill: color })}
            shape="rounded-sm"
            showTransparent
          />
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Text">
          <ColorPicker
            colors={commonColors}
            selectedColor={layer.textColor}
            onChange={(color) => onUpdateStyle({ textColor: color })}
            shape="rounded-full"
          />
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Border">
          <ColorPicker
            colors={commonColors}
            selectedColor={layer.stroke}
            onChange={(color) =>
              onUpdateStyle({
                stroke: color,
                strokeWidth: layer.strokeWidth || 2,
              })
            }
            shape="rounded-full"
          />
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Stroke">
          {[2, 4, 8, 12].map((sw) => (
            <button
              key={sw}
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ strokeWidth: sw })
              }}
              className={cn(
                "border-border hover:bg-muted flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition-all",
                (layer.strokeWidth || 2) === sw &&
                  "bg-primary/10 border-primary"
              )}
              title={`Stroke ${sw}px`}
            >
              <div
                className="bg-foreground rounded-full"
                style={{ height: sw / 2 + 1, width: sw / 2 + 1 }}
              />
            </button>
          ))}
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Style">
          {[undefined, "8 4", "2 2"].map((dash) => (
            <button
              key={dash || "solid"}
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ dashArray: dash })
              }}
              className={cn(
                "border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all",
                layer.dashArray === dash && "bg-primary/10 border-primary"
              )}
              title={dash ? "Dashed/Dotted" : "Solid"}
            >
              <div
                className={cn(
                  "border-foreground w-4 border-t-2",
                  dash === "8 4"
                    ? "border-dashed"
                    : dash === "2 2"
                      ? "border-dotted"
                      : "border-solid"
                )}
              />
            </button>
          ))}
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Rounded">
          {[0, 8, 16].map((radius) => (
            <button
              key={radius}
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ borderRadius: radius })
              }}
              className={cn(
                "border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all",
                (layer.borderRadius ?? (layer.type === "sticky" ? 12 : 8)) ===
                  radius && "bg-primary/10 border-primary"
              )}
              title={`Radius ${radius}px`}
            >
              <div
                className="border-foreground h-3.5 w-3.5 border-2"
                style={{ borderRadius: radius / 2 }}
              />
            </button>
          ))}
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Font">
          <div className="flex flex-row flex-wrap items-center gap-1">
            {FONTS.map((font) => (
              <button
                key={font.value}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateStyle({ fontFamily: font.value })
                }}
                className={cn(
                  "border-border hover:bg-muted flex h-7 cursor-pointer items-center justify-center rounded-md border px-2 text-[10px] font-medium transition-all",
                  (layer.fontFamily === font.value ||
                    (!layer.fontFamily && font.name === "Sans")) &&
                    "bg-primary/10 border-primary text-primary"
                )}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Size">
          <div className="flex flex-row flex-wrap items-center gap-1">
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateStyle({ fontSize: size.value })
                }}
                className={cn(
                  "border-border hover:bg-muted flex h-7 w-8 cursor-pointer items-center justify-center rounded-md border text-[10px] font-medium transition-all",
                  (layer.fontSize === size.value ||
                    (!layer.fontSize && size.value === 20)) &&
                    "bg-primary/10 border-primary text-primary"
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Align">
          <div className="flex flex-row items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ textAlign: "left" })
              }}
              className={cn(
                "border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all",
                (layer.textAlign === "left" || !layer.textAlign) &&
                  "bg-primary/10 border-primary text-primary"
              )}
            >
              <HugeiconsIcon icon={TextAlignLeftIcon} size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ textAlign: "center" })
              }}
              className={cn(
                "border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all",
                layer.textAlign === "center" &&
                  "bg-primary/10 border-primary text-primary"
              )}
            >
              <HugeiconsIcon icon={TextAlignCenterIcon} size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateStyle({ textAlign: "right" })
              }}
              className={cn(
                "border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all",
                layer.textAlign === "right" &&
                  "bg-primary/10 border-primary text-primary"
              )}
            >
              <HugeiconsIcon icon={TextAlignRightIcon} size={16} />
            </button>
          </div>
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection
          title="Opacity"
          extra={
            <span className="text-muted-foreground/50 text-[10px] font-medium">
              {Math.round((layer.opacity ?? 1) * 100)}%
            </span>
          }
        >
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={layer.opacity ?? 1}
            onChange={(e) => {
              e.stopPropagation()
              onUpdateStyle({ opacity: parseFloat(e.target.value) })
            }}
            className="bg-muted accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
          />
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Layers">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBringToFront()
            }}
            className="border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all"
            title="Bring to Front"
          >
            <HugeiconsIcon icon={LayerBringToFrontIcon} size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveForward()
            }}
            className="border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all"
            title="Move Forward"
          >
            <HugeiconsIcon icon={LayerBringForwardIcon} size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveBackward()
            }}
            className="border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all"
            title="Move Backward"
          >
            <HugeiconsIcon icon={LayerSendBackwardIcon} size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSendToBack()
            }}
            className="border-border hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border transition-all"
            title="Send to Back"
          >
            <HugeiconsIcon icon={LayerSendToBackIcon} size={16} />
          </button>
        </ToolbarSection>

        <div className="bg-border h-px w-full" />

        <ToolbarSection title="Action">
          <div className="flex w-full flex-row items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
              className="text-muted-foreground hover:bg-muted hover:text-foreground border-border flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-[11px] font-bold transition-colors"
              title="Duplicate"
            >
              <HugeiconsIcon icon={CopyIcon} size={14} />
              Duplicate
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-destructive hover:bg-destructive/10 border-destructive/20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors"
              title="Delete"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </div>
        </ToolbarSection>
      </div>
    </div>
  )
}

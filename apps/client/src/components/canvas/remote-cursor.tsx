import * as React from "react"

interface RemoteCursorProps {
  x: number
  y: number
  color: string
  name: string
}

export function RemoteCursor({ x, y, color, name }: RemoteCursorProps) {
  return (
    <g
      style={{ pointerEvents: "none" }}
      className="transition-transform duration-100"
    >
      <path
        d={`M ${x} ${y} L ${x} ${y + 18} L ${x + 5} ${y + 13} L ${x + 11} ${y + 13} Z`}
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
      <g transform={`translate(${x + 12}, ${y + 4})`}>
        <rect
          width={name.length * 7 + 12}
          height={18}
          rx={4}
          fill={color}
          className="shadow-sm"
        />
        <text x={6} y={13} fontSize="10" fill="white" fontWeight="800">
          {name}
        </text>
      </g>
    </g>
  )
}

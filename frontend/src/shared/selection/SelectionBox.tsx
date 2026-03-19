import type { SelectionBox as Box } from "./types"

export function SelectionBox({ box }: { box: Box }) {
  return (
    <div
      className="absolute border border-blue-400 
      bg-blue-200/20 pointer-events-none z-50"
      style={{
        left: Math.min(box.x, box.x + box.width),
        top: Math.min(box.y, box.y + box.height),
        width: Math.abs(box.width),
        height: Math.abs(box.height),
      }}
    />
  )
}
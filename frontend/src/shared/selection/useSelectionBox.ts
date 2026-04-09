import { useRef, useState, useEffect } from "react"
import type { SelectionBox } from "./types"

type Params = {
  setSelected: (ids: string[]) => void
  clear: () => void
  containerRef: React.RefObject<HTMLElement | null>
}

export function useSelectionBox({
  setSelected,
  clear,
  containerRef,
}: Params) {
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)

  const startRef = useRef<{ x: number; y: number } | null>(null)
  const isSelectingRef = useRef(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return

    const target = e.target as HTMLElement
    if (target.closest("[data-item-id]")) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()

    isSelectingRef.current = true

    startRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setSelectionBox({
      x: startRef.current.x,
      y: startRef.current.y,
      width: 0,
      height: 0,
    })

    clear()
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isSelectingRef.current || !startRef.current) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()

      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

      const width = x - startRef.current.x
      const height = y - startRef.current.y

      if (Math.abs(width) < 4 && Math.abs(height) < 4) return

      const newBox = {
        x: startRef.current.x,
        y: startRef.current.y,
        width,
        height,
      }

      setSelectionBox(newBox)

      const box = {
        left: Math.min(newBox.x, newBox.x + newBox.width),
        right: Math.max(newBox.x, newBox.x + newBox.width),
        top: Math.min(newBox.y, newBox.y + newBox.height),
        bottom: Math.max(newBox.y, newBox.y + newBox.height),
      }

      const elements = container.querySelectorAll("[data-item-id]")
      const selected: string[] = []

      elements.forEach((el) => {
        const id = el.getAttribute("data-item-id")
        if (!id) return

        const elRect = el.getBoundingClientRect()

        const relative = {
          left: elRect.left - rect.left,
          right: elRect.right - rect.left,
          top: elRect.top - rect.top,
          bottom: elRect.bottom - rect.top,
        }

        const isInside =
          relative.right > box.left &&
          relative.left < box.right &&
          relative.bottom > box.top &&
          relative.top < box.bottom

        if (isInside) {
          selected.push(id)
        }
      })

      setSelected(selected)
    }

    function handleMouseUp() {
      if (!isSelectingRef.current) return

      setSelectionBox(null)
      startRef.current = null
      isSelectingRef.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [setSelected, containerRef])

  return {
    selectionBox,
    handleMouseDown,
    isSelectingRef,
  }
}
import { useRef } from "react"
import { File } from "lucide-react"
import type { FileEntity } from "../types"
import { useDraggable } from "@dnd-kit/core"

import { useItemSelectionStore } from "@/features/items/store"
import { usePreviewStore } from "@/features/files/store"

interface Props {
  file: FileEntity
  isSelecting?: boolean
  isGroupDragging?: boolean
}

export function FileItem({
  file,
  isSelecting,
  isGroupDragging,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const itemId = `file-${file.id}`

  const { selectedIds, toggle, setSelected } = useItemSelectionStore()
  const isSelected = selectedIds.includes(itemId)

  const isGroupItem = isGroupDragging && selectedIds.includes(itemId)

  const openPreview = usePreviewStore((s) => s.open)

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: itemId,
    disabled: isSelecting || (isGroupDragging && !isSelected),
  })

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || isSelecting || isGroupDragging) return

    if (e.ctrlKey || e.metaKey) {
      toggle(itemId)
      return
    }

    if (isSelected) {
      setSelected([])
    } else {
      setSelected([itemId])
    }
  }

  const handleDoubleClick = () => {
    if (isDragging || isSelecting || isGroupDragging) return
    openPreview(file)
  }

  return (
    <div ref={setNodeRef} className="relative" data-item-id={itemId}>
      <div
        {...listeners}
        {...attributes}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
          ${
            isSelected
              ? "hover:bg-blue-200"
              : !isSelecting
              ? "hover:bg-gray-100"
              : ""
          }

          ${(isDragging || isGroupItem) ? "opacity-30" : ""}

          ${isSelected ? "bg-blue-50 border border-blue-400" : ""}
        `}
      >
        <File size={18} className="text-gray-600 shrink-0" />
        <span className="text-sm font-medium truncate">
          {file.name}
        </span>
      </div>
    </div>
  )
}
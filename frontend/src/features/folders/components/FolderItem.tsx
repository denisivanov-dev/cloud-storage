import { useState, useRef, useEffect } from "react"
import { Folder } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Folder as FolderType } from "../types"
import { useDraggable, useDroppable } from "@dnd-kit/core"

import { FolderClickMenu } from "./FolderClickMenu"
import { useItemSelectionStore } from "@/features/items/store"

interface Props {
  folder: FolderType
  isSelecting?: boolean
  isGroupDragging?: boolean
}

export function FolderItem({
  folder,
  isSelecting,
  isGroupDragging,
}: Props) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const itemId = `folder-${folder.id}`

  const { selectedIds, toggle, setSelected } = useItemSelectionStore()
  const isSelected = selectedIds.includes(itemId)

  const isGroupItem = isGroupDragging && selectedIds.includes(itemId)

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: itemId,
    disabled: isSelecting || (isGroupDragging && !isSelected),
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: itemId,
  })

  const setRefs = (node: HTMLDivElement | null) => {
    setDragRef(node)
    setDropRef(node)
    ref.current = node
  }

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
    if (isSelecting || isGroupDragging) return
    navigate(`/dashboard/folders/${folder.id}`)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isGroupDragging) return
    setOpen(true)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={setRefs} className="relative" data-item-id={itemId}>
      <div
        {...listeners}
        {...attributes}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
          ${
            isOver
              ? "bg-blue-100"
              : isSelected
              ? "hover:bg-blue-200"
              : !isSelecting
              ? "hover:bg-gray-100"
              : ""
          }

          ${(isDragging || isGroupItem) ? "opacity-30" : ""}

          ${isSelected ? "bg-blue-50 border border-blue-400" : ""}
        `}
      >
        <Folder size={18} className="text-gray-600 shrink-0" />
        <span className="text-sm font-medium truncate">
          {folder.name}
        </span>
      </div>

      <FolderClickMenu
        open={open}
        folderId={folder.id}
        onDownload={() => console.log("download", folder.id)}
        onCloseMenu={() => setOpen(false)}
      />
    </div>
  )
}
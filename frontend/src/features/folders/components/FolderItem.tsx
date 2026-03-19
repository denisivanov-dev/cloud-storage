import { useState, useRef, useEffect } from "react"
import { Folder } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Folder as FolderType } from "../types"
import { useDraggable, useDroppable } from "@dnd-kit/core"

import { FolderClickMenu } from "./FolderClickMenu"
import { useFolderSelectionStore } from "../store"

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

  const { selectedIds, toggle, setSelected } = useFolderSelectionStore()
  const isSelected = selectedIds.includes(folder.id)

  const isGroupItem = isGroupDragging && selectedIds.includes(folder.id)

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: folder.id,
    disabled: isSelecting || (isGroupDragging && !isSelected),
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: folder.id,
  })

  const setRefs = (node: HTMLDivElement | null) => {
    setDragRef(node)
    setDropRef(node)
    ref.current = node
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || isSelecting || isGroupDragging) return

    if (e.ctrlKey || e.metaKey) {
      toggle(folder.id)
      return
    }

    if (isSelected) {
      setSelected([])
    } else {
      setSelected([folder.id])
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
    <div ref={setRefs} className="relative" data-folder-id={folder.id}>
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
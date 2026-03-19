import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useState, useRef } from "react"
import { Folder as FolderIcon } from "lucide-react"
import type { Folder } from "../types"
import { FolderItem } from "./FolderItem"
import { useMoveFolder } from "../hooks"
import { useMoveFolders } from "../hooks"
import { useFolderSelectionStore } from "../store"

import { useSelectionBox } from "@/shared/selection/useSelectionBox"
import { SelectionBox } from "@/shared/selection/SelectionBox"

export function FolderList({ folders }: { folders: Folder[] }) {
  const moveFolder = useMoveFolder()
  const moveFolders = useMoveFolders()
  const { selectedIds, setSelected, clear } = useFolderSelectionStore()

  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const {
    selectionBox,
    handleMouseDown,
    isSelectingRef,
  } = useSelectionBox({ setSelected, clear, containerRef })

  function handleDragStart(event: any) {
    isSelectingRef.current = false
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const fromId = Number(active.id)
    const toId = Number(over.id)

    const idsToMove =
      selectedIds.length > 0 && selectedIds.includes(fromId)
        ? selectedIds
        : [fromId]
        
    if (idsToMove.includes(toId)) {
      setActiveId(null)
      return
    }

    if (fromId === toId) {
      setActiveId(null)
      return
    }


    const filtered = idsToMove.filter((id) => id !== toId)

    if (filtered.length === 0) {
      setActiveId(null)
      return
    }

    if (filtered.length === 1) {
      moveFolder.mutate({
        id: filtered[0],
        parent_id: toId,
      })
    } else {
      moveFolders.mutate({
        ids: filtered,
        parent_id: toId,
      })
    }

    setActiveId(null)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const isGroupDragging = activeId !== null && selectedIds.includes(activeId)

  const activeFolder = folders.find((f) => f.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        ref={containerRef}
        className="relative divide-y divide-gray-200 h-full"
        onMouseDown={handleMouseDown}
      >
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isSelecting={isSelectingRef.current}
            isGroupDragging={isGroupDragging}
          />
        ))}

        {selectionBox && <SelectionBox box={selectionBox} />}
      </div>

      <DragOverlay>
        {activeFolder ? (
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white shadow-md rounded-lg border border-gray-200">
            <FolderIcon size={15} className="text-gray-600 shrink-0" />
            <span className="max-w-36 text-sm font-medium truncate">
              {selectedIds.length > 1 && selectedIds.includes(activeFolder.id)
                ? `${selectedIds.length} folders`
                : activeFolder.name}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
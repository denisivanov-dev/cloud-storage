import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useState, useRef } from "react"
import { Folder as FolderIcon, File as FileIcon } from "lucide-react"

import type { Folder } from "@/features/folders/types"
import type { FileEntity } from "@/features/files/types"

import { FolderItem } from "@/features/folders/components/FolderItem"
import { FileItem } from "@/features/files/components/FileItem"

import { useMoveFolder, useMoveFolders } from "@/features/folders/hooks"
import { useItemSelectionStore } from "@/features/items/store"

import { useSelectionBox } from "@/shared/selection/useSelectionBox"
import { SelectionBox } from "@/shared/selection/SelectionBox"

interface Props {
  folders: Folder[]
  files: FileEntity[]
}

export function ItemList({ folders, files }: Props) {
  const moveFolder = useMoveFolder()
  const moveFolders = useMoveFolders()

  const { selectedIds, setSelected, clear } = useItemSelectionStore()

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const {
    selectionBox,
    handleMouseDown,
    isSelectingRef,
  } = useSelectionBox({ setSelected, clear, containerRef })

  const items = [
    ...folders.map((f) => ({ ...f, type: "folder" as const })),
    ...files.map((f) => ({ ...f, type: "file" as const })),
  ].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1
    return a.name.localeCompare(b.name)
  })

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

    const fromId = String(active.id)
    const toId = String(over.id)

    if (!toId.startsWith("folder-")) {
      setActiveId(null)
      return
    }

    const targetFolderId = Number(toId.replace("folder-", ""))

    const idsToMove =
      selectedIds.length > 0 && selectedIds.includes(fromId)
        ? selectedIds
        : [fromId]

    const folderIds = idsToMove
      .filter((id) => id.startsWith("folder-"))
      .map((id) => Number(id.replace("folder-", "")))

    if (folderIds.length === 0) {
      setActiveId(null)
      return
    }

    const filtered = folderIds.filter((id) => id !== targetFolderId)

    if (filtered.length === 0) {
      setActiveId(null)
      return
    }

    if (filtered.length === 1) {
      moveFolder.mutate({
        id: filtered[0],
        parent_id: targetFolderId,
      })
    } else {
      moveFolders.mutate({
        ids: filtered,
        parent_id: targetFolderId,
      })
    }

    setActiveId(null)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const isGroupDragging =
    activeId !== null && selectedIds.includes(activeId)

  const activeItem = items.find(
    (item) =>
      `folder-${item.id}` === activeId ||
      `file-${item.id}` === activeId
  )

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
        {items.map((item) =>
          item.type === "folder" ? (
            <FolderItem
              key={`folder-${item.id}`}
              folder={item}
              isSelecting={isSelectingRef.current}
              isGroupDragging={isGroupDragging}
            />
          ) : (
            <FileItem
              key={`file-${item.id}`}
              file={item}
              isSelecting={isSelectingRef.current}
              isGroupDragging={isGroupDragging}
            />
          )
        )}

        {selectionBox && <SelectionBox box={selectionBox} />}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white shadow-md rounded-lg border border-gray-200">
            {activeItem.type === "folder" ? (
              <FolderIcon size={15} />
            ) : (
              <FileIcon size={15} />
            )}

            <span className="max-w-36 text-sm font-medium truncate">
              {selectedIds.length > 1
                ? `${selectedIds.length} items`
                : activeItem.name}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
import { useState, useRef, useEffect } from "react"
import { Download, Pencil, Trash2 } from "lucide-react"

import { Dialog } from "@/shared/ui/Dialog"
import { useRenameFolder, useDeleteFolder } from "@/features/folders/hooks"

interface Props {
  open: boolean
  folderId: number
  onDownload: () => void
  onCloseMenu: () => void
}

export function FolderClickMenu({
  open,
  folderId,
  onDownload,
  onCloseMenu
}: Props) {

  const renameFolder = useRenameFolder()
  const deleteFolder = useDeleteFolder()

  const [modal, setModal] = useState<"rename" | "move" | null>(null)
  const [name, setName] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (modal === "rename") {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [modal])

  const handleRename = () => {
    if (!name.trim()) return

    renameFolder.mutate({
      id: folderId,
      name
    })

    setName("")
    setModal(null)
    onCloseMenu()
  }

  const handleDelete = () => {
    deleteFolder.mutate({
      id: folderId
    })
    onCloseMenu()
  }

  return (
    <>
      {/* MENU */}
      <div
        className={`
          absolute left-4 top-full mt-1
          w-48
          bg-white
          border border-gray-200
          rounded-xl
          shadow-lg
          p-2
          z-50

          origin-top
          transition-all duration-200 ease-out

          ${
            open
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
      >

        <button
          onClick={() => {
            setModal("rename")
            onCloseMenu()
          }}
          className="menu-item"
        >
          <Pencil size={16} />
          Rename
        </button>

        <button
          onClick={() => {
            onDownload()
            onCloseMenu()
          }}
          className="menu-item"
        >
          <Download size={16} />
          Download
        </button>

        <div className="my-1 border-t border-gray-200" />

        <button
          onClick={handleDelete}
          className="menu-item text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete
        </button>

      </div>

      {/* RENAME DIALOG */}
      <Dialog
        open={modal === "rename"}
        title="Rename folder"
        onClose={() => setModal(null)}
      >
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              handleRename()
            }
          }}
          placeholder="New folder name"
          className="
            w-full
            border border-gray-200
            rounded-lg
            px-3 py-2
            text-sm
            mb-4
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={() => setModal(null)}
            className="px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleRename}
            className="
              px-4 py-2
              bg-gray-900 text-white
              rounded-lg
              text-sm
            "
          >
            Rename
          </button>

        </div>

      </Dialog>
    </>
  )
}
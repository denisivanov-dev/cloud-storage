import { useState, useRef, useEffect } from "react"
import { Plus, Folder, Upload, FileUp } from "lucide-react"
import { Dialog } from "@/shared/ui/Dialog"
import { useCreateFolder } from "@/features/folders/hooks"
import { useParams } from "react-router-dom"

export function CreateMenuButton() {
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState<"folder" | null>(null)
  const [name, setName] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const createFolder = useCreateFolder()
  const { id } = useParams()

  useEffect(() => {
    if (modal) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [modal])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUploadFile = () => {
    fileInputRef.current?.click()
  }

  const handleUploadFolder = () => {
    folderInputRef.current?.click()
  }

  const handleNewFolder = () => {
    setModal("folder")
    setOpen(false)
  }

  const handleCreate = () => {
    if (!name.trim()) return

    if (modal === "folder") {
      createFolder.mutate({
        name,
        parent_id: id ? Number(id) : null
      })
    }

    setName("")
    setModal(null)
  }

  return (
    <div className="relative" ref={ref}>

      {/* HIDDEN INPUTS */}
      <input type="file" ref={fileInputRef} hidden />

      <input
        type="file"
        ref={folderInputRef}
        hidden
        {...{ webkitdirectory: "true" }}
      />

      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full h-10
          relative flex items-center justify-center
          rounded-lg
          bg-gray-900 text-white
          text-sm font-medium
          hover:bg-black
          transition
        "
      >
        <Plus size={16} className="absolute left-4" />
        Create
      </button>

      {/* MENU */}
      <div
        className={`
          absolute left-0 mt-2
          w-56
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
        <button onClick={handleNewFolder} className="menu-item">
          <Folder size={16} />
          New folder
        </button>

        <div className="my-1 border-t border-gray-200" />

        <button onClick={handleUploadFile} className="menu-item">
          <FileUp size={16} />
          Upload file
        </button>

        <button onClick={handleUploadFolder} className="menu-item">
          <Upload size={16} />
          Upload folder
        </button>

      </div>

      {/* DIALOG */}
      <Dialog
        open={modal !== null}
        title="New Folder"
        onClose={() => setModal(null)}
      >
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              handleCreate()
            }
          }}
          placeholder="Enter name"
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
            onClick={handleCreate}
            className="
              px-4 py-2
              bg-gray-900 text-white
              rounded-lg
              text-sm
            "
          >
            Create
          </button>
        </div>
      </Dialog>

    </div>
  )
}
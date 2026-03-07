import { Folder } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Folder as FolderType } from "../types"

interface Props {
  folder: FolderType
}

export function FolderItem({ folder }: Props) {
  const navigate = useNavigate()

  const handleOpen = () => {
    navigate(`/dashboard/folders/${folder.id}`)
  }

  return (
    <div
      onClick={handleOpen}
      className="
        flex items-center gap-3
        px-4 py-3
        hover:bg-gray-100
        cursor-pointer
        transition
      "
    >
      <Folder size={18} className="text-gray-600 shrink-0" />

      <span className="text-sm font-medium truncate">
        {folder.name}
      </span>
    </div>
  )
}
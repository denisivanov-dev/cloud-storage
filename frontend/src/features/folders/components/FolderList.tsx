import { FolderItem } from "./FolderItem"
import type { Folder } from "../types"

interface Props {
  folders: Folder[]
}

export function FolderList({ folders }: Props) {
  return (
    <div className="divide-y divide-gray-200">
      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
    </div>
  )
}
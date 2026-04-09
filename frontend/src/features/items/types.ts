import type { Folder, FolderBreadcrumb } from "@/features/folders/types"
import type { FileEntity } from "../files/types"

export type ItemsPage = {
  folders: Folder[]
  files: FileEntity[]
  breadcrumb: FolderBreadcrumb[]
}
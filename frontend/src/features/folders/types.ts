export interface Folder {
  id: number
  name: string
  owner_id: number
  parent_id: number | null
  created_at: string
  updated_at: string
}

export interface CreateFolderDto {
  name: string
  parent_id: number | null
}

export interface FolderBreadcrumb {
  id: number
  name: string
}

export interface FolderPage {
  breadcrumb: FolderBreadcrumb[]
  folders: Folder[]
}
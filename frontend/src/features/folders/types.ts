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

export interface RenameFolderDto {
  id: number
  name: string
}

export interface DeleteFolderDto {
  id: number
}

export type MoveFolderDto = {
  id: number
  parent_id: number
}

export type MoveFoldersDto = {
  ids: number[]
  parent_id: number
}
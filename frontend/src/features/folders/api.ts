import { api } from "@/shared/lib/axios"
import type * as T from "./types"

export const getFolders = async (parentId?: number): Promise<T.FolderPage> => {
  const res = await api.get("/folders", {
    params: { parent_id: parentId }
  })

  return res.data
}

export const createFolder = async (data: T.CreateFolderDto): Promise<T.Folder> => {
  const res = await api.post("/folders", data)
  return res.data
}

export const renameFolder = async (data: T.RenameFolderDto): Promise<T.Folder> => {
  const res = await api.patch(`/folders/${data.id}`, {
    name: data.name
  })

  return res.data
}

export const deleteFolder = async (data: T.DeleteFolderDto): Promise<void> => {
  await api.delete(`/folders/${data.id}`)
}

export const moveFolder = async (data: T.MoveFolderDto): Promise<T.Folder> => {
  const res = await api.patch(`/folders/${data.id}/move`, {
    parent_id: data.parent_id
  })

  return res.data
}

export const moveFolders = async (data: T.MoveFoldersDto): Promise<T.Folder[]> => {
  const res = await api.post(`/folders/move-bulk`, {
    ids: data.ids,
    parent_id: data.parent_id,
  })

  return res.data
}
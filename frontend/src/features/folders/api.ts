import { api } from "@/shared/lib/axios"
import type { FolderPage, CreateFolderDto, Folder } from "./types"

export const getFolders = async (parentId?: number): Promise<FolderPage> => {
  const res = await api.get("/folders", {
    params: { parent_id: parentId }
  })

  return res.data
}

export const createFolder = async (data: CreateFolderDto): Promise<Folder> => {
  const res = await api.post("/folders", data)
  return res.data
}
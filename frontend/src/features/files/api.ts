import { api, goApi } from "@/shared/lib/axios"
import type * as T from "./types"

export const getFiles = async (folderId?: number) => {
  const res = await api.get("/files", {
    params: {folder_id: folderId ?? null}
  })

  return res.data
}

export const getFile = async (id: string) => {
  const res = await api.get(`/files/${id}`)
  return res.data
}

export const createFile = async (data: T.CreateFileDto): Promise<T.FileEntity> => {
  const res = await api.post("/files", data)
  return res.data
}

export const uploadFile = async (file: File, storage_key: string) => {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("storage_key", storage_key)

  await goApi.post("/upload", formData)
}

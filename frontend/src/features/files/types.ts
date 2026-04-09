export type FileEntity = {
  id: string
  name: string
  size: number
  content_type: string | null
  folder_id: number | null
  storage_key: string
  status: "pending" | "uploaded"
}

export type CreateFileDto = {
  name: string
  folder_id: number | null
}
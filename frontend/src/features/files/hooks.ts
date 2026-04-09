import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getFiles, getFile,
  createFile, uploadFile
} from "./api"


export const useFiles = (folderId?: number) => {
  return useQuery({
    queryKey: ["files", folderId],
    queryFn: () => getFiles(folderId)
  })
}

export const useFile = (id?: string) => {
  return useQuery({
    queryKey: ["file", id],
    queryFn: () => getFile(id!),
    enabled: !!id,
  })
}

export function useCreateFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] })
    }
  })
}

export function useUploadFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      folder_id,
    }: {
      file: File
      folder_id: number | null
    }) => {
      const meta = await createFile({
        name: file.name,
        folder_id,
      })

      await uploadFile(file, meta.storage_key)

      return meta
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    }
  })
}

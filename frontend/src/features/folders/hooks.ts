import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFolders, createFolder } from "./api"

export const useFolders = (parentId?: number) => {
  return useQuery({
    queryKey: ["folders", parentId],
    queryFn: () => getFolders(parentId)
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFolder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    }
  })
}
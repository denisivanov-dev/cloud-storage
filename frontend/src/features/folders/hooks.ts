import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getFolders, createFolder, 
  renameFolder, deleteFolder,
  moveFolder, moveFolders
} from "./api"

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
      queryClient.invalidateQueries({ queryKey: ["items"] })
    }
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: renameFolder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    }
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFolder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    }
  })
}

export function useMoveFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moveFolder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    }
  })
}

export function useMoveFolders() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moveFolders,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })
}
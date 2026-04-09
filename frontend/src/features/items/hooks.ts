import { useQuery } from "@tanstack/react-query"
import { getItems } from "./api"

export const useItems = (parentId?: number) => {
  return useQuery({
    queryKey: ["items", parentId],
    queryFn: () => getItems(parentId)
  })
}
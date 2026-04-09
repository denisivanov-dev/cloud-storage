import { api } from "@/shared/lib/axios"
import type * as T from "./types"

export const getItems = async (parentId?: number): Promise<T.ItemsPage> => {
  const res = await api.get("/items", {
    params: { parent_id: parentId }
  })

  return res.data
}
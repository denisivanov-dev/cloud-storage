import { create } from "zustand"

type ItemId = string | number

interface ItemSelectionState {
  selectedIds: ItemId[]

  toggle: (id: ItemId) => void
  clear: () => void
  setSelected: (ids: ItemId[]) => void
}

export const useItemSelectionStore = create<ItemSelectionState>((set) => ({
  selectedIds: [],

  toggle: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    }))
  },

  clear: () => {
    set({ selectedIds: [] })
  },

  setSelected: (ids) => {
    set({ selectedIds: ids })
  },
}))
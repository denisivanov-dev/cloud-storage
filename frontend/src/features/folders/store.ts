import { create } from "zustand"

interface FolderSelectionState {
  selectedIds: number[]

  toggle: (id: number) => void
  clear: () => void
  setSelected: (ids: number[]) => void
}

export const useFolderSelectionStore = create<FolderSelectionState>((set) => ({
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
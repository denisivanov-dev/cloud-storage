import { create } from "zustand"
import type { FileEntity } from "./types"

interface PreviewState {
  file: FileEntity | null
  open: (file: FileEntity) => void
  close: () => void
}

export const usePreviewStore = create<PreviewState>((set) => ({
  file: null,

  open: (file) => set({ file }),

  close: () => set({ file: null }),
}))
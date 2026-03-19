import { useEffect } from "react"
import type { ReactNode } from "react"

interface Props {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Dialog({ open, title, children, onClose }: Props) {

  useEffect(() => {
    if (!open) return

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-sm
          rounded-xl bg-white
          shadow-xl
          p-6
          animate-modalIn
        "
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {title}
        </h2>

        {children}

      </div>
    </div>
  )
}
import { Home, Folder } from "lucide-react"
import { Outlet, Link } from "react-router-dom"

import { Logo } from "@/shared/ui/Logo"
import { CreateMenuButton } from "@/shared/components/CreateMenuButton"

export default function LeftSidebarLayout() {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside
        className="
          w-64
          bg-white
          border-r border-gray-300
          flex flex-col
        "
      >

        {/* LOGO */}
        <div
          className="
            px-6 py-5
            border-b border-gray-300
          "
        >
          <div className="flex items-center gap-3">
            <Logo size={40} />

            <span
              className="
                text-lg
                font-semibold
                text-gray-900
              "
            >
              CloudStore
            </span>
          </div>
        </div>

        {/* CREATE MENU */}
        <div className="p-4">
          <CreateMenuButton />
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-300" />

        {/* NAVIGATION */}
        <nav
          className="
            px-4 py-4
            flex flex-col
            gap-1
          "
        >

          <Link
            to="/dashboard/home"
            className="
              flex items-center gap-3
              px-3 py-2
              rounded-lg
              text-sm font-medium
              text-blue-600
              bg-blue-50
            "
          >
            <Home size={18} />
            Главная
          </Link>

          <Link
            to="/dashboard/folders"
            className="
              flex items-center gap-3
              px-3 py-2
              rounded-lg
              text-sm font-medium
              text-gray-700
              hover:bg-gray-100
            "
          >
            <Folder size={18} />
            Мои папки
          </Link>

        </nav>

      </aside>

      {/* CONTENT */}
      <main
        className="
          flex-1
          overflow-auto
        "
      >
        <Outlet />
      </main>

    </div>
  )
}
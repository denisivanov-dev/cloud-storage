import { Link } from "react-router-dom"

interface Crumb {
  id: number
  name: string
}

interface Props {
  crumbs: Crumb[]
}

export function Breadcrumb({ crumbs }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">

      <Link
        to="/dashboard/folders"
        className="hover:text-gray-900"
      >
        Home
      </Link>

      {crumbs.map((c) => (
        <span key={c.id} className="flex items-center gap-2">
          /
          <Link
            to={`/dashboard/folders/${c.id}`}
            className="hover:text-gray-900"
          >
            {c.name}
          </Link>
        </span>
      ))}

    </div>
  )
}
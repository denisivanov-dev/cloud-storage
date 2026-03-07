import { useParams } from "react-router-dom"
import { FolderList } from "@/features/folders/components/FolderList"
import { useFolders } from "@/features/folders/hooks"
import { Breadcrumb } from "@/features/folders/components/Breadcrumb"

export default function FoldersPage() {
  const { id } = useParams()

  const parentId = id ? Number(id) : undefined

  const { data, isLoading, isError } = useFolders(parentId)

  const folders = data?.folders ?? []
  const breadcrumb = data?.breadcrumb ?? []

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (isError) {
    return <div className="p-8">Failed to load folders</div>
  }

  return (
    <div className="p-8">

      <Breadcrumb crumbs={breadcrumb} />

      <h1 className="text-2xl font-bold mb-6">
        My files
      </h1>

      {folders.length === 0 ? (
        <div className="text-gray-500">
          Empty folder
        </div>
      ) : (
        <FolderList folders={folders} />
      )}

    </div>
  )
}
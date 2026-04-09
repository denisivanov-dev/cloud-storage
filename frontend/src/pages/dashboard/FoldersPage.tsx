import { useParams } from "react-router-dom"
import { ItemList } from "@/features/items/components/ItemList"
import { useItems } from "@/features/items/hooks"
import { Breadcrumb } from "@/features/folders/components/Breadcrumb"
import { PreviewModal } from "@/features/files/components/PreviewModal"

export default function FoldersPage() {
  const { id } = useParams()

  const parentId = id ? Number(id) : undefined

  const { data, isLoading, isError } = useItems(parentId)

  const folders = data?.folders ?? []
  const files = data?.files ?? []
  const breadcrumb = data?.breadcrumb ?? []

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (isError) {
    return <div className="p-8">Failed to load folders</div>
  }

  return (
    <div className="p-8 h-full flex flex-col">

      <Breadcrumb crumbs={breadcrumb} />

      <h1 className="text-2xl font-bold mb-6">
        My files
      </h1>

      <div className="flex-1 overflow-auto">
        {folders.length === 0 && files.length === 0 ? (
          <div className="text-gray-500">
            Empty folder
          </div>
        ) : (
          <ItemList folders={folders} files={files} />
        )}
      </div>

      <PreviewModal />
        
    </div>
  )
}
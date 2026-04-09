import { usePreviewStore } from "../store"
import { useQuery } from "@tanstack/react-query"
import { getFile } from "../api"

export function PreviewModal() {
  const file = usePreviewStore((s) => s.file)
  const close = usePreviewStore((s) => s.close)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["file", file?.id],
    queryFn: () => getFile(file!.id),
    enabled: !!file,
  })

  if (!file) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={close}
    >
      <div
        className="bg-white w-[80%] h-[80%] p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{file.name}</span>
          <button onClick={close}>✕</button>
        </div>

        {/* content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {isLoading && <div>Loading...</div>}

          {isError && <div>Failed to load file</div>}

          {data && (
            <>
              {/* image */}
              {data.content_type?.startsWith("image") && (
                <img
                  src={data.download_url}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* pdf */}
              {data.content_type === "application/pdf" && (
                <iframe
                  src={data.download_url}
                  className="w-full h-full"
                />
              )}

              {/* fallback */}
              {!data.content_type?.startsWith("image") &&
                data.content_type !== "application/pdf" && (
                  <div className="text-center">
                    <div className="mb-2">Preview not available</div>
                    <button
                      onClick={() => window.open(data.download_url)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Download
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
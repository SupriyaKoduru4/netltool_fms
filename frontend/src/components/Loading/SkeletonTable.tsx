// components/UI/BlogsTableSkeleton.tsx

const SkeletonCell = ({ width = "100%" }: { width?: string }) => (
  <div
    className="h-3.5 rounded animate-pulse bg-gray-200"
    style={{ width }}
  />
)

const SkeletonTable = () => {
  return (
    <div className="p-6">
      <div className="flex flex-row justify-between mb-7">
        <div className="space-y-2.5">
          <div className="h-7 w-28 rounded-md animate-pulse bg-gray-200" />
          <div className="h-3.5 w-52 rounded animate-pulse bg-gray-100" />
        </div>
        <div className="h-10 w-36 rounded-lg animate-pulse bg-gray-200" />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 pb-3 mb-2 border-b border-gray-200">
          {["w-10", "w-14", "w-9", "w-16"].map((w, i) => (
            <div key={i} className={`h-3 rounded animate-pulse bg-gray-300 ${w}`} />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 py-3 border-b border-gray-100 last:border-none items-center"
          >
            <SkeletonCell width={`${70 + Math.floor((i * 17) % 30)}%`} />
            <SkeletonCell width={`${60 + Math.floor((i * 13) % 35)}%`} />
            <SkeletonCell />
            <div className="h-7 w-12 rounded-md animate-pulse bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonTable
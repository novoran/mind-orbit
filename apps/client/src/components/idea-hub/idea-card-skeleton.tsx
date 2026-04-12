export function IdeaCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-card min-h-[180px] animate-pulse rounded-xl border"
        >
          <div className="bg-muted h-20 rounded-t-xl" />
          <div className="p-4">
            <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
            <div className="bg-muted h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

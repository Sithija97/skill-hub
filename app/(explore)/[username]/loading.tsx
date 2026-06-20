export default function ProfileLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-start gap-6">
        <div className="h-20 w-20 shrink-0 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="mb-2 h-6 w-48 rounded bg-muted" />
          <div className="mb-1 h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-64 rounded bg-muted" />
        </div>
      </div>
      <div className="mb-6 h-9 w-60 rounded bg-muted" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="mb-3 h-4 w-3/5 rounded bg-muted" />
            <div className="mb-2 h-3 w-full rounded bg-muted" />
            <div className="mb-4 h-3 w-2/3 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-12 rounded-full bg-muted" />
              <div className="h-5 w-12 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

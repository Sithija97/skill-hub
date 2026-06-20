export default function AppLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="mt-2 h-4 w-60 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="h-4 w-3/5 rounded bg-muted" />
              <div className="h-5 w-14 rounded-full bg-muted" />
            </div>
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

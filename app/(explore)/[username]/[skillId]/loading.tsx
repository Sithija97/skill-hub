export default function SkillDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-4 w-48 rounded bg-muted" />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-6 w-64 rounded bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="h-4 w-48 rounded bg-muted" />
          </div>
          <div className="flex gap-1">
            <div className="h-5 w-16 rounded-full bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-5 w-14 rounded-full bg-muted" />
          </div>
          <div className="h-4 w-full rounded bg-muted" />
          <div className="rounded-lg border border-border">
            <div className="border-b bg-muted/50 p-4">
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
            <div className="space-y-3 p-5">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-4/5 rounded bg-muted" />
              <div className="h-3 w-3/5 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 h-3 w-16 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-8 w-full rounded bg-muted" />
              <div className="h-8 w-full rounded bg-muted" />
              <div className="h-8 w-full rounded bg-muted" />
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 h-3 w-12 rounded bg-muted" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-12 rounded bg-muted" />
                <div className="h-3 w-6 rounded bg-muted" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-12 rounded bg-muted" />
                <div className="h-3 w-6 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

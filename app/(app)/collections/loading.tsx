import { Skeleton } from '@/components/ui/skeleton'

export default function CollectionsLoading() {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="ml-auto h-5 w-6 rounded-full" />
            </div>
            <Skeleton className="mb-3 h-3 w-full" />
            <div className="space-y-1 rounded bg-muted/50 p-2">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

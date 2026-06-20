import { Skeleton } from '@/components/ui/skeleton'

export default function CollectionDetailLoading() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-48" />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-1 h-4 w-64" />
          <Skeleton className="mt-1 h-3 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <Skeleton className="mb-2 h-4 w-3/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

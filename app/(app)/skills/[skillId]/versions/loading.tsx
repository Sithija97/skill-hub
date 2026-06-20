import { Skeleton } from '@/components/ui/skeleton'

export default function VersionsLoading() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-64" />
      <Skeleton className="mb-6 h-6 w-36" />

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

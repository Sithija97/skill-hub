import { Skeleton } from '@/components/ui/skeleton'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'

export default function DashboardLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 shrink-0 rounded" />
              <div>
                <Skeleton className="h-6 w-10" />
                <Skeleton className="mt-1 h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="mb-5 flex gap-4 border-b border-border pb-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>

      <SkillGridSkeleton count={6} />
    </div>
  )
}

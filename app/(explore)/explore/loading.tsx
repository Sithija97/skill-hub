import { Skeleton } from '@/components/ui/skeleton'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'

export default function ExploreLoading() {
  return (
    <div>
      <div className="pb-8 pt-8 text-center">
        <Skeleton className="mx-auto mb-2 h-7 w-48" />
        <Skeleton className="mx-auto mb-6 h-4 w-80" />
        <div className="mx-auto max-w-xl">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] items-start gap-6">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
          <SkillGridSkeleton count={6} />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

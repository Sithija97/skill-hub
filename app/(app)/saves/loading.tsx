import { Skeleton } from '@/components/ui/skeleton'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'

export default function SavesLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <SkillGridSkeleton count={6} />
    </div>
  )
}

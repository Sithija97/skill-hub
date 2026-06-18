import { Skeleton } from '@/components/ui/skeleton'

export function SkillCardSkeleton() {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-5 w-13 rounded-full" />
      </div>
      <div className="mb-3 flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
      <div className="flex gap-4 border-t border-border pt-3">
        <Skeleton className="h-3.5 w-9" />
        <Skeleton className="h-3.5 w-9" />
        <div className="ml-auto">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SkillGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkillCardSkeleton key={i} />
      ))}
    </div>
  )
}

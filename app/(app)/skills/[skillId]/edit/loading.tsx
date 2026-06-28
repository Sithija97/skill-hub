import { Skeleton } from '@/components/ui/skeleton'

export default function EditSkillLoading() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-64" />
      <Skeleton className="mb-6 h-6 w-28" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="mb-1.5 h-4 w-12" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div>
            <Skeleton className="mb-1.5 h-4 w-24" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
          <div>
            <Skeleton className="mb-1.5 h-4 w-24" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-12 rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="mb-1.5 h-4 w-28" />
            <Skeleton className="h-100 w-full rounded-md" />
          </div>
        </div>

        <div className="sticky top-19">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

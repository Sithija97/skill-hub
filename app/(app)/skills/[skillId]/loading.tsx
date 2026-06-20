import { Skeleton } from '@/components/ui/skeleton'

export default function SkillDetailLoading() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-48" />

      <div className="grid grid-cols-[1fr_320px] items-start gap-6">
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="rounded-lg border border-border">
            <div className="border-b bg-muted/50 p-4">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border p-4">
            <Skeleton className="mb-3 h-3 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Skeleton className="mb-3 h-3 w-12" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-6" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <div className="rounded-lg border border-border p-6">
          <Skeleton className="mb-5 h-4 w-16" />
          <div className="flex flex-col gap-5">
            <div>
              <Skeleton className="mb-1.5 h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="mb-1.5 h-4 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="mb-1.5 h-4 w-10" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  )
}

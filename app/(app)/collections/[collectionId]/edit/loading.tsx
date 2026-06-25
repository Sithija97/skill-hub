import { Skeleton } from '@/components/ui/skeleton'

export default function EditCollectionLoading() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-64" />
      <Skeleton className="mb-6 h-6 w-32" />

      <div className="flex max-w-2xl flex-col gap-6">
        <div>
          <Skeleton className="mb-1.5 h-4 w-12" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="mb-1.5 h-4 w-24" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="mb-1.5 h-4 w-20" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export function SidebarSkeleton() {
  return (
    <aside className="flex h-full w-55 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-background py-3">
      {/* MENU */}
      <div className="mb-1 px-4 text-xs font-semibold tracking-wide text-muted-foreground">MENU</div>
      <nav className="flex flex-col gap-px">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="mx-2 flex items-center gap-2 px-3 py-1.5">
            <Skeleton className="h-4 w-4 shrink-0 rounded" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </nav>

      <Separator className="mx-4 my-2" />

      {/* MY SKILLS */}
      <div className="mb-1 px-4 text-xs font-semibold tracking-wide text-muted-foreground">MY SKILLS</div>
      <nav className="flex flex-col gap-px">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="mx-2 flex items-center gap-2 px-3 py-1.5">
            <Skeleton className="h-4 w-4 shrink-0 rounded" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </nav>

      <Separator className="mx-4 my-2" />

      {/* ACCOUNT */}
      <div className="mb-1 px-4 text-xs font-semibold tracking-wide text-muted-foreground">ACCOUNT</div>
      <nav className="flex flex-col gap-px">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="mx-2 flex items-center gap-2 px-3 py-1.5">
            <Skeleton className="h-4 w-4 shrink-0 rounded" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </nav>
    </aside>
  )
}

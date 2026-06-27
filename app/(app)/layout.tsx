import { Suspense } from 'react'
import { requireAuth, ensureDbUser } from '@/lib/auth'
import { Topbar } from '@/components/layout/topbar'
import { AsyncSidebar } from '@/components/layout/async-sidebar'
import { SidebarSkeleton } from '@/components/layout/sidebar-skeleton'
import { Toaster } from '@/components/shared/toast'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await requireAuth()
  await ensureDbUser()

  return (
    <div className="flex h-screen flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={<SidebarSkeleton />}>
          <AsyncSidebar userId={userId} />
        </Suspense>
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

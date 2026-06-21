import { requireAuth } from '@/lib/auth'
import { getCachedSidebarCounts, getCachedUsername } from '@/lib/cache'
import { Topbar } from '@/components/layout/topbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Toaster } from '@/components/shared/toast'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await requireAuth()

  const [username, counts] = await Promise.all([
    getCachedUsername(userId),
    getCachedSidebarCounts(userId),
  ])

  return (
    <div className="flex h-screen flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar username={username ?? undefined} counts={counts} />
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

import { requireAuth } from '@/lib/auth'
import { Topbar } from '@/components/layout/topbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Toaster } from '@/components/shared/toast'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="flex h-screen flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

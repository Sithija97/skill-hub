import { ensureDbUser } from '@/lib/auth'
import { Topbar } from '@/components/layout/topbar'
import { Toaster } from '@/components/shared/toast'

export default async function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await ensureDbUser()
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="mx-auto w-full max-w-7xl flex-1 p-6">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

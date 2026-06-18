import { Topbar } from '@/components/layout/topbar'

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="mx-auto w-full max-w-7xl flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

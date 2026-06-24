import { getCachedSidebarCounts, getCachedUsername } from '@/lib/cache'
import { Sidebar } from './sidebar'

export async function AsyncSidebar({ userId }: { userId: string }) {
  const [username, counts] = await Promise.all([
    getCachedUsername(userId),
    getCachedSidebarCounts(userId),
  ])

  return <Sidebar username={username ?? undefined} counts={counts} />
}

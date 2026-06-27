import { getCachedSidebarCounts, getCachedUsername } from '@/lib/cache'
import { MobileSidebar } from './mobile-sidebar'

export async function AsyncMobileSidebar({ userId }: { userId: string }) {
  const [username, counts] = await Promise.all([
    getCachedUsername(userId),
    getCachedSidebarCounts(userId),
  ])

  return <MobileSidebar username={username ?? undefined} counts={counts} />
}

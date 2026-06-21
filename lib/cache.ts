import { unstable_cache, revalidateTag } from 'next/cache'
import { db } from './db'

export const getCachedSidebarCounts = unstable_cache(
  async (userId: string) => {
    const [savedCount, publicCount, privateCount, forkedCount, collectionsCount] = await Promise.all([
      db.skillSave.count({ where: { userId } }),
      db.skill.count({ where: { authorId: userId, isPublic: true } }),
      db.skill.count({ where: { authorId: userId, isPublic: false } }),
      db.skill.count({ where: { authorId: userId, forkedFromId: { not: null } } }),
      db.collection.count({ where: { authorId: userId } }),
    ])
    return { saved: savedCount, public: publicCount, private: privateCount, forked: forkedCount, collections: collectionsCount }
  },
  ['sidebar-counts'],
  { revalidate: 60, tags: ['sidebar'] }
)

export const getCachedUsername = unstable_cache(
  async (userId: string) => {
    const user = await db.user.findUnique({ where: { id: userId }, select: { username: true } })
    return user?.username ?? null
  },
  ['user-username'],
  { revalidate: 300, tags: ['user-profile'] }
)

export const getCachedTags = unstable_cache(
  async () => {
    const rows = await db.tag.findMany({ orderBy: { name: 'asc' } })
    return rows.map((t) => ({ id: t.id, name: t.name, slug: t.slug }))
  },
  ['all-tags'],
  { revalidate: 300, tags: ['tags'] }
)

export function invalidateSidebar() {
  revalidateTag('sidebar', 'max')
}

export function invalidateTags() {
  revalidateTag('tags', 'max')
}

export function invalidateUserProfile() {
  revalidateTag('user-profile', 'max')
}

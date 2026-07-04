import { unstable_cache, revalidateTag } from 'next/cache'
import { db } from './db'
import { getTags } from './services/tag.service'

// ── Existing cached functions ──

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
  getTags,
  ['all-tags'],
  { revalidate: 300, tags: ['tags'] }
)

// ── New cached functions ──

export const getCachedUserProfile = unstable_cache(
  async (username: string) => {
    const row = await db.user.findUnique({
      where: { username },
      include: { _count: { select: { skills: { where: { isPublic: true } } } } },
    })
    if (!row) return null

    return {
      id: row.id,
      username: row.username,
      displayName: row.displayName,
      bio: row.bio,
      avatarUrl: row.avatarUrl,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      skillsCount: row._count.skills,
      followersCount: 0,
    }
  },
  ['user-profile'],
  { revalidate: 120, tags: ['user-profile'] }
)

export const getCachedSkillForkOrigin = unstable_cache(
  async (forkedFromId: string) => {
    const row = await db.skill.findUnique({
      where: { id: forkedFromId },
      select: { title: true, author: { select: { username: true } } },
    })
    if (!row) return null
    return { title: row.title, authorUsername: row.author.username }
  },
  ['skill-fork-origin'],
  { revalidate: 300, tags: ['skills'] }
)

export const getCachedSkillVersions = unstable_cache(
  async (skillId: string) => {
    const rows = await db.skillVersion.findMany({
      where: { skillId },
      orderBy: { version: 'desc' },
    })
    return rows.map((v) => ({
      id: v.id,
      skillId: v.skillId,
      version: v.version,
      content: v.content,
      changelog: v.changelog ?? '',
      createdAt: v.createdAt.toISOString(),
    }))
  },
  ['skill-versions'],
  { revalidate: 300, tags: ['skills'] }
)

// ── Invalidation functions ──

export function invalidateSidebar() {
  revalidateTag('sidebar', 'max')
}

export function invalidateTags() {
  revalidateTag('tags', 'max')
}

export function invalidateUserProfile() {
  revalidateTag('user-profile', 'max')
}

export function invalidateSkills() {
  revalidateTag('skills', 'max')
}

export function invalidateCollections() {
  revalidateTag('collections', 'max')
}

export function invalidateSaves() {
  revalidateTag('saves', 'max')
}

export function invalidateSkillMutation() {
  invalidateSkills()
  invalidateSidebar()
  invalidateTags()
}

export function invalidateCollectionMutation() {
  invalidateCollections()
  invalidateSidebar()
}

import { db } from '@/lib/db'
import { Prisma } from '@/lib/generated/prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { SITE_CONFIG } from '@/config/site'
import { invalidateSkillMutation, invalidateSaves, getCachedSkillForkOrigin, getCachedSkillVersions } from '@/lib/cache'
import type { SkillWithRelations, SkillVersion, TargetTool } from '@/types/skill'
import type { User } from '@/types/user'
import type { PaginatedResponse } from '@/types/api'

// ── Shared input types (same shapes as the mock layer) ──

export interface SkillFilters {
  targetTool?: TargetTool
  isPublic?: boolean
  tags?: string[]
  search?: string
  sortBy?: 'latest' | 'popular' | 'forked'
  page?: number
  pageSize?: number
}

export interface CreateSkillInput {
  title: string
  description: string
  content: string
  targetTool: TargetTool
  isPublic: boolean
  tags: string[]
}

export type UpdateSkillInput = Partial<CreateSkillInput>

// ── Prisma includes ──

const skillDetailInclude = {
  author: true,
  tags: { include: { tag: true } },
  versions: { orderBy: { version: 'desc' as const } },
} as const

const skillListInclude = {
  author: true,
  tags: { include: { tag: true } },
} as const

const skillListOmit = { content: true } as const

// ── Types ──

type PrismaSkillDetailRow = Awaited<ReturnType<typeof db.skill.findFirst<{ include: typeof skillDetailInclude }>>>
type PrismaSkillListRow = Awaited<ReturnType<typeof db.skill.findFirst<{ include: typeof skillListInclude; omit: typeof skillListOmit }>>>

// ── Mappers ──

function mapUser(u: { id: string; username: string; displayName: string; bio: string | null; avatarUrl: string | null; createdAt: Date; updatedAt: Date }): User {
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }
}

function mapTags(tags: NonNullable<PrismaSkillListRow>['tags']) {
  return tags.map((st) => ({ id: st.tag.id, name: st.tag.name, slug: st.tag.slug }))
}

async function toSkillDetail(
  row: NonNullable<PrismaSkillDetailRow>,
  viewerId: string | null
): Promise<SkillWithRelations> {
  let isLiked = false
  let isSaved = false

  if (viewerId) {
    const [like, save] = await Promise.all([
      db.skillLike.findUnique({ where: { userId_skillId: { userId: viewerId, skillId: row.id } } }),
      db.skillSave.findUnique({ where: { userId_skillId: { userId: viewerId, skillId: row.id } } }),
    ])
    isLiked = like !== null
    isSaved = save !== null
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    content: row.content,
    targetTool: row.targetTool as TargetTool,
    isPublic: row.isPublic,
    version: row.version,
    likesCount: row.likesCount,
    savesCount: row.savesCount,
    forksCount: row.forksCount,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    authorId: row.authorId,
    forkedFromId: row.forkedFromId,
    author: mapUser(row.author),
    tags: mapTags(row.tags),
    versions: row.versions.map((v) => ({
      id: v.id,
      skillId: v.skillId,
      version: v.version,
      content: v.content,
      changelog: v.changelog ?? '',
      createdAt: v.createdAt.toISOString(),
    })),
    isLiked,
    isSaved,
  }
}

async function getViewerId(): Promise<string | null> {
  try {
    const session = await getCurrentUser()
    return session?.userId ?? null
  } catch {
    return null
  }
}

// ── Batch engagement check (replaces per-skill N+1 queries) ──

async function batchCheckLikedSaved(
  skillIds: string[],
  viewerId: string | null
): Promise<Map<string, { isLiked: boolean; isSaved: boolean }>> {
  if (!viewerId || skillIds.length === 0) {
    return new Map(skillIds.map((id) => [id, { isLiked: false, isSaved: false }]))
  }
  const [likes, saves] = await Promise.all([
    db.skillLike.findMany({ where: { userId: viewerId, skillId: { in: skillIds } }, select: { skillId: true } }),
    db.skillSave.findMany({ where: { userId: viewerId, skillId: { in: skillIds } }, select: { skillId: true } }),
  ])
  const likedSet = new Set(likes.map((l) => l.skillId))
  const savedSet = new Set(saves.map((s) => s.skillId))
  return new Map(skillIds.map((id) => [id, { isLiked: likedSet.has(id), isSaved: savedSet.has(id) }]))
}

function mapSkillListRow(
  row: NonNullable<PrismaSkillListRow>,
  engagement: { isLiked: boolean; isSaved: boolean }
): SkillWithRelations {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    content: '',
    targetTool: row.targetTool as TargetTool,
    isPublic: row.isPublic,
    version: row.version,
    likesCount: row.likesCount,
    savesCount: row.savesCount,
    forksCount: row.forksCount,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    authorId: row.authorId,
    forkedFromId: row.forkedFromId,
    author: mapUser(row.author),
    tags: mapTags(row.tags),
    versions: [],
    isLiked: engagement.isLiked,
    isSaved: engagement.isSaved,
  }
}

// ── Tag helper: upsert tags by slug, return IDs ──

async function upsertTags(slugs: string[]): Promise<string[]> {
  const tags = await Promise.all(
    slugs.map((slug) => {
      const name = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      return db.tag.upsert({
        where: { slug },
        create: { name, slug },
        update: {},
      })
    })
  )
  return tags.map((t) => t.id)
}

// ── Service functions ──

export async function getSkills(
  filters?: SkillFilters
): Promise<PaginatedResponse<SkillWithRelations>> {
  const viewerId = await getViewerId()
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? SITE_CONFIG.defaultPageSize

  const where: Prisma.SkillWhereInput = {}

  if (filters?.isPublic === false) {
    if (!viewerId) return { data: [], total: 0, page, pageSize, hasMore: false }
    where.isPublic = false
    where.authorId = viewerId
  } else if (filters?.isPublic === true) {
    where.isPublic = true
  } else {
    where.OR = [
      { isPublic: true },
      ...(viewerId ? [{ authorId: viewerId }] : []),
    ]
  }

  if (filters?.targetTool) {
    where.targetTool = filters.targetTool
  }

  if (filters?.tags && filters.tags.length > 0) {
    where.tags = { some: { tag: { slug: { in: filters.tags } } } }
  }

  if (filters?.search) {
    const q = filters.search
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
    ]
  }

  let orderBy: Prisma.SkillOrderByWithRelationInput
  switch (filters?.sortBy) {
    case 'popular':
      orderBy = { likesCount: 'desc' }
      break
    case 'forked':
      orderBy = { forksCount: 'desc' }
      break
    case 'latest':
    default:
      orderBy = { updatedAt: 'desc' }
  }

  const [rows, total] = await Promise.all([
    db.skill.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: skillListInclude,
      omit: skillListOmit,
    }),
    db.skill.count({ where }),
  ])

  const engagements = await batchCheckLikedSaved(rows.map((r) => r.id), viewerId)
  const data = rows.map((r) => mapSkillListRow(r, engagements.get(r.id)!))

  return { data, total, page, pageSize, hasMore: (page - 1) * pageSize + rows.length < total }
}

export async function getSkillById(
  id: string
): Promise<SkillWithRelations | null> {
  const row = await db.skill.findUnique({ where: { id }, include: skillDetailInclude })
  if (!row) return null

  const viewerId = await getViewerId()

  if (!row.isPublic && row.authorId !== viewerId) {
    return null
  }

  return toSkillDetail(row, viewerId)
}

export async function getSkillsByUser(
  userId: string
): Promise<SkillWithRelations[]> {
  const viewerId = await getViewerId()
  const isOwner = viewerId === userId

  const rows = await db.skill.findMany({
    where: {
      authorId: userId,
      ...(isOwner ? {} : { isPublic: true }),
    },
    orderBy: { updatedAt: 'desc' },
    include: skillListInclude,
    omit: skillListOmit,
  })

  const engagements = await batchCheckLikedSaved(rows.map((r) => r.id), viewerId)
  return rows.map((r) => mapSkillListRow(r, engagements.get(r.id)!))
}

export async function createSkill(
  data: CreateSkillInput
): Promise<SkillWithRelations> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')
  const userId = session.userId

  const tagIds = await upsertTags(data.tags)

  const row = await db.$transaction(async (tx) => {
    const skill = await tx.skill.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        targetTool: data.targetTool,
        isPublic: data.isPublic,
        authorId: userId,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
        versions: {
          create: {
            version: 1,
            content: data.content,
            changelog: 'Initial version',
          },
        },
      },
      include: skillDetailInclude,
    })
    return skill
  })

  invalidateSkillMutation()
  return toSkillDetail(row, userId)
}

export async function updateSkill(
  id: string,
  data: UpdateSkillInput
): Promise<SkillWithRelations> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const existing = await db.skill.findUnique({
    where: { id },
    select: { authorId: true, version: true, content: true },
  })
  if (!existing) throw new Error(`Skill not found: ${id}`)
  if (existing.authorId !== session.userId) throw new Error('Not authorized')

  const newVersion = existing.version + (data.content ? 1 : 0)
  const tagIds = data.tags ? await upsertTags(data.tags) : null

  const row = await db.$transaction(async (tx) => {
    if (data.content && data.content !== existing.content) {
      await tx.skillVersion.create({
        data: {
          skillId: id,
          version: newVersion,
          content: data.content,
          changelog: null,
        },
      })
    }

    if (tagIds) {
      await tx.skillTag.deleteMany({ where: { skillId: id } })
      await tx.skillTag.createMany({ data: tagIds.map((tagId) => ({ skillId: id, tagId })) })
    }

    return tx.skill.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.content !== undefined ? { content: data.content, version: newVersion } : {}),
        ...(data.targetTool !== undefined ? { targetTool: data.targetTool } : {}),
        ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
      },
      include: skillDetailInclude,
    })
  })

  invalidateSkillMutation()
  return toSkillDetail(row, session.userId)
}

export async function deleteSkill(id: string): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const existing = await db.skill.findUnique({
    where: { id },
    select: { authorId: true },
  })
  if (!existing) throw new Error(`Skill not found: ${id}`)
  if (existing.authorId !== session.userId) throw new Error('Not authorized')

  await db.skill.delete({ where: { id } })
  invalidateSkillMutation()
}

export async function forkSkill(
  id: string,
  userId: string
): Promise<SkillWithRelations> {
  const original = await db.skill.findUnique({
    where: { id },
    include: { tags: true },
  })
  if (!original) throw new Error(`Skill not found: ${id}`)
  if (!original.isPublic && original.authorId !== userId) {
    throw new Error('Not authorized')
  }

  const row = await db.$transaction(async (tx) => {
    const forked = await tx.skill.create({
      data: {
        title: `${original.title} (Fork)`,
        description: original.description,
        content: original.content,
        targetTool: original.targetTool,
        isPublic: false,
        authorId: userId,
        forkedFromId: id,
        tags: {
          create: original.tags.map((st) => ({ tagId: st.tagId })),
        },
        versions: {
          create: {
            version: 1,
            content: original.content,
            changelog: `Forked from ${original.title}`,
          },
        },
      },
      include: skillDetailInclude,
    })

    await tx.skill.update({
      where: { id },
      data: { forksCount: { increment: 1 } },
    })

    return forked
  })

  invalidateSkillMutation()
  return toSkillDetail(row, userId)
}

export async function likeSkill(id: string, userId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const existing = await tx.skillLike.findUnique({
      where: { userId_skillId: { userId, skillId: id } },
    })
    if (existing) return

    await tx.skillLike.create({ data: { userId, skillId: id } })
    await tx.skill.update({ where: { id }, data: { likesCount: { increment: 1 } } })
  })
  invalidateSkillMutation()
}

export async function unlikeSkill(id: string, userId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const existing = await tx.skillLike.findUnique({
      where: { userId_skillId: { userId, skillId: id } },
    })
    if (!existing) return

    await tx.skillLike.delete({ where: { userId_skillId: { userId, skillId: id } } })
    await tx.skill.update({ where: { id }, data: { likesCount: { decrement: 1 } } })
  })
  invalidateSkillMutation()
}

export async function saveSkill(id: string, userId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const existing = await tx.skillSave.findUnique({
      where: { userId_skillId: { userId, skillId: id } },
    })
    if (existing) return

    await tx.skillSave.create({ data: { userId, skillId: id } })
    await tx.skill.update({ where: { id }, data: { savesCount: { increment: 1 } } })
  })
  invalidateSkillMutation()
  invalidateSaves()
}

export async function unsaveSkill(id: string, userId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const existing = await tx.skillSave.findUnique({
      where: { userId_skillId: { userId, skillId: id } },
    })
    if (!existing) return

    await tx.skillSave.delete({ where: { userId_skillId: { userId, skillId: id } } })
    await tx.skill.update({ where: { id }, data: { savesCount: { decrement: 1 } } })
  })
  invalidateSkillMutation()
  invalidateSaves()
}

export async function getSavedSkillsByUser(
  userId: string
): Promise<SkillWithRelations[]> {
  const rows = await db.skillSave.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      skill: { include: skillListInclude, omit: skillListOmit },
    },
  })

  const filtered = rows.filter((r) => r.skill.isPublic || r.skill.authorId === userId)
  const engagements = await batchCheckLikedSaved(filtered.map((r) => r.skill.id), userId)
  return filtered.map((r) => mapSkillListRow(r.skill, engagements.get(r.skill.id)!))
}

export async function getSkillForkOrigin(
  forkedFromId: string | null
): Promise<{ title: string; authorUsername: string } | null> {
  if (!forkedFromId) return null
  const row = await db.skill.findUnique({
    where: { id: forkedFromId },
    select: { title: true, author: { select: { username: true } } },
  })
  if (!row) return null
  return { title: row.title, authorUsername: row.author.username }
}

export async function getSkillVersions(
  skillId: string
): Promise<SkillVersion[]> {
  const [skill, viewerId] = await Promise.all([
    db.skill.findUnique({
      where: { id: skillId },
      select: { isPublic: true, authorId: true, versions: { orderBy: { version: 'desc' as const } } },
    }),
    getViewerId(),
  ])
  if (!skill) return []
  if (!skill.isPublic && skill.authorId !== viewerId) return []

  return skill.versions.map((v) => ({
    id: v.id,
    skillId,
    version: v.version,
    content: v.content,
    changelog: v.changelog ?? '',
    createdAt: v.createdAt.toISOString(),
  }))
}

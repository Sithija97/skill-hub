import { db } from '@/lib/db'
import { Prisma } from '@/lib/generated/prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { invalidateCollectionMutation } from '@/lib/cache'
import type { Skill } from '@/types/skill'
import type { TargetTool } from '@/types/skill'
import type { CollectionWithSkills, CollectionSkillStatus } from '@/types/collection'
import type { PaginatedResponse } from '@/types/api'

export interface CreateCollectionInput {
  name: string
  description?: string
  isPublic: boolean
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>

const collectionInclude = {
  skills: {
    include: { skill: { omit: { content: true } } },
    orderBy: { addedAt: 'desc' as const },
  },
  _count: { select: { skills: true } },
} as const

type PrismaCollectionRow = NonNullable<Awaited<ReturnType<typeof db.collection.findFirst<{ include: typeof collectionInclude }>>>>

function mapCollection(row: PrismaCollectionRow): CollectionWithSkills {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    isPublic: row.isPublic,
    authorId: row.authorId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    skillsCount: row._count.skills,
    skills: row.skills.map((cs) => ({
      id: cs.skill.id,
      title: cs.skill.title,
      description: cs.skill.description,
      content: '',
      targetTool: cs.skill.targetTool as TargetTool,
      isPublic: cs.skill.isPublic,
      version: cs.skill.version,
      likesCount: cs.skill.likesCount,
      savesCount: cs.skill.savesCount,
      forksCount: cs.skill.forksCount,
      createdAt: cs.skill.createdAt.toISOString(),
      updatedAt: cs.skill.updatedAt.toISOString(),
      authorId: cs.skill.authorId,
      forkedFromId: cs.skill.forkedFromId,
    } satisfies Skill)),
  }
}

export async function getCollections(
  userId?: string
): Promise<PaginatedResponse<CollectionWithSkills>> {
  const session = await getCurrentUser()
  const viewerId = session?.userId ?? null

  let where: Prisma.CollectionWhereInput
  if (userId) {
    const isOwner = viewerId === userId
    where = isOwner ? { authorId: userId } : { authorId: userId, isPublic: true }
  } else {
    where = { isPublic: true }
  }

  const rows = await db.collection.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: collectionInclude,
  })

  return {
    data: rows.map(mapCollection),
    total: rows.length,
    page: 1,
    pageSize: rows.length,
    hasMore: false,
  }
}

export async function getCollectionById(
  id: string
): Promise<CollectionWithSkills | null> {
  const row = await db.collection.findUnique({
    where: { id },
    include: collectionInclude,
  })
  if (!row) return null

  const session = await getCurrentUser()
  if (!row.isPublic && row.authorId !== session?.userId) return null

  return mapCollection(row)
}

export async function createCollection(
  data: CreateCollectionInput
): Promise<CollectionWithSkills> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const row = await db.collection.create({
    data: {
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
      authorId: session.userId,
    },
    include: collectionInclude,
  })

  invalidateCollectionMutation()
  return mapCollection(row)
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionInput
): Promise<CollectionWithSkills> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const existing = await db.collection.findUnique({
    where: { id },
    select: { authorId: true },
  })
  if (!existing) throw new Error(`Collection not found: ${id}`)
  if (existing.authorId !== session.userId) throw new Error('Not authorized')

  const row = await db.collection.update({
    where: { id },
    data,
    include: collectionInclude,
  })

  invalidateCollectionMutation()
  return mapCollection(row)
}

export async function deleteCollection(id: string): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const existing = await db.collection.findUnique({
    where: { id },
    select: { authorId: true },
  })
  if (!existing) throw new Error(`Collection not found: ${id}`)
  if (existing.authorId !== session.userId) throw new Error('Not authorized')

  await db.collection.delete({ where: { id } })
  invalidateCollectionMutation()
}

export async function addSkillToCollection(
  collectionId: string,
  skillId: string
): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const collection = await db.collection.findUnique({
    where: { id: collectionId },
    select: { authorId: true },
  })
  if (!collection) throw new Error('Collection not found')
  if (collection.authorId !== session.userId) throw new Error('Not authorized')

  await db.collectionSkill.upsert({
    where: { collectionId_skillId: { collectionId, skillId } },
    create: { collectionId, skillId },
    update: {},
  })
  invalidateCollectionMutation()
}

export async function removeSkillFromCollection(
  collectionId: string,
  skillId: string
): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const collection = await db.collection.findUnique({
    where: { id: collectionId },
    select: { authorId: true },
  })
  if (!collection) throw new Error('Collection not found')
  if (collection.authorId !== session.userId) throw new Error('Not authorized')

  await db.collectionSkill.deleteMany({
    where: { collectionId, skillId },
  })
  invalidateCollectionMutation()
}

export async function getUserCollectionsForSkill(
  skillId: string
): Promise<CollectionSkillStatus[]> {
  const session = await getCurrentUser()
  if (!session) return []

  const rows = await db.collection.findMany({
    where: { authorId: session.userId },
    select: {
      id: true,
      name: true,
      skills: {
        where: { skillId },
        select: { skillId: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    hasSkill: r.skills.length > 0,
  }))
}

export async function followCollection(
  collectionId: string,
  userId: string
): Promise<void> {
  await db.collectionFollow.upsert({
    where: { userId_collectionId: { userId, collectionId } },
    create: { userId, collectionId },
    update: {},
  })
}

export async function unfollowCollection(
  collectionId: string,
  userId: string
): Promise<void> {
  await db.collectionFollow.deleteMany({
    where: { userId, collectionId },
  })
}

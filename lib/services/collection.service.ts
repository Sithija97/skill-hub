import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import type { Skill } from '@/types/skill'
import type { TargetTool } from '@/types/skill'
import type { CollectionWithSkills } from '@/types/collection'
import type { PaginatedResponse } from '@/types/api'

export interface CreateCollectionInput {
  name: string
  description?: string
  isPublic: boolean
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>

const collectionInclude = {
  skills: {
    include: { skill: true },
    orderBy: { addedAt: 'desc' as const },
  },
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
    skills: row.skills.map((cs) => ({
      id: cs.skill.id,
      title: cs.skill.title,
      description: cs.skill.description,
      content: cs.skill.content,
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
  const where = userId
    ? { authorId: userId }
    : { isPublic: true }

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

  return mapCollection(row)
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionInput
): Promise<CollectionWithSkills> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const existing = await db.collection.findUnique({ where: { id } })
  if (!existing) throw new Error(`Collection not found: ${id}`)
  if (existing.authorId !== session.userId) throw new Error('Not authorized')

  const row = await db.collection.update({
    where: { id },
    data,
    include: collectionInclude,
  })

  return mapCollection(row)
}

export async function deleteCollection(id: string): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const existing = await db.collection.findUnique({ where: { id } })
  if (!existing) throw new Error(`Collection not found: ${id}`)
  if (existing.authorId !== session.userId) throw new Error('Not authorized')

  await db.collection.delete({ where: { id } })
}

export async function addSkillToCollection(
  collectionId: string,
  skillId: string
): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const collection = await db.collection.findUnique({ where: { id: collectionId } })
  if (!collection) throw new Error('Collection not found')
  if (collection.authorId !== session.userId) throw new Error('Not authorized')

  await db.collectionSkill.upsert({
    where: { collectionId_skillId: { collectionId, skillId } },
    create: { collectionId, skillId },
    update: {},
  })
}

export async function removeSkillFromCollection(
  collectionId: string,
  skillId: string
): Promise<void> {
  const session = await getCurrentUser()
  if (!session) throw new Error('Not authenticated')

  const collection = await db.collection.findUnique({ where: { id: collectionId } })
  if (!collection) throw new Error('Collection not found')
  if (collection.authorId !== session.userId) throw new Error('Not authorized')

  await db.collectionSkill.deleteMany({
    where: { collectionId, skillId },
  })
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

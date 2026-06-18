import type { CollectionWithSkills } from '@/types/collection'
import type { PaginatedResponse } from '@/types/api'
import { MOCK_COLLECTIONS } from './data/collections.mock'
import { MOCK_CURRENT_USER_ID } from './data/users.mock'

export interface CreateCollectionInput {
  name: string
  description: string
  isPublic: boolean
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>

const delay = (): Promise<void> => new Promise((r) => setTimeout(r, 100))

export async function getCollections(
  userId?: string
): Promise<PaginatedResponse<CollectionWithSkills>> {
  await delay()
  const results = userId
    ? MOCK_COLLECTIONS.filter((c) => c.authorId === userId)
    : MOCK_COLLECTIONS.filter((c) => c.isPublic)
  return {
    data: results,
    total: results.length,
    page: 1,
    pageSize: 20,
    hasMore: false,
  }
}

export async function getCollectionById(
  id: string
): Promise<CollectionWithSkills | null> {
  await delay()
  return MOCK_COLLECTIONS.find((c) => c.id === id) ?? null
}

export async function createCollection(
  data: CreateCollectionInput
): Promise<CollectionWithSkills> {
  await delay()
  const now = new Date().toISOString()
  return {
    id: `col_new_${Date.now()}`,
    name: data.name,
    description: data.description,
    isPublic: data.isPublic,
    authorId: MOCK_CURRENT_USER_ID,
    createdAt: now,
    updatedAt: now,
    skills: [],
  }
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionInput
): Promise<CollectionWithSkills> {
  await delay()
  const collection = MOCK_COLLECTIONS.find((c) => c.id === id)
  if (!collection) throw new Error(`Collection not found: ${id}`)
  return {
    ...collection,
    ...data,
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteCollection(id: string): Promise<void> {
  await delay()
  const collection = MOCK_COLLECTIONS.find((c) => c.id === id)
  if (!collection) throw new Error(`Collection not found: ${id}`)
}

export async function addSkillToCollection(
  _collectionId: string,
  _skillId: string
): Promise<void> {
  await delay()
}

export async function removeSkillFromCollection(
  _collectionId: string,
  _skillId: string
): Promise<void> {
  await delay()
}

export async function followCollection(
  _collectionId: string,
  _userId: string
): Promise<void> {
  await delay()
}

export async function unfollowCollection(
  _collectionId: string,
  _userId: string
): Promise<void> {
  await delay()
}

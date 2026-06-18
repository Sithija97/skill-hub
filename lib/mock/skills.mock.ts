import type { SkillWithRelations, SkillVersion, TargetTool } from '@/types/skill'
import type { PaginatedResponse } from '@/types/api'
import { MOCK_SKILLS, MOCK_LIKED_SKILL_IDS, MOCK_SAVED_SKILL_IDS } from './data/skills.mock'
import { MOCK_VERSIONS } from './data/versions.mock'
import { MOCK_TAGS } from './data/tags.mock'
import { MOCK_CURRENT_USER_ID, getMockUserById } from './data/users.mock'

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

const delay = (): Promise<void> => new Promise((r) => setTimeout(r, 100))

export async function getSkills(
  filters?: SkillFilters
): Promise<PaginatedResponse<SkillWithRelations>> {
  await delay()

  let results = [...MOCK_SKILLS]

  if (filters?.targetTool) {
    results = results.filter((s) => s.targetTool === filters.targetTool)
  }
  if (filters?.isPublic !== undefined) {
    results = results.filter((s) => s.isPublic === filters.isPublic)
  }
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter((s) =>
      filters.tags!.some((slug) => s.tags.some((t) => t.slug === slug))
    )
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.name.toLowerCase().includes(q))
    )
  }

  switch (filters?.sortBy) {
    case 'popular':
      results.sort((a, b) => b.likesCount - a.likesCount)
      break
    case 'forked':
      results.sort((a, b) => b.forksCount - a.forksCount)
      break
    case 'latest':
    default:
      results.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
  }

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const start = (page - 1) * pageSize
  const paged = results.slice(start, start + pageSize)

  return {
    data: paged,
    total: results.length,
    page,
    pageSize,
    hasMore: start + pageSize < results.length,
  }
}

export async function getSkillById(
  id: string
): Promise<SkillWithRelations | null> {
  await delay()
  const skill = MOCK_SKILLS.find((s) => s.id === id)
  if (!skill) return null
  const versions = MOCK_VERSIONS.filter((v) => v.skillId === id)
  return { ...skill, versions }
}

export async function getSkillsByUser(
  userId: string
): Promise<SkillWithRelations[]> {
  await delay()
  return MOCK_SKILLS.filter((s) => s.authorId === userId)
}

export async function createSkill(
  data: CreateSkillInput
): Promise<SkillWithRelations> {
  await delay()
  const now = new Date().toISOString()
  const author = getMockUserById(MOCK_CURRENT_USER_ID)!
  const skillTags = MOCK_TAGS.filter((t) => data.tags.includes(t.slug))
  const newSkill: SkillWithRelations = {
    id: `skill_new_${Date.now()}`,
    title: data.title,
    description: data.description,
    content: data.content,
    targetTool: data.targetTool,
    isPublic: data.isPublic,
    version: 1,
    likesCount: 0,
    savesCount: 0,
    forksCount: 0,
    createdAt: now,
    updatedAt: now,
    authorId: MOCK_CURRENT_USER_ID,
    forkedFromId: null,
    author,
    tags: skillTags,
    versions: [],
    isLiked: false,
    isSaved: false,
  }
  return newSkill
}

export async function updateSkill(
  id: string,
  data: UpdateSkillInput
): Promise<SkillWithRelations> {
  await delay()
  const skill = MOCK_SKILLS.find((s) => s.id === id)
  if (!skill) throw new Error(`Skill not found: ${id}`)
  const updatedTags = data.tags
    ? MOCK_TAGS.filter((t) => data.tags!.includes(t.slug))
    : skill.tags
  return {
    ...skill,
    ...data,
    tags: updatedTags,
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteSkill(id: string): Promise<void> {
  await delay()
  const skill = MOCK_SKILLS.find((s) => s.id === id)
  if (!skill) throw new Error(`Skill not found: ${id}`)
}

export async function forkSkill(
  id: string,
  userId: string
): Promise<SkillWithRelations> {
  await delay()
  const original = MOCK_SKILLS.find((s) => s.id === id)
  if (!original) throw new Error(`Skill not found: ${id}`)
  const author = getMockUserById(userId)!
  const now = new Date().toISOString()
  return {
    ...original,
    id: `skill_fork_${Date.now()}`,
    title: `${original.title} (Fork)`,
    authorId: userId,
    author,
    forkedFromId: id,
    version: 1,
    likesCount: 0,
    savesCount: 0,
    forksCount: 0,
    createdAt: now,
    updatedAt: now,
    isLiked: false,
    isSaved: false,
    versions: [],
  }
}

export async function likeSkill(id: string, _userId: string): Promise<void> {
  await delay()
  MOCK_LIKED_SKILL_IDS.add(id)
}

export async function unlikeSkill(id: string, _userId: string): Promise<void> {
  await delay()
  MOCK_LIKED_SKILL_IDS.delete(id)
}

export async function saveSkill(id: string, _userId: string): Promise<void> {
  await delay()
  MOCK_SAVED_SKILL_IDS.add(id)
}

export async function unsaveSkill(id: string, _userId: string): Promise<void> {
  await delay()
  MOCK_SAVED_SKILL_IDS.delete(id)
}

export async function getSkillVersions(
  skillId: string
): Promise<SkillVersion[]> {
  await delay()
  return MOCK_VERSIONS.filter((v) => v.skillId === skillId).sort(
    (a, b) => b.version - a.version
  )
}

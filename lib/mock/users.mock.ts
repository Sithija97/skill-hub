import type { User, UserProfile } from '@/types/user'
import { MOCK_USERS, MOCK_CURRENT_USER_ID } from './data/users.mock'
import { MOCK_SKILLS } from './data/skills.mock'

const delay = (): Promise<void> => new Promise((r) => setTimeout(r, 100))

export async function getUserById(id: string): Promise<User | null> {
  await delay()
  return MOCK_USERS.find((u) => u.id === id) ?? null
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  await delay()
  return MOCK_USERS.find((u) => u.username === username) ?? null
}

export async function getUserProfile(
  username: string
): Promise<UserProfile | null> {
  await delay()
  const user = MOCK_USERS.find((u) => u.username === username)
  if (!user) return null
  const skillsCount = MOCK_SKILLS.filter(
    (s) => s.authorId === user.id && s.isPublic
  ).length
  return {
    ...user,
    skillsCount,
    followersCount: Math.floor(Math.random() * 50) + 5,
  }
}

export async function getCurrentUserId(): Promise<string> {
  await delay()
  return MOCK_CURRENT_USER_ID
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'displayName' | 'bio' | 'avatarUrl'>>
): Promise<User> {
  await delay()
  const user = MOCK_USERS.find((u) => u.id === id)
  if (!user) throw new Error(`User not found: ${id}`)
  return {
    ...user,
    ...data,
    updatedAt: new Date().toISOString(),
  }
}

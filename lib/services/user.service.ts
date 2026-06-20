import { db } from '@/lib/db'
import type { User, UserProfile } from '@/types/user'

function mapUser(row: {
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}): User {
  return {
    id: row.id,
    username: row.username,
    displayName: row.displayName,
    bio: row.bio,
    avatarUrl: row.avatarUrl,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const row = await db.user.findUnique({ where: { id } })
  return row ? mapUser(row) : null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const row = await db.user.findUnique({ where: { username } })
  return row ? mapUser(row) : null
}

export async function getUserProfile(username: string): Promise<UserProfile | null> {
  const row = await db.user.findUnique({ where: { username } })
  if (!row) return null

  const skillsCount = await db.skill.count({
    where: { authorId: row.id, isPublic: true },
  })

  return {
    ...mapUser(row),
    skillsCount,
    followersCount: 0,
  }
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'displayName' | 'username' | 'bio'>>
): Promise<User> {
  const row = await db.user.update({
    where: { id },
    data,
  })
  return mapUser(row)
}

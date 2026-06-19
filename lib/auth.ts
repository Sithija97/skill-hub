import { auth } from '@clerk/nextjs/server'
import { db } from './db'

export async function getCurrentUser() {
  const { userId, sessionId } = await auth()
  if (!userId) return null
  return { userId, sessionId }
}

export async function requireAuth() {
  const { userId, sessionId, redirectToSignIn } = await auth()
  if (!userId) {
    return redirectToSignIn()
  }
  return { userId, sessionId }
}

export async function getCurrentDbUser() {
  const session = await getCurrentUser()
  if (!session) return null
  return db.user.findUnique({ where: { id: session.userId } })
}

import { cache } from 'react'
import { auth } from '@clerk/nextjs/server'
import { db } from './db'

export const getCurrentUser = cache(async () => {
  const { userId, sessionId } = await auth()
  if (!userId) return null
  return { userId, sessionId }
})

export async function requireAuth() {
  const { userId, sessionId, redirectToSignIn } = await auth()
  if (!userId) {
    return redirectToSignIn()
  }
  return { userId, sessionId }
}

export async function requireAuthApi(): Promise<string> {
  const session = await getCurrentUser()
  if (!session) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session.userId
}

export async function getCurrentDbUser() {
  const session = await getCurrentUser()
  if (!session) return null
  return db.user.findUnique({ where: { id: session.userId } })
}

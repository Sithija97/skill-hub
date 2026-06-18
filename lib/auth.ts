import { auth } from '@clerk/nextjs/server'

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

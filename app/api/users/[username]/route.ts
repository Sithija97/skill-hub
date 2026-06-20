import { requireAuthApi } from '@/lib/auth'
import { getUserProfile, getUserByUsername, updateUser } from '@/lib/services/user.service'
import { updateUserSchema } from '@/lib/validations/user'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const profile = await getUserProfile(username)
    if (!profile) return Response.json({ error: 'User not found' }, { status: 404 })
    return Response.json(profile)
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const userId = await requireAuthApi()
    const { username } = await params

    const currentUser = await getUserByUsername(username)
    if (!currentUser) return Response.json({ error: 'User not found' }, { status: 404 })
    if (currentUser.id !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }

    if (parsed.data.username && parsed.data.username !== username) {
      const existing = await getUserByUsername(parsed.data.username)
      if (existing) {
        return Response.json({ error: 'Username already taken' }, { status: 409 })
      }
    }

    const updated = await updateUser(userId, parsed.data)
    return Response.json(updated)
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

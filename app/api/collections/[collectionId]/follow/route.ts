import { requireAuthApi } from '@/lib/auth'
import { followCollection, unfollowCollection } from '@/lib/services/collection.service'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`follow:${userId}`, 30, 60_000)) return rateLimitResponse()
    const { collectionId } = await params
    await followCollection(collectionId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Collection not found' }, { status: 404 })
    }
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('[API collections/follow]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`follow:${userId}`, 30, 60_000)) return rateLimitResponse()
    const { collectionId } = await params
    await unfollowCollection(collectionId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections/follow]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

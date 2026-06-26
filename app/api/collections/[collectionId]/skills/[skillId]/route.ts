import { requireAuthApi } from '@/lib/auth'
import {
  addSkillToCollection,
  removeSkillFromCollection,
} from '@/lib/services/collection.service'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string; skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`collection-skill:${userId}`, 30, 60_000)) return rateLimitResponse()
    const { collectionId, skillId } = await params
    await addSkillToCollection(collectionId, skillId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('[API collections/skills]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string; skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`collection-skill:${userId}`, 30, 60_000)) return rateLimitResponse()
    const { collectionId, skillId } = await params
    await removeSkillFromCollection(collectionId, skillId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('[API collections/skills]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

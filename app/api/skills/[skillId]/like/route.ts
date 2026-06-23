import { likeSkill, unlikeSkill } from '@/lib/services/skill.service'
import { requireAuthApi } from '@/lib/auth'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`like:${userId}`, 30, 60_000)) return rateLimitResponse()
    const { skillId } = await params
    await likeSkill(skillId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API skills/like]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`like:${userId}`, 30, 60_000)) return rateLimitResponse()
    const { skillId } = await params
    await unlikeSkill(skillId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API skills/like]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

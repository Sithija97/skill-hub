import { requireAuthApi } from '@/lib/auth'
import { getUserCollectionsForSkill } from '@/lib/services/collection.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    await requireAuthApi()
    const { skillId } = await params
    const statuses = await getUserCollectionsForSkill(skillId)
    return Response.json(statuses)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections/skill-status]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

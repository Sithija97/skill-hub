import { forkSkill } from '@/lib/services/skill.service'
import { requireAuthApi } from '@/lib/auth'
import { invalidateSidebar } from '@/lib/cache'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    const { skillId } = await params
    const skill = await forkSkill(skillId, userId)
    invalidateSidebar()
    return Response.json(skill, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Skill not found' }, { status: 404 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

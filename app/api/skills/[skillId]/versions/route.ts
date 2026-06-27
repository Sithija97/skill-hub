import { getCachedSkillVersions } from '@/lib/cache'
import { getSkillById } from '@/lib/services/skill.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const { skillId } = await params
    const skill = await getSkillById(skillId)
    if (!skill) return Response.json({ error: 'Skill not found' }, { status: 404 })

    const versions = await getCachedSkillVersions(skillId)
    return Response.json(versions)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API skills/versions]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

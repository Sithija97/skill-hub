import { getSkillById } from '@/lib/services/skill.service'
import { formatSkillForExport } from '@/lib/services/export.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const { skillId } = await params
    const skill = await getSkillById(skillId)
    if (!skill) return Response.json({ error: 'Skill not found' }, { status: 404 })

    const { content, filename, mimeType } = formatSkillForExport(skill)
    return new Response(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API skills/export]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

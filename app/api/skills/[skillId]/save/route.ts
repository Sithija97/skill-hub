import { saveSkill, unsaveSkill } from '@/lib/services/skill.service'
import { requireAuthApi } from '@/lib/auth'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    const { skillId } = await params
    await saveSkill(skillId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    const { skillId } = await params
    await unsaveSkill(skillId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

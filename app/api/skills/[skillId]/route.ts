import { z } from 'zod/v4'
import { getSkillById, updateSkill, deleteSkill } from '@/lib/services/skill.service'
import { requireAuthApi } from '@/lib/auth'
import { updateSkillSchema } from '@/lib/validations/skill'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    const { skillId } = await params
    const skill = await getSkillById(skillId)
    if (!skill) return Response.json({ error: 'Skill not found' }, { status: 404 })
    return Response.json(skill)
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    await requireAuthApi()
    const { skillId } = await params
    const body = await req.json()
    const validated = updateSkillSchema.parse(body)
    const skill = await updateSkill(skillId, validated)
    return Response.json(skill)
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues }, { status: 400 })
    }
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Skill not found' }, { status: 404 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ skillId: string }> }
) {
  try {
    await requireAuthApi()
    const { skillId } = await params
    await deleteSkill(skillId)
    return new Response(null, { status: 204 })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Skill not found' }, { status: 404 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { db } from '@/lib/db'
import { requireAuthApi } from '@/lib/auth'

export async function POST() {
  try {
    await requireAuthApi()

    const skills = await db.skill.findMany({ select: { id: true } })

    let updated = 0
    for (const skill of skills) {
      const [likesCount, savesCount, forksCount] = await Promise.all([
        db.skillLike.count({ where: { skillId: skill.id } }),
        db.skillSave.count({ where: { skillId: skill.id } }),
        db.skill.count({ where: { forkedFromId: skill.id } }),
      ])

      await db.skill.update({
        where: { id: skill.id },
        data: { likesCount, savesCount, forksCount },
      })
      updated++
    }

    return Response.json({ success: true, updated })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API admin/reconcile-counters]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

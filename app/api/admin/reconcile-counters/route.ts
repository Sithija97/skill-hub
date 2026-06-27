import { db } from '@/lib/db'
import { requireAuthApi } from '@/lib/auth'

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? '').split(',').filter(Boolean)

export async function POST() {
  try {
    const userId = await requireAuthApi()

    if (!ADMIN_USER_IDS.includes(userId)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

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

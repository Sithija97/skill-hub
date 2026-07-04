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

    const [likeCounts, saveCounts, forkCounts] = await Promise.all([
      db.skillLike.groupBy({ by: ['skillId'], _count: { skillId: true } }),
      db.skillSave.groupBy({ by: ['skillId'], _count: { skillId: true } }),
      db.skill.groupBy({ by: ['forkedFromId'], where: { forkedFromId: { not: null } }, _count: { forkedFromId: true } }),
    ])

    const likeMap = new Map(likeCounts.map((r) => [r.skillId, r._count.skillId]))
    const saveMap = new Map(saveCounts.map((r) => [r.skillId, r._count.skillId]))
    const forkMap = new Map(forkCounts.map((r) => [r.forkedFromId as string, r._count.forkedFromId]))

    await db.$transaction(
      skills.map((skill) =>
        db.skill.update({
          where: { id: skill.id },
          data: {
            likesCount: likeMap.get(skill.id) ?? 0,
            savesCount: saveMap.get(skill.id) ?? 0,
            forksCount: forkMap.get(skill.id) ?? 0,
          },
        })
      )
    )

    return Response.json({ success: true, updated: skills.length })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API admin/reconcile-counters]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

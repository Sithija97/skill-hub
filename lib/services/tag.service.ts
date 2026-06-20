import { db } from '@/lib/db'
import type { Tag } from '@/types/skill'

export async function getTags(): Promise<Tag[]> {
  const rows = await db.tag.findMany({ orderBy: { name: 'asc' } })
  return rows.map((t) => ({ id: t.id, name: t.name, slug: t.slug }))
}

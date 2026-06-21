import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getSkillById } from '@/lib/services/skill.service'
import { getCachedTags } from '@/lib/cache'
import { EditSkillClient } from './edit-skill-client'

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { userId } = await requireAuth()
  const { skillId } = await params
  const [skill, tags] = await Promise.all([
    getSkillById(skillId),
    getCachedTags(),
  ])
  if (!skill || skill.authorId !== userId) redirect('/dashboard')

  return <EditSkillClient skill={skill} availableTags={tags} />
}

import { redirect } from 'next/navigation'
import { getSkillById } from '@/lib/services/skill.service'
import { EditSkillClient } from './edit-skill-client'

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill || skill.authorId !== 'user_mock_current') redirect('/dashboard')

  return <EditSkillClient skill={skill} />
}

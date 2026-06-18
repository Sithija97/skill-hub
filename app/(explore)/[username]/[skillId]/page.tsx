import { redirect } from 'next/navigation'
import { getSkillById } from '@/lib/services/skill.service'
import { PublicSkillClient } from './public-skill-client'

export default async function PublicSkillPage({
  params,
}: {
  params: Promise<{ username: string; skillId: string }>
}) {
  const { username, skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/explore')

  return <PublicSkillClient skill={skill} username={username} />
}

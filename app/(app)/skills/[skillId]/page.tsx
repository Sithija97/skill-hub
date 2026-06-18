import { redirect } from 'next/navigation'
import { getSkillById } from '@/lib/services/skill.service'
import { SkillDetailClient } from './skill-detail-client'

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/dashboard')

  return <SkillDetailClient skill={skill} />
}

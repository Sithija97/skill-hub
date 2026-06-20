import { redirect } from 'next/navigation'
import { getSkillById } from '@/lib/services/skill.service'
import { VersionsClient } from './versions-client'

export default async function SkillVersionsPage({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/dashboard')

  return <VersionsClient skill={skill} versions={skill.versions} />
}

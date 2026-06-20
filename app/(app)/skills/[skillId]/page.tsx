import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getSkillById, getSkillForkOrigin } from '@/lib/services/skill.service'
import { TARGET_TOOLS } from '@/config/tools'
import { SkillDetailClient } from './skill-detail-client'

type Props = { params: Promise<{ skillId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) return { title: 'Skill not found — SkillHub' }

  const toolLabel = TARGET_TOOLS[skill.targetTool].label
  return {
    title: `${skill.title} — SkillHub`,
    description: skill.description,
    openGraph: {
      title: `${skill.title} (${toolLabel}) — SkillHub`,
      description: skill.description,
    },
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { userId } = await requireAuth()
  const { skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/dashboard')

  const forkedFrom = await getSkillForkOrigin(skill.forkedFromId)

  return <SkillDetailClient skill={skill} currentUserId={userId} forkedFrom={forkedFrom} />
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getSkillById } from '@/lib/services/skill.service'
import { getCachedSkillForkOrigin } from '@/lib/cache'
import { TARGET_TOOLS } from '@/config/tools'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillDetailView } from '@/components/skills/skill-detail-view'
import { SkillOwnerActions } from '@/components/skills/skill-owner-actions'
import { SkillViewerActions } from '@/components/skills/skill-viewer-actions'

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

  const forkedFrom = skill.forkedFromId ? await getCachedSkillForkOrigin(skill.forkedFromId) : null
  const isOwner = skill.authorId === userId

  const sidebar = isOwner ? (
    <SkillOwnerActions skillId={skill.id} skillTitle={skill.title} />
  ) : (
    <SkillViewerActions
      skillId={skill.id}
      initialLiked={skill.isLiked ?? false}
      initialSaved={skill.isSaved ?? false}
      initialCounts={{ likes: skill.likesCount, saves: skill.savesCount, forks: skill.forksCount }}
    />
  )

  return (
    <SkillDetailView
      skill={skill}
      sidebar={sidebar}
      forkedFrom={forkedFrom}
      breadcrumb={
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: skill.title },
          ]}
        />
      }
    />
  )
}

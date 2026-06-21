import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSkillById, getSkillForkOrigin } from '@/lib/services/skill.service'
import { TARGET_TOOLS } from '@/config/tools'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillDetailView } from '@/components/skills/skill-detail-view'
import { SkillViewerActions } from '@/components/skills/skill-viewer-actions'

type Props = { params: Promise<{ username: string; skillId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) return { title: 'Skill not found — SkillHub' }

  const toolLabel = TARGET_TOOLS[skill.targetTool].label
  return {
    title: `${skill.title} — ${username} — SkillHub`,
    description: skill.description,
    openGraph: {
      title: `${skill.title} — SkillHub`,
      description: skill.description,
      type: 'article',
      authors: [username],
      tags: [...skill.tags.map((t) => t.name), toolLabel],
    },
  }
}

export default async function PublicSkillPage({ params }: Props) {
  const { username, skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/explore')

  const forkedFrom = await getSkillForkOrigin(skill.forkedFromId)

  return (
    <SkillDetailView
      skill={skill}
      sidebar={
        <SkillViewerActions
          skillId={skill.id}
          initialLiked={skill.isLiked ?? false}
          initialSaved={skill.isSaved ?? false}
          initialCounts={{ likes: skill.likesCount, saves: skill.savesCount, forks: skill.forksCount }}
        />
      }
      forkedFrom={forkedFrom}
      breadcrumb={
        <Breadcrumb
          items={[
            { label: username, href: `/${username}` },
            { label: skill.title },
          ]}
        />
      }
    />
  )
}

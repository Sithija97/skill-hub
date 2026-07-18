import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSkillById } from '@/lib/services/skill.service'
import { getCachedSkillForkOrigin } from '@/lib/cache'
import { TARGET_TOOLS } from '@/config/tools'
import { SITE_CONFIG } from '@/config/site'
import { buildSkillShareUrl } from '@/lib/share'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillDetailView } from '@/components/skills/skill-detail-view'
import { SkillViewerActions } from '@/components/skills/skill-viewer-actions'

type Props = { params: Promise<{ username: string; skillId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) return { title: 'Skill not found — SkillHub' }

  const toolLabel = TARGET_TOOLS[skill.targetTool].label
  const url = buildSkillShareUrl(username, skillId)
  return {
    title: `${skill.title} — ${username} — SkillHub`,
    description: skill.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${skill.title} — SkillHub`,
      description: skill.description,
      url,
      siteName: SITE_CONFIG.name,
      type: 'article',
      authors: [username],
      tags: [...skill.tags.map((t) => t.name), toolLabel],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${skill.title} — SkillHub`,
      description: skill.description,
    },
  }
}

export default async function PublicSkillPage({ params }: Props) {
  const { username, skillId } = await params
  const skill = await getSkillById(skillId)
  if (!skill) redirect('/')

  const forkedFrom = skill.forkedFromId ? await getCachedSkillForkOrigin(skill.forkedFromId) : null

  return (
    <SkillDetailView
      skill={skill}
      sidebar={
        <SkillViewerActions
          skillId={skill.id}
          initialLiked={skill.isLiked ?? false}
          initialSaved={skill.isSaved ?? false}
          initialCounts={{ likes: skill.likesCount, saves: skill.savesCount, forks: skill.forksCount }}
          isPublic={skill.isPublic}
          title={skill.title}
          authorUsername={skill.author.username}
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

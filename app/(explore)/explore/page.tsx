import { Suspense } from 'react'
import { getSkills } from '@/lib/services/skill.service'
import { getTags } from '@/lib/services/tag.service'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'
import { ExploreContent } from './explore-content'

export default async function ExplorePage() {
  const [initialData, allTags] = await Promise.all([
    getSkills({ isPublic: true, page: 1 }),
    getTags(),
  ])

  return (
    <Suspense fallback={<SkillGridSkeleton count={6} />}>
      <ExploreContent initialData={initialData} allTags={allTags} />
    </Suspense>
  )
}

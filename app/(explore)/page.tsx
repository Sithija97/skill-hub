import { Suspense } from 'react'
import { getSkills } from '@/lib/services/skill.service'
import { getCachedTags } from '@/lib/cache'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'
import { ExploreContent } from './explore/explore-content'

export default async function HomePage() {
  const [initialData, allTags] = await Promise.all([
    getSkills({ isPublic: true, page: 1 }),
    getCachedTags(),
  ])

  return (
    <div>
      {/* Hero */}
      <div className="pb-8 pt-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">
          Discover skills
        </h1>
        <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground">
          Browse and fork skills created by developers for Claude, Cursor,
          Copilot, and more.
        </p>
      </div>

      <Suspense fallback={<SkillGridSkeleton count={6} />}>
        <ExploreContent initialData={initialData} allTags={allTags} />
      </Suspense>
    </div>
  )
}

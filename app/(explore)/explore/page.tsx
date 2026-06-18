import { Suspense } from 'react'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'
import { ExploreContent } from './explore-content'

export default function ExplorePage() {
  return (
    <Suspense fallback={<SkillGridSkeleton count={6} />}>
      <ExploreContent />
    </Suspense>
  )
}

'use client'

import type { SkillWithRelations } from '@/types/skill'
import { Button } from '@/components/ui/button'
import { SkillCard } from '@/components/skills/skill-card'
import { SkillCardSkeleton, SkillGridSkeleton } from '@/components/shared/loading-skeleton'

interface SkillsGridProps {
  skills: SkillWithRelations[]
  loading: boolean
  fetching?: boolean
  hasMore: boolean
  onLoadMore: () => void
  showAuthor?: boolean
  loadingMore?: boolean
}

export function SkillsGrid({
  skills,
  loading,
  fetching = false,
  hasMore,
  onLoadMore,
  showAuthor = true,
  loadingMore = false,
}: SkillsGridProps) {
  if (loading || (fetching && skills.length === 0)) {
    return <SkillGridSkeleton count={6} />
  }

  if (fetching) {
    return <SkillGridSkeleton count={6} />
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} showAuthor={showAuthor} />
        ))}
        {loadingMore && Array.from({ length: 3 }, (_, i) => (
          <SkillCardSkeleton key={`skel-${i}`} />
        ))}
      </div>

      {hasMore && !loadingMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={fetching}>
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}

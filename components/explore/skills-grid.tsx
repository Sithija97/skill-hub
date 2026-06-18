'use client'

import type { SkillWithRelations } from '@/types/skill'
import { Button } from '@/components/ui/button'
import { SkillCard } from '@/components/skills/skill-card'
import { SkillGridSkeleton } from '@/components/shared/loading-skeleton'

interface SkillsGridProps {
  skills: SkillWithRelations[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  showAuthor?: boolean
}

export function SkillsGrid({
  skills,
  loading,
  hasMore,
  onLoadMore,
  showAuthor = true,
}: SkillsGridProps) {
  if (skills.length === 0 && loading) {
    return <SkillGridSkeleton count={6} />
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} showAuthor={showAuthor} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}

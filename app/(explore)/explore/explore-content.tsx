'use client'

import { useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { IconSearch, IconCompass } from '@tabler/icons-react'
import { TargetTool } from '@/types/skill'
import type { SkillWithRelations, Tag } from '@/types/skill'
import { useShallow } from 'zustand/react/shallow'
import { useExploreStore } from '@/store/explore-store'
import { useSkills } from '@/hooks/use-skills'
import { ExploreFilters } from '@/components/explore/explore-filters'
import { SkillsGrid } from '@/components/explore/skills-grid'
import { TrendingPanel } from '@/components/explore/trending-panel'
import { EmptyState } from '@/components/shared/empty-state'
import type { SkillFilters } from '@/lib/services/skill.service'
import type { PaginatedResponse } from '@/types/api'

interface ExploreContentProps {
  initialData?: PaginatedResponse<SkillWithRelations>
  allTags?: Tag[]
}

export function ExploreContent({ initialData, allTags = [] }: ExploreContentProps) {
  const searchParams = useSearchParams()
  const { filters, setFilters, resetFilters } = useExploreStore(useShallow((s) => ({ filters: s.filters, setFilters: s.setFilters, resetFilters: s.resetFilters })))

  useEffect(() => {
    resetFilters()

    const tool = searchParams.get('tool') as TargetTool | null
    const sort = searchParams.get('sort') as 'latest' | 'popular' | 'forked' | null
    const tag = searchParams.get('tag')
    const search = searchParams.get('q')

    const urlFilters: Partial<SkillFilters> = {}
    if (tool && Object.values(TargetTool).includes(tool)) urlFilters.targetTool = tool
    if (sort) urlFilters.sortBy = sort
    if (tag) urlFilters.tags = tag.split(',')
    if (search) urlFilters.search = search

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilters = useCallback(
    (newFilters: Partial<SkillFilters>) => {
      setFilters(newFilters)

      const merged = { ...filters, ...newFilters }
      const params = new URLSearchParams()
      if (merged.targetTool) params.set('tool', merged.targetTool)
      if (merged.sortBy && merged.sortBy !== 'latest') params.set('sort', merged.sortBy)
      if (merged.tags && merged.tags.length > 0) params.set('tag', merged.tags.join(','))
      if (merged.search) params.set('q', merged.search)

      const qs = params.toString()
      window.history.replaceState(null, '', qs ? `/explore?${qs}` : '/explore')
    },
    [filters, setFilters]
  )

  const exploreFilters = useMemo(
    () => ({ ...filters, isPublic: true }),
    [filters]
  )

  const { skills, loading, fetching, loadingMore, hasMore, loadMore, total } = useSkills(exploreFilters, initialData)

  const trendingSkills = useMemo(
    () => [...skills].sort((a, b) => b.likesCount - a.likesCount).slice(0, 5),
    [skills]
  )

  const popularTags = useMemo(() => allTags.slice(0, 8), [allTags])

  const handleTagClickFromPanel = useCallback(
    (slug: string) => {
      const current = filters.tags ?? []
      const next = current.includes(slug)
        ? current.filter((t) => t !== slug)
        : [...current, slug]
      updateFilters({ tags: next.length > 0 ? next : undefined })
    },
    [filters.tags, updateFilters]
  )

  return (
    <div>
      {/* Hero */}
      <div className="pb-8 pt-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Discover skills</h1>
        <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground">
          Browse and fork skills created by developers for Claude, Cursor, Copilot, and more.
        </p>

        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
            <IconSearch size={16} className="shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills, tags, tools..."
              defaultValue={filters.search ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim()
                  updateFilters({ search: val || undefined })
                }
              }}
              className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-[1fr_280px] items-start gap-6">
        <div>
          <div className="mb-5">
            <ExploreFilters filters={filters} onChange={updateFilters} total={total} allTags={allTags} fetching={fetching} />
          </div>

          {skills.length > 0 || loading || fetching ? (
            <SkillsGrid skills={skills} loading={loading} fetching={fetching} loadingMore={loadingMore} hasMore={hasMore} onLoadMore={loadMore} showAuthor />
          ) : (
            <EmptyState
              icon={IconCompass}
              title="No skills found"
              description="Try adjusting your filters or search for something different."
            />
          )}
        </div>

        <div className="sticky top-19">
          <TrendingPanel
            trendingSkills={trendingSkills}
            popularTags={popularTags}
            onTagClick={handleTagClickFromPanel}
            activeTags={filters.tags}
          />
        </div>
      </div>
    </div>
  )
}

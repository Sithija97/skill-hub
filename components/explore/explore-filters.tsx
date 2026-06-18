'use client'

import { useState } from 'react'
import { TargetTool } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { getTagsSync } from '@/lib/services/tag.service'
import type { SkillFilters } from '@/lib/services/skill.service'
import { Button } from '@/components/ui/button'
import { IconChevronDown, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

const TOOL_FILTERS: { key: TargetTool | undefined; label: string }[] = [
  { key: undefined, label: 'All' },
  ...Object.entries(TARGET_TOOLS).map(([key, val]) => ({
    key: key as TargetTool,
    label: val.label,
  })),
]

const SORT_OPTIONS: { key: 'latest' | 'popular' | 'forked'; label: string }[] = [
  { key: 'latest', label: 'Latest' },
  { key: 'popular', label: 'Most liked' },
  { key: 'forked', label: 'Most forked' },
]

interface ExploreFiltersProps {
  filters: SkillFilters
  onChange: (filters: Partial<SkillFilters>) => void
  total: number
}

export function ExploreFilters({ filters, onChange, total }: ExploreFiltersProps) {
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false)
  const selectedTags = filters.tags ?? []
  const allTags = getTagsSync()

  const toggleTag = (slug: string) => {
    const next = selectedTags.includes(slug)
      ? selectedTags.filter((t) => t !== slug)
      : [...selectedTags, slug]
    onChange({ tags: next.length > 0 ? next : undefined })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tool pills */}
        <div className="flex flex-1 flex-wrap gap-1">
          {TOOL_FILTERS.map((tool) => {
            const isActive = filters.targetTool === tool.key
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() => onChange({ targetTool: tool.key })}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-transparent bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                )}
              >
                {tool.label}
              </button>
            )
          })}
        </div>

        {/* Tag dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
            className={cn(
              'gap-1',
              selectedTags.length > 0 && 'bg-accent text-accent-foreground'
            )}
          >
            {selectedTags.length > 0 ? `Tags (${selectedTags.length})` : 'All tags'}
            <IconChevronDown size={12} />
          </Button>
          {tagDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTagDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-50 overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg max-h-70">
                {allTags.slice(0, 10).map((tag) => {
                  const isSelected = selectedTags.includes(tag.slug)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors',
                        isSelected
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border text-[10px]',
                          isSelected
                            ? 'border-ring bg-ring text-white'
                            : 'border-border'
                        )}
                      >
                        {isSelected && <IconCheck size={10} />}
                      </span>
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Sort */}
        <div className="flex overflow-hidden rounded-md border border-border">
          {SORT_OPTIONS.map((opt) => {
            const isActive = (filters.sortBy ?? 'latest') === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange({ sortBy: opt.key })}
                className={cn(
                  'border-r border-border px-3 py-1 text-xs transition-colors last:border-r-0',
                  isActive
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {total} {total === 1 ? 'skill' : 'skills'}
      </div>
    </div>
  )
}

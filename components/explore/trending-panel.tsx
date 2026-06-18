'use client'

import Link from 'next/link'
import { IconHeart } from '@tabler/icons-react'
import type { SkillWithRelations, Tag } from '@/types/skill'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TrendingPanelProps {
  trendingSkills: SkillWithRelations[]
  popularTags: Tag[]
  onTagClick: (slug: string) => void
  activeTags?: string[]
}

export function TrendingPanel({
  trendingSkills,
  popularTags,
  onTagClick,
  activeTags = [],
}: TrendingPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Trending skills */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
            TRENDING THIS WEEK
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-0.5">
          {trendingSkills.map((skill, i) => (
            <Link
              key={skill.id}
              href={`/${skill.author.username}/${skill.id}`}
              className="flex items-start gap-2 rounded-md p-2 no-underline transition-colors hover:bg-muted"
            >
              <span className="min-w-4 shrink-0 text-xs font-semibold leading-5 text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold leading-5 text-foreground">
                  {skill.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{skill.author.username}</span>
                  <span className="inline-flex items-center gap-0.5">
                    <IconHeart size={11} />
                    {skill.likesCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Popular tags */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
            POPULAR TAGS
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1">
          {popularTags.map((tag) => {
            const isActive = activeTags.includes(tag.slug)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagClick(tag.slug)}
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    'cursor-pointer transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted hover:text-foreground'
                  )}
                >
                  {tag.name}
                </Badge>
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

import { memo } from 'react'
import Link from 'next/link'
import { Heart, GitFork } from 'lucide-react'
import type { SkillWithRelations } from '@/types/skill'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TargetToolBadge } from './target-tool-badge'
import { PublicPrivateBadge } from './public-private-badge'

interface SkillCardProps {
  skill: SkillWithRelations
  showAuthor?: boolean
}

export const SkillCard = memo(function SkillCard({ skill, showAuthor = false }: SkillCardProps) {
  return (
    <Link href={showAuthor ? `/${skill.author.username}/${skill.id}` : `/skills/${skill.id}`} className="no-underline">
      <Card className="flex h-full flex-col transition-colors hover:border-border/80 hover:ring-border">
        <CardContent className="flex flex-1 flex-col gap-2">
          {/* Title + Tool Badge */}
          <div className="flex items-start justify-between gap-2">
            <span className="flex-1 text-sm font-semibold leading-snug text-foreground">
              {skill.title}
            </span>
            <TargetToolBadge tool={skill.targetTool} />
          </div>

          {/* Description */}
          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
            {skill.description}
          </p>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                  {tag.name}
                </Badge>
              ))}
              {skill.tags.length > 3 && (
                <span className="px-1 text-xs text-muted-foreground">
                  +{skill.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Heart size={13} />
            {skill.likesCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork size={13} />
            {skill.forksCount}
          </span>
          <PublicPrivateBadge isPublic={skill.isPublic} />

          {showAuthor && (
            <span className="ml-auto inline-flex items-center gap-1.5">
              <Avatar className="h-4.5 w-4.5 text-[10px]">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {skill.author.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{skill.author.username}</span>
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
})

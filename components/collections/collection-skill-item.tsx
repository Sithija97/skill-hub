import Link from 'next/link'
import type { Skill } from '@/types/skill'
import { Card, CardContent } from '@/components/ui/card'
import { SkillRemoveButton } from './skill-remove-button'

interface CollectionSkillItemProps {
  skill: Skill
  collectionId: string
  isOwner: boolean
}

export function CollectionSkillItem({ skill, collectionId, isOwner }: CollectionSkillItemProps) {
  return (
    <Card className="group relative flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-1">
        <Link href={`/skills/${skill.id}`} className="text-sm font-semibold text-foreground hover:underline">
          {skill.title}
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground">{skill.description}</p>
      </CardContent>
      {isOwner && <SkillRemoveButton collectionId={collectionId} skillId={skill.id} />}
    </Card>
  )
}

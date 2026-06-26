import Link from 'next/link'
import { Folder, FileText } from 'lucide-react'
import type { CollectionWithSkills } from '@/types/collection'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PublicPrivateBadge } from '@/components/skills/public-private-badge'
import { FollowButton } from './follow-button'

interface CollectionCardProps {
  collection: CollectionWithSkills
  showFollowButton?: boolean
}

export function CollectionCard({ collection, showFollowButton = false }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`} className="no-underline">
      <Card className="flex h-full flex-col transition-colors hover:border-border/80 hover:ring-border">
        <CardContent className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Folder size={16} className="shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm font-semibold text-foreground">{collection.name}</span>
            <Badge variant="secondary" className="px-1.5 text-xs">{collection.skills.length}</Badge>
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {collection.description}
          </p>

          {collection.skills.length > 0 && (
            <div className="flex flex-col gap-0.5 rounded bg-muted/50 p-2">
              {collection.skills.slice(0, 3).map((skill) => (
                <div key={skill.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText size={12} className="shrink-0 text-muted-foreground/60" />
                  <span className="truncate">{skill.title}</span>
                </div>
              ))}
              {collection.skills.length > 3 && (
                <div className="pl-4 text-xs text-muted-foreground/60">
                  +{collection.skills.length - 3} more
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-2">
          <PublicPrivateBadge isPublic={collection.isPublic} />
          {showFollowButton && <FollowButton collectionId={collection.id} />}
        </CardFooter>
      </Card>
    </Link>
  )
}

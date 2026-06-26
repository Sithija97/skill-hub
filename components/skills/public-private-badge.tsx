import { Globe, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PublicPrivateBadgeProps {
  isPublic: boolean
}

export function PublicPrivateBadge({ isPublic }: PublicPrivateBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={
        isPublic
          ? 'gap-0.5 bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400'
          : 'gap-0.5 bg-muted text-muted-foreground'
      }
    >
      {isPublic ? <Globe size={11} /> : <Lock size={11} />}
      {isPublic ? 'Public' : 'Private'}
    </Badge>
  )
}

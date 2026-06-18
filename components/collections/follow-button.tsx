'use client'

import { Button } from '@/components/ui/button'

export function FollowButton() {
  return (
    <Button
      variant="outline"
      size="xs"
      className="ml-auto"
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
    >
      Follow
    </Button>
  )
}

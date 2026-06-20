'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface FollowButtonProps {
  collectionId: string
  isFollowing?: boolean
}

export function FollowButton({ collectionId, isFollowing: initial = false }: FollowButtonProps) {
  const router = useRouter()
  const [following, setFollowing] = useState(initial)
  const [isPending, setIsPending] = useState(false)

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending) return
    setIsPending(true)

    const wasFollowing = following
    setFollowing(!wasFollowing)

    try {
      const res = await fetch(`/api/collections/${collectionId}/follow`, {
        method: wasFollowing ? 'DELETE' : 'POST',
      })
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
    } catch {
      setFollowing(wasFollowing)
      toast.error('Could not update follow status. Please try again.')
    } finally {
      setIsPending(false)
    }
  }, [collectionId, following, isPending, router])

  return (
    <Button
      variant={following ? 'secondary' : 'outline'}
      size="xs"
      className="ml-auto"
      onClick={handleClick}
      disabled={isPending}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  )
}

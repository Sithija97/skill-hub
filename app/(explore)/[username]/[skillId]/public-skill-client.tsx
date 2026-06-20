'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { SkillWithRelations } from '@/types/skill'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillDetailView } from '@/components/skills/skill-detail-view'
import { IconHeart, IconHeartFilled, IconBookmark, IconBookmarkFilled, IconGitFork } from '@tabler/icons-react'

interface PublicSkillClientProps {
  skill: SkillWithRelations
  username: string
  forkedFrom?: { title: string; authorUsername: string } | null
}

export function PublicSkillClient({ skill, username, forkedFrom }: PublicSkillClientProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(skill.isLiked)
  const [saved, setSaved] = useState(skill.isSaved)
  const [likeCount, setLikeCount] = useState(skill.likesCount)
  const [saveCount, setSaveCount] = useState(skill.savesCount)
  const [forksCount, setForksCount] = useState(skill.forksCount)
  const [isPending, setIsPending] = useState(false)

  const handleToggleLike = useCallback(async () => {
    if (isPending) return
    setIsPending(true)

    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount((c) => wasLiked ? c - 1 : c + 1)

    try {
      const res = await fetch(`/api/skills/${skill.id}/like`, {
        method: wasLiked ? 'DELETE' : 'POST',
      })
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
    } catch {
      setLiked(wasLiked)
      setLikeCount((c) => wasLiked ? c + 1 : c - 1)
      toast.error('Could not update like. Please try again.')
    } finally {
      setIsPending(false)
    }
  }, [skill.id, liked, isPending, router])

  const handleToggleSave = useCallback(async () => {
    if (isPending) return
    setIsPending(true)

    const wasSaved = saved
    setSaved(!wasSaved)
    setSaveCount((c) => wasSaved ? c - 1 : c + 1)

    try {
      const res = await fetch(`/api/skills/${skill.id}/save`, {
        method: wasSaved ? 'DELETE' : 'POST',
      })
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
    } catch {
      setSaved(wasSaved)
      setSaveCount((c) => wasSaved ? c + 1 : c - 1)
      toast.error('Could not update save. Please try again.')
    } finally {
      setIsPending(false)
    }
  }, [skill.id, saved, isPending, router])

  const handleFork = useCallback(async () => {
    if (isPending) return
    setIsPending(true)

    setForksCount((c) => c + 1)

    try {
      const res = await fetch(`/api/skills/${skill.id}/fork`, { method: 'POST' })
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
      const forkedSkill = await res.json()
      toast.success('Skill forked successfully')
      router.push(`/skills/${forkedSkill.id}/edit`)
    } catch {
      setForksCount((c) => c - 1)
      toast.error('Could not fork this skill. Please try again.')
    } finally {
      setIsPending(false)
    }
  }, [skill.id, isPending, router])

  const publicSidebar = (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">ACTIONS</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`justify-start gap-2 ${liked ? 'text-red-500' : ''}`}
          onClick={handleToggleLike}
          disabled={isPending}
        >
          {liked ? <IconHeartFilled size={15} /> : <IconHeart size={15} />}
          {liked ? 'Liked' : 'Like'}
          <span className="ml-auto text-xs text-muted-foreground">{likeCount}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`justify-start gap-2 ${saved ? 'text-ring' : ''}`}
          onClick={handleToggleSave}
          disabled={isPending}
        >
          {saved ? <IconBookmarkFilled size={15} /> : <IconBookmark size={15} />}
          {saved ? 'Saved' : 'Save'}
          <span className="ml-auto text-xs text-muted-foreground">{saveCount}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          onClick={handleFork}
          disabled={isPending}
        >
          <IconGitFork size={15} />
          Fork
          <span className="ml-auto text-xs text-muted-foreground">{forksCount}</span>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <SkillDetailView
      skill={skill}
      sidebar={publicSidebar}
      forkedFrom={forkedFrom}
      breadcrumb={
        <Breadcrumb
          items={[
            { label: username, href: `/${username}` },
            { label: skill.title },
          ]}
        />
      }
    />
  )
}

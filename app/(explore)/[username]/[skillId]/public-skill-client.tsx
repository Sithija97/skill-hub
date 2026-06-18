'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { likeSkill, unlikeSkill, saveSkill, unsaveSkill, forkSkill } from '@/lib/services/skill.service'
import type { SkillWithRelations } from '@/types/skill'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillDetailView } from '@/components/skills/skill-detail-view'
import { IconHeart, IconHeartFilled, IconBookmark, IconBookmarkFilled, IconGitFork } from '@tabler/icons-react'

interface PublicSkillClientProps {
  skill: SkillWithRelations
  username: string
}

export function PublicSkillClient({ skill, username }: PublicSkillClientProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(skill.isLiked)
  const [saved, setSaved] = useState(skill.isSaved)
  const [likeCount, setLikeCount] = useState(skill.likesCount)
  const [saveCount, setSaveCount] = useState(skill.savesCount)

  const handleToggleLike = useCallback(async () => {
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount((c) => wasLiked ? c - 1 : c + 1)
    try {
      if (wasLiked) await unlikeSkill(skill.id, 'user_mock_current')
      else await likeSkill(skill.id, 'user_mock_current')
    } catch {
      setLiked(wasLiked)
      setLikeCount((c) => wasLiked ? c + 1 : c - 1)
      toast.error('Failed to update like')
    }
  }, [skill.id, liked])

  const handleToggleSave = useCallback(async () => {
    const wasSaved = saved
    setSaved(!wasSaved)
    setSaveCount((c) => wasSaved ? c - 1 : c + 1)
    try {
      if (wasSaved) await unsaveSkill(skill.id, 'user_mock_current')
      else await saveSkill(skill.id, 'user_mock_current')
    } catch {
      setSaved(wasSaved)
      setSaveCount((c) => wasSaved ? c + 1 : c - 1)
      toast.error('Failed to update save')
    }
  }, [skill.id, saved])

  const handleFork = useCallback(async () => {
    try {
      const forked = await forkSkill(skill.id, 'user_mock_current')
      toast.success('Skill forked successfully')
      router.push(`/skills/${forked.id}/edit`)
    } catch {
      toast.error('Failed to fork skill')
    }
  }, [skill.id, router])

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
        >
          {saved ? <IconBookmarkFilled size={15} /> : <IconBookmark size={15} />}
          {saved ? 'Saved' : 'Save'}
          <span className="ml-auto text-xs text-muted-foreground">{saveCount}</span>
        </Button>

        <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleFork}>
          <IconGitFork size={15} />
          Fork
          <span className="ml-auto text-xs text-muted-foreground">{skill.forksCount}</span>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <SkillDetailView
      skill={skill}
      sidebar={publicSidebar}
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import type { Skill } from '@/types/skill'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CollectionSkillItemProps {
  skill: Skill
  collectionId: string
  isOwner: boolean
}

export function CollectionSkillItem({ skill, collectionId, isOwner }: CollectionSkillItemProps) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    try {
      const res = await fetch(`/api/collections/${collectionId}/skills/${skill.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      toast.success('Skill removed from collection')
      router.refresh()
    } catch {
      toast.error('Failed to remove skill')
      setRemoving(false)
    }
  }

  return (
    <Card className="group relative flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-1">
        <Link href={`/skills/${skill.id}`} className="text-sm font-semibold text-foreground hover:underline">
          {skill.title}
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground">{skill.description}</p>
      </CardContent>
      {isOwner && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleRemove}
          disabled={removing}
        >
          <X size={14} />
        </Button>
      )}
    </Card>
  )
}

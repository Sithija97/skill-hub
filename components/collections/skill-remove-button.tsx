'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SkillRemoveButtonProps {
  collectionId: string
  skillId: string
}

export function SkillRemoveButton({ collectionId, skillId }: SkillRemoveButtonProps) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    try {
      const res = await fetch(`/api/collections/${collectionId}/skills/${skillId}`, {
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
    <Button
      variant="ghost"
      size="icon-xs"
      className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
      onClick={handleRemove}
      disabled={removing}
    >
      <X size={14} />
    </Button>
  )
}

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddSkillDialog } from '@/components/collections/add-skill-dialog'

interface AddSkillButtonProps {
  collectionId: string
  existingSkillIds: string[]
}

export function AddSkillButton({ collectionId, existingSkillIds }: AddSkillButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={16} />
        Add Skills
      </Button>
      <AddSkillDialog
        collectionId={collectionId}
        existingSkillIds={existingSkillIds}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

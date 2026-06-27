'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { AddSkillDialog } from '@/components/collections/add-skill-dialog'
import { Pencil, Plus, Trash } from 'lucide-react'

interface CollectionActionsProps {
  collectionId: string
  collectionName: string
  existingSkillIds: string[]
}

export function CollectionActions({ collectionId, collectionName, existingSkillIds }: CollectionActionsProps) {
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/collections/${collectionId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Collection deleted')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to delete collection')
    }
    setShowDelete(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowAddSkill(true)}>
          <Plus size={15} />
          Add Skills
        </Button>
        <Link
          href={`/collections/${collectionId}/edit`}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <Pencil size={15} />
          Edit
        </Link>
        <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
          <Trash size={15} />
          Delete
        </Button>
      </div>
      <AddSkillDialog
        collectionId={collectionId}
        existingSkillIds={existingSkillIds}
        open={showAddSkill}
        onOpenChange={setShowAddSkill}
      />
      <ConfirmDialog
        open={showDelete}
        title="Delete collection"
        description={`Are you sure you want to delete "${collectionName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  )
}

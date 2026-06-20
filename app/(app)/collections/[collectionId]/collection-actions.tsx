'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { IconTrash } from '@tabler/icons-react'

interface CollectionActionsProps {
  collectionId: string
  collectionName: string
}

export function CollectionActions({ collectionId, collectionName }: CollectionActionsProps) {
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)

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
      <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
        <IconTrash size={15} />
        Delete
      </Button>
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

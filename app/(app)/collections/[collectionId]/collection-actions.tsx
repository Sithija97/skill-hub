'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Pencil, Trash } from 'lucide-react'

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
      <div className="flex items-center gap-2">
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

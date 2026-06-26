'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Check, Folder, Loader2 } from 'lucide-react'
import type { CollectionSkillStatus } from '@/types/collection'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface AddToCollectionDialogProps {
  skillId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToCollectionDialog({ skillId, open, onOpenChange }: AddToCollectionDialogProps) {
  const router = useRouter()
  const [collections, setCollections] = useState<CollectionSkillStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const fetchCollections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/collections/skill-status/${skillId}`)
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCollections(data)
    } catch {
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }, [skillId, router])

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (nextOpen) fetchCollections()
  }, [onOpenChange, fetchCollections])

  const handleToggle = useCallback(async (collectionId: string, hasSkill: boolean) => {
    if (pendingIds.has(collectionId)) return
    setPendingIds((prev) => new Set(prev).add(collectionId))

    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, hasSkill: !hasSkill } : c))
    )

    try {
      const res = await fetch(`/api/collections/${collectionId}/skills/${skillId}`, {
        method: hasSkill ? 'DELETE' : 'POST',
      })
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
      toast.success(hasSkill ? 'Removed from collection' : 'Added to collection')
    } catch {
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, hasSkill } : c))
      )
      toast.error('Failed to update collection')
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(collectionId)
        return next
      })
    }
  }, [skillId, pendingIds, router])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to collection</DialogTitle>
          <DialogDescription>Select which collections should include this skill.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : collections.length === 0 ? (
          <div className="py-6 text-center">
            <Folder size={24} className="mx-auto mb-2 text-muted-foreground" />
            <p className="mb-3 text-sm text-muted-foreground">You don&apos;t have any collections yet.</p>
            <Link href="/collections/new" className="inline-flex h-7 items-center rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-accent">
              Create a collection
            </Link>
          </div>
        ) : (
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                disabled={pendingIds.has(collection.id)}
                onClick={() => handleToggle(collection.id, collection.hasSkill)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                  'hover:bg-accent disabled:opacity-50',
                  collection.hasSkill && 'bg-accent'
                )}
              >
                <div className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                  collection.hasSkill
                    ? 'border-ring bg-ring text-primary-foreground'
                    : 'border-border'
                )}>
                  {collection.hasSkill && <Check size={12} />}
                </div>
                <span className="truncate">{collection.name}</span>
                {pendingIds.has(collection.id) && (
                  <Loader2 size={14} className="ml-auto animate-spin text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

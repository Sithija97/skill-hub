'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Search, Loader2, Check } from 'lucide-react'
import type { Skill } from '@/types/skill'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AddSkillDialogProps {
  collectionId: string
  existingSkillIds: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSkillDialog({ collectionId, existingSkillIds, open, onOpenChange }: AddSkillDialogProps) {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const abortRef = useRef<AbortController>(null)
  const addedAnyRef = useRef(false)

  const fetchSkills = useCallback(async (search: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const params = new URLSearchParams({ pageSize: '20' })
      if (search.trim()) params.set('search', search.trim())
      const res = await fetch(`/api/skills?${params}`, { signal: controller.signal })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSkills(data.data ?? [])
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      toast.error('Failed to load skills')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setAddedIds(new Set())
      addedAnyRef.current = false
      fetchSkills('')
    } else {
      if (addedAnyRef.current) router.refresh()
    }
    return () => {
      abortRef.current?.abort()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [open, fetchSkills, router])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSkills(value), 300)
  }, [fetchSkills])

  const handleAdd = useCallback(async (skillId: string) => {
    setPendingIds((prev) => {
      if (prev.has(skillId)) return prev
      const next = new Set(prev)
      next.add(skillId)
      return next
    })

    try {
      const res = await fetch(`/api/collections/${collectionId}/skills/${skillId}`, {
        method: 'POST',
      })
      if (res.status === 401) { router.push('/sign-in'); return }
      if (!res.ok) throw new Error()
      setAddedIds((prev) => new Set(prev).add(skillId))
      addedAnyRef.current = true
      toast.success('Skill added to collection')
    } catch {
      toast.error('Failed to add skill')
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(skillId)
        return next
      })
    }
  }, [collectionId, router])

  const allExistingIds = new Set([...existingSkillIds, ...addedIds])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add skills</DialogTitle>
          <DialogDescription>Search and add skills to this collection.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search size={15} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : skills.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {query.trim() ? 'No skills found.' : 'No skills available.'}
            </p>
          </div>
        ) : (
          <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
            {skills.map((skill) => {
              const isAdded = allExistingIds.has(skill.id)
              const isPending = pendingIds.has(skill.id)

              return (
                <div
                  key={skill.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{skill.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{skill.description}</p>
                  </div>

                  {isAdded ? (
                    <span className="flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground">
                      <Check size={14} />
                      Added
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      disabled={isPending}
                      onClick={() => handleAdd(skill.id)}
                    >
                      {isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      Add
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

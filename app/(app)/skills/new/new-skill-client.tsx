'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillForm } from '@/components/skills/skill-form'
import { SkillEditorSidebar } from '@/components/skills/skill-editor-sidebar'
import { createSkillAction } from '@/lib/actions/skill.actions'
import type { CreateSkillInput } from '@/lib/services/skill.service'
import type { Tag } from '@/types/skill'
import { useShallow } from 'zustand/react/shallow'
import { useEditorStore } from '@/store/editor-store'

interface NewSkillClientProps {
  availableTags: Tag[]
}

export function NewSkillClient({ availableTags }: NewSkillClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { draft, isDirty, resetDraft } = useEditorStore(useShallow((s) => ({ draft: s.draft, isDirty: s.isDirty, resetDraft: s.resetDraft })))
  const hasDraft = isDirty && !!draft.title
  const [showDraftBanner, setShowDraftBanner] = useState(hasDraft)

  const handleDiscard = () => {
    resetDraft()
    setShowDraftBanner(false)
  }

  const handleSubmit = async (data: CreateSkillInput) => {
    setIsSubmitting(true)
    try {
      const skill = await createSkillAction(data)
      toast.success('Skill created successfully')
      router.push(`/skills/${skill.id}`)
    } catch {
      toast.error('Failed to create skill')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'New skill' }]} />

      <h1 className="mb-6 text-xl font-semibold text-foreground">New skill</h1>

      {showDraftBanner && (
        <div className="mb-5 flex items-center justify-between rounded-md border border-ring/30 bg-accent p-3 text-sm text-foreground">
          <span>You have an unsaved draft. Continue editing?</span>
          <Button variant="ghost" size="xs" onClick={handleDiscard}>
            Discard
          </Button>
        </div>
      )}

      <div className="grid grid-cols-[1fr_340px] items-start gap-6">
        <SkillForm
          initialData={showDraftBanner ? draft : undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          availableTags={availableTags}
        />
        <div className="sticky top-19">
          <SkillEditorSidebar draft={draft} />
        </div>
      </div>
    </div>
  )
}

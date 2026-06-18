'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillForm } from '@/components/skills/skill-form'
import { SkillEditorSidebar } from '@/components/skills/skill-editor-sidebar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { updateSkill, deleteSkill } from '@/lib/services/skill.service'
import type { CreateSkillInput } from '@/lib/services/skill.service'
import type { SkillWithRelations } from '@/types/skill'
import { useEditorStore } from '@/store/editor-store'

export function EditSkillClient({ skill }: { skill: SkillWithRelations }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { draft, isDirty, resetDraft } = useEditorStore()

  const handleSubmit = async (data: CreateSkillInput) => {
    setIsSubmitting(true)
    try {
      await updateSkill(skill.id, data)
      toast.success('Skill updated')
      resetDraft()
      router.push(`/skills/${skill.id}`)
    } catch {
      toast.error('Failed to update skill')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSkill(skill.id)
      toast.success('Skill deleted')
      resetDraft()
      router.push('/dashboard')
    } catch {
      toast.error('Failed to delete skill')
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const initialData: Partial<CreateSkillInput> = {
    title: skill.title,
    description: skill.description,
    content: skill.content,
    targetTool: skill.targetTool,
    isPublic: skill.isPublic,
    tags: skill.tags.map((t) => t.slug),
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: skill.title, href: `/skills/${skill.id}` },
          { label: 'Edit' },
        ]}
      />

      <h1 className="mb-6 text-xl font-semibold text-foreground">Edit skill</h1>

      <div className="grid grid-cols-[1fr_340px] items-start gap-6">
        <div>
          <SkillForm
            initialData={initialData}
            skillId={skill.id}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <Separator className="my-8" />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-destructive">Danger zone</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Permanently delete this skill. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
              Delete skill
            </Button>
          </div>
        </div>

        <div className="sticky top-19">
          <SkillEditorSidebar draft={Object.keys(draft).length > 0 ? draft : initialData} />
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete skill"
        description={`Are you sure you want to delete "${skill.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

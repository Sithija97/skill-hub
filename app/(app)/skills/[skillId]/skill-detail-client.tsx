'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { deleteSkillAction } from '@/lib/actions/skill.actions'
import type { SkillWithRelations } from '@/types/skill'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { SkillDetailView } from '@/components/skills/skill-detail-view'
import { IconPencil, IconHistory, IconTrash } from '@tabler/icons-react'

export function SkillDetailClient({ skill, currentUserId, forkedFrom }: { skill: SkillWithRelations; currentUserId: string; forkedFrom?: { title: string; authorUsername: string } | null }) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteSkillAction(skill.id)
      toast.success('Skill deleted')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to delete skill')
    }
    setShowDeleteDialog(false)
  }

  const isOwner = skill.authorId === currentUserId

  const ownerSidebar = (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">ACTIONS</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link
          href={`/skills/${skill.id}/edit`}
          className={buttonVariants({ variant: 'outline', size: 'sm', className: 'justify-start gap-2' })}
        >
          <IconPencil size={15} />
          Edit skill
        </Link>
        <Link
          href={`/skills/${skill.id}/versions`}
          className={buttonVariants({ variant: 'outline', size: 'sm', className: 'justify-start gap-2' })}
        >
          <IconHistory size={15} />
          View versions
        </Link>
        <Button
          variant="destructive"
          size="sm"
          className="justify-start gap-2"
          onClick={() => setShowDeleteDialog(true)}
        >
          <IconTrash size={15} />
          Delete skill
        </Button>
      </CardContent>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete skill"
        description={`Are you sure you want to delete "${skill.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </Card>
  )

  return (
    <SkillDetailView
      skill={skill}
      sidebar={isOwner ? ownerSidebar : null}
      forkedFrom={forkedFrom}
      breadcrumb={
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: skill.title },
          ]}
        />
      }
    />
  )
}

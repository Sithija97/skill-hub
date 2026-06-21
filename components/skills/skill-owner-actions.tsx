'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { deleteSkillAction } from '@/lib/actions/skill.actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { IconPencil, IconHistory, IconTrash } from '@tabler/icons-react'

interface SkillOwnerActionsProps {
  skillId: string
  skillTitle: string
}

export function SkillOwnerActions({ skillId, skillTitle }: SkillOwnerActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteSkillAction(skillId)
      toast.success('Skill deleted')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to delete skill')
    }
    setShowDeleteDialog(false)
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">ACTIONS</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link
          href={`/skills/${skillId}/edit`}
          className={buttonVariants({ variant: 'outline', size: 'sm', className: 'justify-start gap-2' })}
        >
          <IconPencil size={15} />
          Edit skill
        </Link>
        <Link
          href={`/skills/${skillId}/versions`}
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
        description={`Are you sure you want to delete "${skillTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </Card>
  )
}

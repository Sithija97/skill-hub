'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { updateSkill } from '@/lib/services/skill.service'
import type { SkillWithRelations, SkillVersion } from '@/types/skill'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { SkillDiff } from '@/components/skills/skill-diff'
import { IconArrowLeft, IconEye, IconEyeOff, IconArrowBackUp } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface VersionsClientProps {
  skill: SkillWithRelations
  versions: SkillVersion[]
}

export function VersionsClient({ skill, versions }: VersionsClientProps) {
  const router = useRouter()
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<SkillVersion | null>(null)

  const handleRestore = async () => {
    if (!restoreTarget) return
    try {
      await updateSkill(skill.id, { content: restoreTarget.content })
      toast.success(`Restored to version ${restoreTarget.version}`)
      router.push(`/skills/${skill.id}`)
    } catch {
      toast.error('Failed to restore version')
    }
    setRestoreTarget(null)
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: skill.title, href: `/skills/${skill.id}` },
          { label: 'Versions' },
        ]}
      />

      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/skills/${skill.id}`}
          className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
        >
          <IconArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="m-0 text-xl font-semibold text-foreground">Version history</h1>
          <p className="m-0 text-sm text-muted-foreground">{skill.title}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {versions.length === 0 && (
          <p className="text-sm text-muted-foreground">No version history available.</p>
        )}
        {versions.map((version, index) => {
          const isCurrent = index === 0
          const isExpanded = expandedVersion === version.id
          const prevVersion = versions[index + 1]
          const versionDate = new Date(version.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <Card
              key={version.id}
              className={cn('overflow-hidden', isCurrent && 'border-l-[3px] border-l-ring')}
            >
              <CardContent className="flex items-center gap-3 py-3">
                <Badge variant={isCurrent ? 'default' : 'secondary'} className="min-w-9 justify-center">
                  v{version.version}
                </Badge>

                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground">
                    {version.changelog || (
                      <span className="italic text-muted-foreground">No change note</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {versionDate}
                    {isCurrent && (
                      <span className="ml-2 font-semibold text-ring">Current</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setExpandedVersion(isExpanded ? null : version.id)}
                  >
                    {isExpanded ? <IconEyeOff size={13} /> : <IconEye size={13} />}
                    {isExpanded ? 'Hide' : 'View'}
                  </Button>
                  {!isCurrent && (
                    <Button variant="outline" size="xs" onClick={() => setRestoreTarget(version)}>
                      <IconArrowBackUp size={13} />
                      Restore
                    </Button>
                  )}
                </div>
              </CardContent>

              {isExpanded && (
                <div className="border-t border-border p-4">
                  {prevVersion ? (
                    <SkillDiff
                      oldContent={prevVersion.content}
                      newContent={version.content}
                      oldLabel={`v${prevVersion.version}`}
                      newLabel={`v${version.version}`}
                    />
                  ) : (
                    <pre className="m-0 overflow-auto whitespace-pre-wrap wrap-break-word rounded-md border border-border bg-muted p-4 font-mono text-xs text-foreground">
                      {version.content}
                    </pre>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <ConfirmDialog
        open={restoreTarget !== null}
        title="Restore version"
        description={
          restoreTarget
            ? `Restore the skill content to version ${restoreTarget.version}? The current content will be replaced.`
            : ''
        }
        confirmLabel="Restore"
        onConfirm={handleRestore}
        onCancel={() => setRestoreTarget(null)}
      />
    </div>
  )
}

'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Link from 'next/link'
import { IconCopy, IconCheck, IconDownload, IconGitFork } from '@tabler/icons-react'
import type { SkillWithRelations } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TargetToolBadge } from './target-tool-badge'
import { PublicPrivateBadge } from './public-private-badge'
import { useCopy } from '@/hooks/use-copy'
import { formatSkillForExport } from '@/lib/services/export.service'

interface SkillDetailViewProps {
  skill: SkillWithRelations
  sidebar: React.ReactNode
  breadcrumb: React.ReactNode
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function SkillDetailView({ skill, sidebar, breadcrumb }: SkillDetailViewProps) {
  const { copy, copied } = useCopy()
  const toolConfig = TARGET_TOOLS[skill.targetTool]
  const exportData = formatSkillForExport(skill)

  const createdDate = new Date(skill.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div>
      {breadcrumb}

      <div className="grid grid-cols-[1fr_320px] items-start gap-6">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Header */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="m-0 text-xl font-semibold text-foreground">{skill.title}</h1>
              <TargetToolBadge tool={skill.targetTool} size="md" />
              <PublicPrivateBadge isPublic={skill.isPublic} />
            </div>

            {/* Author row */}
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-5.5 w-5.5 text-xs">
                <AvatarFallback>{skill.author.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link
                href={`/${skill.author.username}`}
                className="font-semibold text-foreground no-underline hover:underline"
              >
                {skill.author.username}
              </Link>
              <span className="text-muted-foreground/60">·</span>
              <span>v{skill.version}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>{createdDate}</span>
            </div>

            {/* Fork attribution */}
            {skill.forkedFromId && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconGitFork size={13} />
                <span>Forked from another skill</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="m-0 text-sm italic leading-relaxed text-muted-foreground">
            {skill.description}
          </p>

          {/* Content panel */}
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between border-b bg-muted/50">
              <CardTitle className="text-sm">Skill content</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => copy(skill.content)}
                  className={copied ? 'text-green-600' : ''}
                >
                  {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => downloadFile(exportData.content, exportData.filename, exportData.mimeType)}
                >
                  <IconDownload size={13} />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="prose">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {skill.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="sticky top-19 flex flex-col gap-4">
          {sidebar}

          {/* Stats card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">STATS</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {[
                { label: 'Likes', value: skill.likesCount },
                { label: 'Saves', value: skill.savesCount },
                { label: 'Forks', value: skill.forksCount },
                { label: 'Version', value: `v${skill.version}` },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Export info card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
                EXPORT FOR {toolConfig.label.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {toolConfig.exportPath ? (
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                  Drop this file into{' '}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{toolConfig.exportPath}</code>{' '}
                  in your project root
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Copy the content or download the file to use with {toolConfig.label}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => downloadFile(exportData.content, exportData.filename, exportData.mimeType)}
              >
                <IconDownload size={13} />
                Download {exportData.filename}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

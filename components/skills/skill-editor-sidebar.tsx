import { TargetTool } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TargetToolBadge } from './target-tool-badge'
import { PublicPrivateBadge } from './public-private-badge'
import type { CreateSkillInput } from '@/lib/services/skill.service'

interface SkillEditorSidebarProps {
  draft: Partial<CreateSkillInput>
}

export function SkillEditorSidebar({ draft }: SkillEditorSidebarProps) {
  const tool = draft.targetTool ?? TargetTool.CLAUDE
  const toolConfig = TARGET_TOOLS[tool]
  const contentLength = draft.content?.length ?? 0
  const wordCount = draft.content?.split(/\s+/).filter(Boolean).length ?? 0

  return (
    <div className="flex flex-col gap-4">
      {/* Live Preview */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">PREVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className={`flex-1 text-sm font-semibold ${draft.title ? 'text-foreground' : 'text-muted-foreground'}`}>
                {draft.title || 'Untitled skill'}
              </span>
              <TargetToolBadge tool={tool} />
            </div>
            <p className={`mb-3 line-clamp-2 text-xs leading-relaxed ${draft.description ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
              {draft.description || 'No description yet'}
            </p>
            {draft.tags && draft.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {draft.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
                {draft.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{draft.tags.length - 3} more</span>
                )}
              </div>
            )}
            <div className="border-t border-border pt-2">
              <PublicPrivateBadge isPublic={draft.isPublic ?? false} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Path */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">EXPORT PATH</CardTitle>
        </CardHeader>
        <CardContent>
          <code className={`break-all font-mono text-xs ${toolConfig.exportPath ? 'text-foreground' : 'text-muted-foreground'}`}>
            {toolConfig.exportPath ?? 'No standard export path'}
          </code>
        </CardContent>
      </Card>

      {/* Content Stats */}
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">CONTENT</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <div className="text-lg font-semibold leading-tight text-foreground">{contentLength}</div>
            <div className="text-xs text-muted-foreground">characters</div>
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight text-foreground">{wordCount}</div>
            <div className="text-xs text-muted-foreground">words</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

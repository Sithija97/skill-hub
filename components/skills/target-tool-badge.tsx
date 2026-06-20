import { TargetTool } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { Badge } from '@/components/ui/badge'

interface TargetToolBadgeProps {
  tool: TargetTool
  size?: 'sm' | 'md'
}

export function TargetToolBadge({ tool, size = 'sm' }: TargetToolBadgeProps) {
  const config = TARGET_TOOLS[tool]

  return (
    <Badge
      variant="secondary"
      className={`border-transparent bg-(--tool-bg) text-(--tool-text) dark:bg-(--tool-bg-dark) dark:text-(--tool-text-dark) ${size === 'md' ? 'px-2.5 py-0.5 text-xs' : 'px-1.5 py-0 text-xs'}`}
      style={{
        '--tool-bg': config.brandBg,
        '--tool-bg-dark': config.brandBgDark,
        '--tool-text': config.brandText,
        '--tool-text-dark': config.brandTextDark,
      } as React.CSSProperties}
    >
      {config.label}
    </Badge>
  )
}

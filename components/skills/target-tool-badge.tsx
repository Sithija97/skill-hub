'use client'

import { TargetTool } from '@/types/skill'
import { TARGET_TOOLS } from '@/config/tools'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import { useMounted } from '@/hooks/use-mounted'

interface TargetToolBadgeProps {
  tool: TargetTool
  size?: 'sm' | 'md'
}

export function TargetToolBadge({ tool, size = 'sm' }: TargetToolBadgeProps) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  const config = TARGET_TOOLS[tool]
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <Badge
      variant="secondary"
      className={size === 'md' ? 'px-2.5 py-0.5 text-xs' : 'px-1.5 py-0 text-xs'}
      style={{
        backgroundColor: isDark ? config.brandBgDark : config.brandBg,
        color: isDark ? config.brandTextDark : config.brandText,
        borderColor: 'transparent',
      }}
    >
      {config.label}
    </Badge>
  )
}

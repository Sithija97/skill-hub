'use client'

import { useTheme } from 'next-themes'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useMounted } from '@/hooks/use-mounted'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="text-white/70 hover:bg-white/8 hover:text-white"
            aria-label="Toggle theme"
          />
        }
      >
        {mounted && resolvedTheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  )
}

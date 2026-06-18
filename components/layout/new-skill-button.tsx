'use client'

import Link from 'next/link'
import { IconPlus } from '@tabler/icons-react'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function NewSkillButton() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href="/skills/new"
            prefetch={true}
            onMouseEnter={() => import('@uiw/react-md-editor')}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
              'border border-white/20 text-white/70 hover:bg-white/8 hover:text-white'
            )}
          />
        }
      >
        <IconPlus size={14} />
      </TooltipTrigger>
      <TooltipContent>New skill</TooltipContent>
    </Tooltip>
  )
}

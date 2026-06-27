'use client'

import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar, type SidebarProps } from './sidebar'

export function MobileSidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleToggle = useCallback(() => setOpen((prev) => !prev), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden text-white hover:bg-white/10"
        onClick={handleToggle}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={handleClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-55 md:hidden" onClick={handleClose}>
            <Sidebar {...props} />
          </div>
        </>
      )}
    </>
  )
}

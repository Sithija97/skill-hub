'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { IconSearch } from '@tabler/icons-react'

export function TopbarSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSubmit = useCallback((value: string) => {
    const q = value.trim()
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`)
    }
    setOpen(false)
  }, [router])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-7.5 w-full cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-white/8 px-3 text-sm text-white/50"
      >
        <IconSearch size={14} className="shrink-0" />
        <span className="flex-1 text-left">Type / to search</span>
        <kbd className="rounded border border-white/20 px-1.5 text-[10px] leading-4.5 text-white/40">
          /
        </kbd>
      </button>
    )
  }

  return (
    <div className="flex h-7.5 w-full items-center gap-2 rounded-md border border-ring bg-white/12 px-3">
      <IconSearch size={14} className="shrink-0 text-white/70" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search skills, tags, tools..."
        className="flex-1 border-none bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit(e.currentTarget.value)
          if (e.key === 'Escape') setOpen(false)
        }}
        onBlur={() => setOpen(false)}
      />
    </div>
  )
}

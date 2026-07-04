'use client'

import { UserButton as ClerkUserButton } from '@clerk/nextjs'
import { useMounted } from '@/hooks/use-mounted'

export function UserButton() {
  const mounted = useMounted()

  if (!mounted) {
    return <div className="size-7 shrink-0 rounded-full bg-white/10" aria-hidden />
  }

  return <ClerkUserButton />
}

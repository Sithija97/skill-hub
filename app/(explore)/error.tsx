'use client'

import { Button } from '@/components/ui/button'
import { IconAlertTriangle } from '@tabler/icons-react'

export default function ExploreError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <IconAlertTriangle size={40} className="mb-4 text-muted-foreground" />
      <h2 className="mb-1 text-base font-semibold text-foreground">Something went wrong</h2>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Skeleton } from '@/components/ui/skeleton'
import { renderMermaid } from '@/lib/mermaid'

interface MermaidDiagramProps {
  code: string
}

type Status =
  | { kind: 'loading' }
  | { kind: 'ok'; svg: string }
  | { kind: 'error' }

// Collapses bursts of edits (e.g. typing inside a fence in the live editor)
// into a single render instead of re-parsing and re-laying-out the diagram
// on every keystroke.
const RENDER_DEBOUNCE_MS = 300

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme()
  const [status, setStatus] = useState<Status>({ kind: 'loading' })

  useEffect(() => {
    // resolvedTheme is undefined until next-themes resolves on mount — wait
    // rather than render once with the wrong theme and immediately again.
    if (resolvedTheme === undefined) return

    let cancelled = false
    const theme = resolvedTheme === 'dark' ? 'dark' : 'default'

    const timer = setTimeout(() => {
      renderMermaid(code, theme).then(
        (svg) => {
          if (!cancelled) setStatus({ kind: 'ok', svg })
        },
        () => {
          if (!cancelled) setStatus({ kind: 'error' })
        }
      )
    }, RENDER_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [code, resolvedTheme])

  if (status.kind === 'error') {
    return (
      <pre className="m-0 overflow-auto rounded-md border border-border bg-muted p-4 font-mono text-xs text-foreground">
        <code>{code}</code>
      </pre>
    )
  }

  if (status.kind === 'loading') {
    return <Skeleton className="h-40" />
  }

  return (
    <div
      className="flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: status.svg }}
    />
  )
}

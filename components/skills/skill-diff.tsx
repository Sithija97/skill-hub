import { diffLines } from 'diff'

interface SkillDiffProps {
  oldContent: string
  newContent: string
  oldLabel?: string
  newLabel?: string
}

export function SkillDiff({
  oldContent,
  newContent,
  oldLabel = 'Previous',
  newLabel = 'Current',
}: SkillDiffProps) {
  const changes = diffLines(oldContent, newContent)

  return (
    <div className="overflow-hidden rounded-md border border-border font-mono text-xs">
      {/* Header */}
      <div className="flex border-b border-border bg-muted">
        <div className="flex-1 px-3 py-1.5 text-muted-foreground">{oldLabel}</div>
        <div className="flex-1 border-l border-border px-3 py-1.5 text-muted-foreground">{newLabel}</div>
      </div>

      {/* Diff body */}
      <div className="flex">
        {/* Old side */}
        <div className="flex-1 overflow-auto">
          {changes.map((change, i) => {
            if (change.added) return null
            const lines = change.value.replace(/\n$/, '').split('\n')
            return lines.map((line, j) => (
              <div
                key={`old-${i}-${j}`}
                className={`min-h-[1.6em] whitespace-pre-wrap break-all px-3 py-px leading-relaxed ${
                  change.removed
                    ? 'bg-red-50 text-red-800 dark:bg-red-500/15 dark:text-red-400'
                    : 'text-foreground'
                }`}
              >
                {change.removed ? '- ' : '  '}{line}
              </div>
            ))
          })}
        </div>

        {/* Divider */}
        <div className="w-px shrink-0 bg-border" />

        {/* New side */}
        <div className="flex-1 overflow-auto">
          {changes.map((change, i) => {
            if (change.removed) return null
            const lines = change.value.replace(/\n$/, '').split('\n')
            return lines.map((line, j) => (
              <div
                key={`new-${i}-${j}`}
                className={`min-h-[1.6em] whitespace-pre-wrap break-all px-3 py-px leading-relaxed ${
                  change.added
                    ? 'bg-green-50 text-green-800 dark:bg-green-500/15 dark:text-green-400'
                    : 'text-foreground'
                }`}
              >
                {change.added ? '+ ' : '  '}{line}
              </div>
            ))
          })}
        </div>
      </div>
    </div>
  )
}

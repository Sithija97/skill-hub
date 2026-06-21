'use client'

import { IconDownload } from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SkillExportCardProps {
  toolLabel: string
  exportPath: string | null
  exportContent: string
  exportFilename: string
  exportMimeType: string
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function SkillExportCard({ toolLabel, exportPath, exportContent, exportFilename, exportMimeType }: SkillExportCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
          EXPORT FOR {toolLabel.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exportPath ? (
          <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
            Drop this file into{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{exportPath}</code>{' '}
            in your project root
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Copy the content or download the file to use with {toolLabel}
          </p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => downloadFile(exportContent, exportFilename, exportMimeType)}
        >
          <IconDownload size={13} />
          Download {exportFilename}
        </Button>
      </CardContent>
    </Card>
  )
}

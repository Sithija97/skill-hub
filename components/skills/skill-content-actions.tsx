'use client'

import { IconCopy, IconCheck, IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/use-copy'

interface SkillContentActionsProps {
  content: string
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

export function SkillContentActions({ content, exportContent, exportFilename, exportMimeType }: SkillContentActionsProps) {
  const { copy, copied } = useCopy()

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="xs"
        onClick={() => copy(content)}
        className={copied ? 'text-green-600' : ''}
      >
        {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      <Button
        variant="outline"
        size="xs"
        onClick={() => downloadFile(exportContent, exportFilename, exportMimeType)}
      >
        <IconDownload size={13} />
        Export
      </Button>
    </div>
  )
}

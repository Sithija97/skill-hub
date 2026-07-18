'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { Share2, Copy, Check, Mail } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { buttonVariants } from '@/components/ui/button'
import { useCopy } from '@/hooks/use-copy'
import { buildShareLinks } from '@/lib/share'

interface ShareButtonProps {
  url: string
  title: string
}

// Lucide-react ships no brand marks, so these are small local glyphs
// (letter badges in each platform's brand color) rather than reproduced logos.
function BrandBadge({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span
      className="flex size-4 shrink-0 items-center justify-center rounded-[4px] text-[9px] font-bold leading-none text-white"
      style={{ backgroundColor: bg }}
    >
      {children}
    </span>
  )
}

function XIcon() {
  return (
    <BrandBadge bg="#000000">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L21 21M21 3L3 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </BrandBadge>
  )
}

function LinkedInIcon() {
  return <BrandBadge bg="#0A66C2">in</BrandBadge>
}

function TeamsIcon() {
  return <BrandBadge bg="#5059C9">T</BrandBadge>
}

function WhatsAppIcon() {
  return (
    <BrandBadge bg="#25D366">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.86 12.7c-.2.58-1.16 1.11-1.6 1.16-.42.05-.85.2-2.85-.6-2.4-.96-3.94-3.4-4.06-3.56-.12-.16-.97-1.3-.97-2.48 0-1.18.62-1.76.84-2 .2-.23.44-.29.6-.29.15 0 .3 0 .43.01.14.01.32-.05.5.38.2.47.66 1.62.72 1.74.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.03 1.35 1.67.93.83 1.71 1.09 1.95 1.21.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.22.08 1.37.65 1.6.77.24.12.4.18.46.28.06.1.06.58-.14 1.15Z" />
      </svg>
    </BrandBadge>
  )
}

function openShareWindow(href: string) {
  window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600')
}

const subscribeNoop = () => () => {}
const getServerSnapshot = () => false
const getNativeShareSnapshot = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export function ShareButton({ url, title }: ShareButtonProps) {
  const hasNativeShare = useSyncExternalStore(subscribeNoop, getNativeShareSnapshot, getServerSnapshot)
  const { copy, copied } = useCopy()
  const links = useMemo(() => buildShareLinks({ url, title }), [url, title])

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // user dismissed the native share sheet — no-op
    }
  }, [title, url])

  if (hasNativeShare) {
    return (
      <button
        type="button"
        onClick={handleNativeShare}
        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'justify-start gap-2' })}
      >
        <Share2 size={15} />
        Share
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'justify-start gap-2' })}
      >
        <Share2 size={15} />
        Share
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-52">
        <DropdownMenuItem onClick={() => copy(url)}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openShareWindow(links.x)}>
          <XIcon />
          X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(links.linkedin)}>
          <LinkedInIcon />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(links.whatsapp)}>
          <WhatsAppIcon />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(links.teams)}>
          <TeamsIcon />
          MS Teams
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = links.email }}>
          <Mail size={15} />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="currentColor" className="text-foreground"/>
          <path d="M21 8L12 19.5H17.5L15 28L24 16H18.5L21 8Z" fill="currentColor" className="text-background"/>
        </svg>
        <span className="text-base font-semibold text-foreground">SkillHub</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/explore"
          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
        >
          Explore
        </Link>
        <Link
          href="/sign-in"
          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          Sign up
        </Link>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { UserButton } from './user-button'
import { ThemeToggle } from './theme-toggle'
import { NewSkillButton } from './new-skill-button'
import { TopbarSearch } from './topbar-search'

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-4 bg-(--color-bg-header) px-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2 text-white no-underline">
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="white"/>
          <path d="M21 8L12 19.5H17.5L15 28L24 16H18.5L21 8Z" fill="#24292f"/>
        </svg>
        <span className="hidden text-sm font-semibold text-white sm:inline">SkillHub</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-0.5">
        <Link
          href="/dashboard"
          className="rounded-md px-2 py-1 text-sm font-semibold text-white/70 transition-colors hover:bg-white/8 hover:text-white"
        >
          Dashboard
        </Link>
        <Link
          href="/explore"
          className="rounded-md px-2 py-1 text-sm font-semibold text-white/70 transition-colors hover:bg-white/8 hover:text-white"
        >
          Explore
        </Link>
      </nav>

      {/* Search */}
      <div className="max-w-135 flex-1">
        <TopbarSearch />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <NewSkillButton />

        <UserButton />
      </div>
    </header>
  )
}

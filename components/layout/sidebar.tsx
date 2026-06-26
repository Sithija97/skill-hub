'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  Folder,
  Globe,
  Lock,
  GitFork,
  User,
  Settings,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SidebarItem {
  label: string
  href: string
  icon: ComponentType<{ size?: number; className?: string }>
  badge?: number
  matchExact?: boolean
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

export interface SidebarProps {
  username?: string
  counts?: {
    saved: number
    public: number
    private: number
    forked: number
    collections: number
  }
}

export function Sidebar({ username, counts }: SidebarProps) {
  const pathname = usePathname()

  const sections: SidebarSection[] = [
    {
      title: 'MENU',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, matchExact: true },
        { label: 'Explore', href: '/', icon: Compass },
        { label: 'Saved', href: '/saves', icon: Bookmark, badge: counts?.saved },
        { label: 'Collections', href: '/collections', icon: Folder, badge: counts?.collections },
      ],
    },
    {
      title: 'MY SKILLS',
      items: [
        { label: 'Public', href: '/dashboard?filter=public', icon: Globe, badge: counts?.public },
        { label: 'Private', href: '/dashboard?filter=private', icon: Lock, badge: counts?.private },
        { label: 'Forked', href: '/dashboard?filter=forked', icon: GitFork, badge: counts?.forked },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', href: username ? `/${username}` : '/settings', icon: User },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside className="flex h-full w-55 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-background py-3">
      {sections.map((section, idx) => (
        <div key={section.title}>
          {idx > 0 && <Separator className="mx-4 my-2" />}
          <div className="mb-1 px-4 text-xs font-semibold tracking-wide text-muted-foreground">
            {section.title}
          </div>
          <nav className="flex flex-col gap-px">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href, item.matchExact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mx-2 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm no-underline transition-colors',
                    active
                      ? 'border-l-2 border-l-ring bg-muted font-semibold text-foreground rounded-l-none ml-2'
                      : 'border-l-2 border-l-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon size={16} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 text-xs font-medium">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
    </aside>
  )
}

function isActive(pathname: string, href: string, matchExact?: boolean): boolean {
  const basePath = href.split('?')[0]
  if (matchExact) return pathname === basePath
  return pathname === basePath || pathname.startsWith(basePath + '/')
}

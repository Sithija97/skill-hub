import type { ReactNode, ComponentType } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface EmptyStateProps {
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  action?: { label: string; href: string }
  children?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 text-muted-foreground">
        <Icon size={40} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="max-w-90 text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Link href={action.href} className={buttonVariants({ className: 'mt-6' })}>
          {action.label}
        </Link>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}

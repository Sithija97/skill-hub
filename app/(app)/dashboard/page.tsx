import Link from 'next/link'
import {
  FileText,
  Heart,
  GitFork,
  Users,
} from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { getSkillsByUser } from '@/lib/services/skill.service'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { DashboardFilters } from './dashboard-filters'

export default async function DashboardPage() {
  const { userId } = await requireAuth()
  const skills = await getSkillsByUser(userId)

  const totalLikes = skills.reduce((sum, s) => sum + s.likesCount, 0)
  const totalForks = skills.reduce((sum, s) => sum + s.forksCount, 0)

  const statCards = [
    { label: 'Total skills', value: skills.length, icon: FileText },
    { label: 'Total likes', value: totalLikes, icon: Heart },
    { label: 'Total forks', value: totalForks, icon: GitFork },
    { label: 'Followers', value: 0, icon: Users },
  ]

  return (
    <div>
      {/* Header — server-rendered */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage and track your skills</p>
        </div>
        <Link href="/skills/new" className={buttonVariants()}>New skill</Link>
      </div>

      {/* Stats — server-rendered */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <stat.icon size={20} className="shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xl font-semibold leading-tight text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + grid — client-rendered for interactivity */}
      <DashboardFilters skills={skills} />
    </div>
  )
}

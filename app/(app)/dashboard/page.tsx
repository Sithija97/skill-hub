import { requireAuth } from '@/lib/auth'
import { getSkillsByUser } from '@/lib/services/skill.service'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const { userId } = await requireAuth()
  const skills = await getSkillsByUser(userId)

  const totalLikes = skills.reduce((sum, s) => sum + s.likesCount, 0)
  const totalForks = skills.reduce((sum, s) => sum + s.forksCount, 0)

  return (
    <DashboardClient
      skills={skills}
      stats={{
        totalSkills: skills.length,
        totalLikes,
        totalForks,
        followers: 91,
      }}
    />
  )
}

import { IconBookmark } from '@tabler/icons-react'
import { requireAuth } from '@/lib/auth'
import { getSavedSkillsByUser } from '@/lib/services/skill.service'
import { SkillCard } from '@/components/skills/skill-card'
import { EmptyState } from '@/components/shared/empty-state'

export default async function SavesPage() {
  const { userId } = await requireAuth()
  const skills = await getSavedSkillsByUser(userId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Saved skills</h1>
        <p className="text-sm text-muted-foreground">Skills you&apos;ve bookmarked for later</p>
      </div>

      {skills.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} showAuthor />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={IconBookmark}
          title="No saved skills yet"
          description="Skills you save will appear here"
          action={{ label: 'Explore skills', href: '/explore' }}
        />
      )}
    </div>
  )
}

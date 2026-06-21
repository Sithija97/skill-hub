import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { IconSearch } from '@tabler/icons-react'
import { getCurrentUser } from '@/lib/auth'
import { getUserProfile } from '@/lib/services/user.service'
import { getSkillsByUser } from '@/lib/services/skill.service'
import { getCollections } from '@/lib/services/collection.service'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SkillCard } from '@/components/skills/skill-card'
import { CollectionCard } from '@/components/collections/collection-card'
import { EmptyState } from '@/components/shared/empty-state'
import { ClientTabs } from '@/components/shared/client-tabs'

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getUserProfile(username)
  if (!profile) return { title: 'User not found — SkillHub' }

  return {
    title: `${profile.displayName} (@${profile.username}) — SkillHub`,
    description: profile.bio ?? `${profile.displayName}'s skills on SkillHub`,
    openGraph: {
      title: `${profile.displayName} — SkillHub`,
      description: profile.bio ?? `${profile.displayName}'s skills on SkillHub`,
      type: 'profile',
      username: profile.username,
    },
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await getUserProfile(username)
  if (!profile) redirect('/explore')

  const [allSkills, collectionsResponse] = await Promise.all([
    getSkillsByUser(profile.id),
    getCollections(profile.id),
  ])

  const skills = allSkills.filter((s) => s.isPublic)
  const collections = collectionsResponse.data.filter((c) => c.isPublic)

  const session = await getCurrentUser()
  const isOwnProfile = session?.userId !== null && session?.userId !== undefined && profile.id === session.userId

  const totalLikes = skills.reduce((sum, s) => sum + s.likesCount, 0)
  const totalForks = skills.reduce((sum, s) => sum + s.forksCount, 0)

  const skillsGrid = skills.length > 0 ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  ) : (
    <EmptyState
      icon={IconSearch}
      title="No public skills"
      description={`${profile.displayName} hasn't published any public skills yet.`}
    />
  )

  const collectionsGrid = collections.length > 0 ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      {collections.map((col) => (
        <CollectionCard key={col.id} collection={col} showFollowButton={!isOwnProfile} />
      ))}
    </div>
  ) : (
    <EmptyState
      icon={IconSearch}
      title="No public collections"
      description={`${profile.displayName} hasn't created any public collections yet.`}
    />
  )

  return (
    <div className="mx-auto max-w-4xl">
      {/* Profile header — server-rendered */}
      <div className="mb-8 flex items-start gap-5 pt-4">
        <Avatar className="h-18 w-18 text-2xl">
          <AvatarFallback>{profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-3">
            <h1 className="m-0 text-xl font-semibold text-foreground">{profile.displayName}</h1>
            {isOwnProfile && (
              <Link href="/settings" className={buttonVariants({ variant: 'outline', size: 'xs' })}>
                Edit profile
              </Link>
            )}
          </div>

          <p className="mb-2 text-sm text-muted-foreground">@{profile.username}</p>

          {profile.bio && (
            <p className="mb-3 text-sm leading-relaxed text-foreground">{profile.bio}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="font-semibold text-foreground">{skills.length}</strong> skills
            </span>
            <span>
              <strong className="font-semibold text-foreground">{totalLikes}</strong> total likes
            </span>
            <span>
              <strong className="font-semibold text-foreground">{totalForks}</strong> forks received
            </span>
          </div>
        </div>
      </div>

      {/* Tabs — client component wrapping server-rendered content */}
      <ClientTabs
        defaultValue="skills"
        tabs={[
          {
            value: 'skills',
            label: <>Skills <Badge variant="secondary" className="px-1.5 text-xs">{skills.length}</Badge></>,
            content: skillsGrid,
          },
          {
            value: 'collections',
            label: <>Collections <Badge variant="secondary" className="px-1.5 text-xs">{collections.length}</Badge></>,
            content: collectionsGrid,
          },
        ]}
        separator={<Separator className="mb-5" />}
      />
    </div>
  )
}

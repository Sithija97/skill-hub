import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserProfile } from '@/lib/services/user.service'
import { getSkillsByUser } from '@/lib/services/skill.service'
import { getCollections } from '@/lib/services/collection.service'
import { ProfileClient } from './profile-client'

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

  return (
    <ProfileClient
      profile={profile}
      skills={skills}
      collections={collections}
      currentUserId={session?.userId ?? null}
    />
  )
}

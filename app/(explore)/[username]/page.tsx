import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/services/user.service'
import { getSkillsByUser } from '@/lib/services/skill.service'
import { getCollections } from '@/lib/services/collection.service'
import { ProfileClient } from './profile-client'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const profile = await getUserProfile(username)
  if (!profile) redirect('/explore')

  const [allSkills, collectionsResponse] = await Promise.all([
    getSkillsByUser(profile.id),
    getCollections(profile.id),
  ])

  const skills = allSkills.filter((s) => s.isPublic)
  const collections = collectionsResponse.data.filter((c) => c.isPublic)

  return (
    <ProfileClient
      profile={profile}
      skills={skills}
      collections={collections}
    />
  )
}

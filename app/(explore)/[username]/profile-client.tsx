'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { IconSearch } from '@tabler/icons-react'
import type { UserProfile } from '@/types/user'
import type { SkillWithRelations } from '@/types/skill'
import type { CollectionWithSkills } from '@/types/collection'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SkillCard } from '@/components/skills/skill-card'
import { CollectionCard } from '@/components/collections/collection-card'
import { EmptyState } from '@/components/shared/empty-state'

interface ProfileClientProps {
  profile: UserProfile
  skills: SkillWithRelations[]
  collections: CollectionWithSkills[]
}

export function ProfileClient({ profile, skills, collections }: ProfileClientProps) {
  const isOwnProfile = profile.id === 'user_mock_current'

  const totalLikes = useMemo(
    () => skills.reduce((sum, s) => sum + s.likesCount, 0),
    [skills]
  )
  const totalForks = useMemo(
    () => skills.reduce((sum, s) => sum + s.forksCount, 0),
    [skills]
  )

  return (
    <div className="mx-auto max-w-4xl">
      {/* Profile header */}
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

      {/* Tabs */}
      <Tabs defaultValue="skills">
        <TabsList variant="line">
          <TabsTrigger value="skills" className="gap-2">
            Skills
            <Badge variant="secondary" className="px-1.5 text-xs">{skills.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-2">
            Collections
            <Badge variant="secondary" className="px-1.5 text-xs">{collections.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <Separator className="mb-5" />

        <TabsContent value="skills">
          {skills.length > 0 ? (
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
          )}
        </TabsContent>

        <TabsContent value="collections">
          {collections.length > 0 ? (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

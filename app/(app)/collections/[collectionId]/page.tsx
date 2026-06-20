import { redirect } from 'next/navigation'
import Link from 'next/link'
import { IconFolder, IconTrash, IconPencil, IconSearch } from '@tabler/icons-react'
import { requireAuth } from '@/lib/auth'
import { getCollectionById } from '@/lib/services/collection.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { SkillCard } from '@/components/skills/skill-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PublicPrivateBadge } from '@/components/skills/public-private-badge'
import { CollectionActions } from './collection-actions'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ collectionId: string }>
}) {
  const { userId } = await requireAuth()
  const { collectionId } = await params
  const collection = await getCollectionById(collectionId)
  if (!collection) redirect('/dashboard')

  const isOwner = collection.authorId === userId

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: collection.name },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <IconFolder size={20} className="text-muted-foreground" />
            <h1 className="text-xl font-semibold text-foreground">{collection.name}</h1>
            <PublicPrivateBadge isPublic={collection.isPublic} />
          </div>
          {collection.description && (
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {collection.skills.length} {collection.skills.length === 1 ? 'skill' : 'skills'}
          </p>
        </div>

        {isOwner && <CollectionActions collectionId={collection.id} collectionName={collection.name} />}
      </div>

      {collection.skills.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {collection.skills.map((skill) => (
            <Card key={skill.id} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col gap-1">
                <Link href={`/skills/${skill.id}`} className="text-sm font-semibold text-foreground hover:underline">
                  {skill.title}
                </Link>
                <p className="line-clamp-2 text-xs text-muted-foreground">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={IconSearch}
          title="No skills in this collection"
          description="Add skills to this collection from skill detail pages."
        />
      )}
    </div>
  )
}

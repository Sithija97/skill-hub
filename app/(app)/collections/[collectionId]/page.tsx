import { redirect } from 'next/navigation'
import { Folder, Search } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { getCollectionById } from '@/lib/services/collection.service'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { CollectionSkillItem } from '@/components/collections/collection-skill-item'
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
            <Folder size={20} className="text-muted-foreground" />
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
            <CollectionSkillItem
              key={skill.id}
              skill={skill}
              collectionId={collection.id}
              isOwner={isOwner}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No skills in this collection"
          description="Add skills to this collection from skill detail pages."
        />
      )}
    </div>
  )
}

import Link from 'next/link'
import { Folder } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { getCollections } from '@/lib/services/collection.service'
import { CollectionCard } from '@/components/collections/collection-card'
import { EmptyState } from '@/components/shared/empty-state'
import { buttonVariants } from '@/components/ui/button'

export default async function CollectionsPage() {
  const { userId } = await requireAuth()
  const { data: collections } = await getCollections(userId)

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Collections</h1>
          <p className="text-sm text-muted-foreground">Organize your skills into curated groups</p>
        </div>
        <Link href="/collections/new" className={buttonVariants()}>New collection</Link>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Folder}
          title="No collections yet"
          description="Create a collection to organize your skills into groups."
          action={{ label: 'New collection', href: '/collections/new' }}
        />
      )}
    </div>
  )
}

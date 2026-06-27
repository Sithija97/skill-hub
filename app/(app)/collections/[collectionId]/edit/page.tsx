import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getCollectionById } from '@/lib/services/collection.service'
import { Breadcrumb } from '@/components/shared/breadcrumb'
import { EditCollectionForm } from './edit-collection-form'

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>
}) {
  const { userId } = await requireAuth()
  const { collectionId } = await params
  const collection = await getCollectionById(collectionId)

  if (!collection || collection.authorId !== userId) redirect('/dashboard')

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: collection.name, href: `/collections/${collection.id}` },
          { label: 'Edit' },
        ]}
      />
      <h1 className="mb-6 text-xl font-semibold text-foreground">Edit collection</h1>
      <EditCollectionForm collection={collection} />
    </div>
  )
}

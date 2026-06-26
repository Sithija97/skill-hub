import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getCollectionById } from '@/lib/services/collection.service'
import { EditCollectionClient } from './edit-collection-client'

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>
}) {
  const { userId } = await requireAuth()
  const { collectionId } = await params
  const collection = await getCollectionById(collectionId)

  if (!collection || collection.authorId !== userId) redirect('/dashboard')

  return <EditCollectionClient collection={collection} />
}

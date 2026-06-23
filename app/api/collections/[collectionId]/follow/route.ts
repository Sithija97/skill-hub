import { requireAuthApi } from '@/lib/auth'
import { followCollection, unfollowCollection } from '@/lib/services/collection.service'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    const { collectionId } = await params
    await followCollection(collectionId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections/follow]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const userId = await requireAuthApi()
    const { collectionId } = await params
    await unfollowCollection(collectionId, userId)
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections/follow]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

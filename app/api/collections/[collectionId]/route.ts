import { requireAuthApi } from '@/lib/auth'
import {
  getCollectionById,
  updateCollection,
  deleteCollection,
} from '@/lib/services/collection.service'
import { updateCollectionSchema } from '@/lib/validations/collection'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { collectionId } = await params
    const collection = await getCollectionById(collectionId)
    if (!collection) return Response.json({ error: 'Collection not found' }, { status: 404 })
    return Response.json(collection)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections/collectionId]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    await requireAuthApi()
    const { collectionId } = await params
    const body = await req.json()
    const parsed = updateCollectionSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }
    const collection = await updateCollection(collectionId, parsed.data)
    return Response.json(collection)
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Collection not found' }, { status: 404 })
    }
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('[API collections/collectionId]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    await requireAuthApi()
    const { collectionId } = await params
    await deleteCollection(collectionId)
    return new Response(null, { status: 204 })
  } catch (err) {
    if (err instanceof Response) return err
    if (err instanceof Error && err.message.includes('not found')) {
      return Response.json({ error: 'Collection not found' }, { status: 404 })
    }
    if (err instanceof Error && err.message.includes('Not authorized')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('[API collections/collectionId]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

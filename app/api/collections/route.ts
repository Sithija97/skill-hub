import { requireAuthApi } from '@/lib/auth'
import { getCollections, createCollection } from '@/lib/services/collection.service'
import { createCollectionSchema } from '@/lib/validations/collection'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') ?? undefined
    const result = await getCollections(userId)
    return Response.json(result)
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireAuthApi()
    const body = await req.json()
    const parsed = createCollectionSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }
    void userId
    const collection = await createCollection(parsed.data)
    return Response.json(collection, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

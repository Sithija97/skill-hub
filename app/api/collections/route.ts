import { requireAuthApi } from '@/lib/auth'
import { getCollections, createCollection } from '@/lib/services/collection.service'
import { createCollectionSchema } from '@/lib/validations/collection'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') ?? undefined
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20', 10), 50)
    const result = await getCollections(userId, { page, pageSize })
    return Response.json(result)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireAuthApi()
    if (!rateLimit(`create-collection:${userId}`, 10, 60_000)) return rateLimitResponse()
    const body = await req.json()
    const parsed = createCollectionSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
    }
    const collection = await createCollection(parsed.data)
    return Response.json(collection, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API collections]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

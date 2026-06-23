import { getTags } from '@/lib/services/tag.service'

export async function GET() {
  try {
    const tags = await getTags()
    return Response.json(tags)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[API tags]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

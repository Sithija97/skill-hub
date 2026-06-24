import { db } from '@/lib/db'

export async function GET() {
  try {
    await db.user.findFirst({ select: { id: true } })
    return Response.json({ status: 'ok' })
  } catch (err) {
    console.error('[health]', err)
    return Response.json({ status: 'error', message: 'Database unreachable' }, { status: 503 })
  }
}

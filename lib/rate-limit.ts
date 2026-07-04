// In-process store: correct only on a single instance. If this app ever moves to
// multi-instance/serverless hosting, each instance gets its own counter and limits
// stop being globally enforced — swap for a shared store (Redis/Postgres) at that point.
const store = new Map<string, { count: number; resetAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000)

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

export function rateLimitResponse() {
  return Response.json(
    { error: 'Too many requests' },
    { status: 429, headers: { 'Retry-After': '60' } }
  )
}

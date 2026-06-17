import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: [], total: 0, page: 1, pageSize: 20, hasMore: false })
}

export async function POST() {
  return NextResponse.json({ data: null, error: 'Not implemented' }, { status: 501 })
}

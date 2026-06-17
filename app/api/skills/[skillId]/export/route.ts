import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: null, error: 'Not implemented' }, { status: 501 })
}

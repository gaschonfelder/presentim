import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Rota descontinuada' }, { status: 410 })
}
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Card issuance is not offered.' },
    { status: 410 }
  )
}

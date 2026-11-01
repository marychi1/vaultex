import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Crypto purchases and onramps are not offered.' },
    { status: 410 }
  )
}

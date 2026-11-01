import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Card processing is not offered by VAULTEX.' },
    { status: 410 }
  )
}

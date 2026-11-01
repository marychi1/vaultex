import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Card management is not offered.' },
    { status: 410 }
  )
}

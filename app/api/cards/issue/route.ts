import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Card issuance is unavailable until identity verification, card-program approval, and user ownership controls are implemented.',
    },
    { status: 503 }
  )
}

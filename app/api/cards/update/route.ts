import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Card management is unavailable until authenticated card ownership and the required program controls are implemented.',
    },
    { status: 503 }
  )
}

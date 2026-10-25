import { NextRequest, NextResponse } from 'next/server'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const GA_API_SECRET     = process.env.GA_API_SECRET     ?? ''

export async function POST(req: NextRequest) {
  try {
    const { name, params, clientId } = await req.json()
    if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
      return NextResponse.json({ skipped: true })
    }
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId ?? 'anonymous', events: [{ name, params }] }),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Analytics request failed' }, { status: 500 })
  }
}

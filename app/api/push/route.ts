import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, subscription, action } = await req.json()
    if (!walletAddress || !subscription) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const db = adminDb
    if (!db) return NextResponse.json({ skipped: true, reason: 'Supabase not configured' })
    if (action === 'unsubscribe') {
      await db.from('push_subscriptions').delete().eq('wallet_address', walletAddress.toLowerCase())
    } else {
      await db.from('push_subscriptions').upsert({ wallet_address: walletAddress.toLowerCase(), subscription: JSON.stringify(subscription), updated_at: new Date().toISOString() }, { onConflict: 'wallet_address' })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

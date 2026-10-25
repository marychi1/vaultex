import { NextRequest, NextResponse } from 'next/server'
import { getSessionClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let supabase
  try {
    supabase = await getSessionClient()
  } catch {
    return NextResponse.json(
      { error: 'Supabase authentication is not configured' },
      { status: 503 }
    )
  }

  const { data, error: authError } = await supabase.auth.getUser()
  if (authError) {
    console.error('Push subscription authentication failed:', authError.message)
    return NextResponse.json(
      { error: 'Unable to verify authentication' },
      { status: 503 }
    )
  }
  if (!data.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const action = payload?.action ?? 'subscribe'
  if (action !== 'subscribe' && action !== 'unsubscribe') {
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  }

  let query
  if (action === 'unsubscribe') {
    query = supabase
      .from('push_subscriptions')
      .delete()
      .eq('owner_user_id', data.user.id)
  } else {
    if (
      !payload.subscription ||
      typeof payload.subscription !== 'object' ||
      Array.isArray(payload.subscription)
    ) {
      return NextResponse.json(
        { error: 'A valid push subscription is required' },
        { status: 400 }
      )
    }

    query = supabase.from('push_subscriptions').upsert(
      {
        owner_user_id: data.user.id,
        subscription: JSON.stringify(payload.subscription),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_user_id' }
    )
  }

  const { error: dbError } = await query
  if (dbError) {
    console.error('Push subscription update failed:', dbError.message)
    return NextResponse.json(
      { error: 'Unable to update push subscription' },
      { status: 503 }
    )
  }

  return NextResponse.json({ success: true })
}

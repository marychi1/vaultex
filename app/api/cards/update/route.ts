import { NextRequest, NextResponse } from 'next/server'
import { updateCardStatus, updateSpendingLimit } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { cardId, action, value } = await req.json()
    if (!cardId || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (action === 'freeze')   await updateCardStatus(cardId, 'inactive')
    if (action === 'unfreeze') await updateCardStatus(cardId, 'active')
    if (action === 'limit')    await updateSpendingLimit(cardId, value)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Card update failed' }, { status: 500 })
  }
}

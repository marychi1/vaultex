import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { saveTransaction } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''
  let event
  try {
    event = webhookSecret ? stripe.webhooks.constructEvent(body, sig, webhookSecret) : JSON.parse(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload'
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }
  switch (event.type) {
    case 'issuing_transaction.created': {
      const tx = event.data.object
      await saveTransaction({ user_id: tx.cardholder ?? 'unknown', type: 'card_spend', from_token: 'USDC', to_token: null, from_amount: Math.abs(tx.amount)/100, to_amount: null, usd_value: Math.abs(tx.amount)/100, tx_hash: tx.id, status: 'confirmed', chain: 'stripe', fee_usd: 0 })
      break
    }
    case 'issuing_authorization.request':
      return NextResponse.json({ approved: true })
  }
  return NextResponse.json({ received: true })
}

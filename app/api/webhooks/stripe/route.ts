import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getUserIdForStripeCardholder, saveTransaction } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured' },
      { status: 503 }
    )
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    )
  }

  const body = await req.text()
  let event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json(
      { error: 'Invalid Stripe webhook signature or payload' },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'issuing_transaction.created': {
      const tx = event.data.object
      const cardholderId =
        typeof tx.cardholder === 'string' ? tx.cardholder : tx.cardholder?.id
      if (!cardholderId) {
        return NextResponse.json(
          { error: 'Stripe transaction is missing its cardholder' },
          { status: 503 }
        )
      }

      let userId: string | null
      try {
        userId = await getUserIdForStripeCardholder(cardholderId)
      } catch (error) {
        console.error('Stripe cardholder lookup failed:', error)
        return NextResponse.json(
          { error: 'Unable to resolve Stripe transaction owner' },
          { status: 503 }
        )
      }
      if (!userId) {
        return NextResponse.json(
          { error: 'Stripe transaction cardholder is not linked to a VAULTEX user' },
          { status: 503 }
        )
      }

      try {
        await saveTransaction({
          user_id: userId,
          type: 'card_spend',
          from_token: 'USDC',
          to_token: null,
          from_amount: Math.abs(tx.amount) / 100,
          to_amount: null,
          usd_value: Math.abs(tx.amount) / 100,
          tx_hash: tx.id,
          status: 'confirmed',
          chain: 'stripe',
          fee_usd: 0,
        })
      } catch (error) {
        console.error('Stripe transaction persistence failed:', error)
        return NextResponse.json(
          { error: 'Unable to persist Stripe transaction event' },
          { status: 503 }
        )
      }
      break
    }
    case 'issuing_authorization.request':
      // No verified authorization policy is implemented, so fail closed.
      return NextResponse.json({ approved: false })
  }
  return NextResponse.json({ received: true })
}

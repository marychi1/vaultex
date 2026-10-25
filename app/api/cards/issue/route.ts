import { NextRequest, NextResponse } from 'next/server'
import { createCardholder, issueVirtualCard } from '@/lib/stripe'
import { saveIssuedCard } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { walletAddress, firstName, lastName, email, phone, line1, city, state, postalCode, country, dailyLimit } = body

    if (!walletAddress || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return NextResponse.json({
        success: true, demo: true,
        card: { id:'demo_card_'+Date.now(), last4:'7312', expiry_month:9, expiry_year:2028, network:'visa', status:'active' },
      })
    }

    const cardholder = await createCardholder({ walletAddress, firstName, lastName, email, phone: phone??'', line1: line1??'', city: city??'', state: state??'NY', postalCode: postalCode??'10001', country: country??'US' })
    const card       = await issueVirtualCard(cardholder.id, dailyLimit ?? 2500)

    await saveIssuedCard({
      wallet_address: walletAddress.toLowerCase(),
      stripe_cardholder_id: cardholder.id,
      stripe_card_id: card.id,
      last4: card.last4,
      expiry_month: card.exp_month,
      expiry_year: card.exp_year,
      network: 'visa',
      daily_limit: dailyLimit ?? 2500,
      spent_today: 0,
      status: 'active',
      online_enabled: true,
      intl_enabled: false,
    })

    return NextResponse.json({ success: true, card: { id: card.id, last4: card.last4, expiry_month: card.exp_month, expiry_year: card.exp_year, network: 'visa', status: 'active' } })
  } catch (error) {
    console.error('issue card:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Card issuance failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const MOONPAY_KEY    = process.env.MOONPAY_API_KEY    ?? ''
const MOONPAY_SECRET = process.env.MOONPAY_SECRET_KEY ?? ''

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, currencyCode, baseCurrencyCode, baseCurrencyAmount } = await req.json()
    const params = new URLSearchParams({
      apiKey:             MOONPAY_KEY || 'pk_test_placeholder',
      currencyCode:       currencyCode       ?? 'eth',
      baseCurrencyCode:   baseCurrencyCode   ?? 'usd',
      baseCurrencyAmount: String(baseCurrencyAmount ?? 100),
      walletAddress:      walletAddress      ?? '',
      colorCode:          '#00F0FF',
      theme:              'dark',
    })
    const base = `https://buy.moonpay.com?${params.toString()}`
    if (MOONPAY_SECRET) {
      const sig = crypto.createHmac('sha256', MOONPAY_SECRET).update(new URL(base).search).digest('base64')
      return NextResponse.json({ url: `${base}&signature=${encodeURIComponent(sig)}` })
    }
    return NextResponse.json({ url: base })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Onramp request failed' }, { status: 500 })
  }
}

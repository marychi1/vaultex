import 'server-only'

import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const adminDb  = url && svc  ? createClient(url, svc)  : null

export interface Transaction {
  id: string
  user_id: string
  type: 'swap'|'send'|'receive'|'earn'|'card_spend'
  from_token: string
  to_token: string|null
  from_amount: number
  to_amount: number|null
  usd_value: number
  tx_hash: string|null
  status: 'pending'|'confirmed'|'failed'
  created_at: string
  chain: string
  fee_usd: number
}

export interface IssuedCard {
  id: string
  owner_user_id: string
  wallet_address: string
  stripe_cardholder_id: string
  stripe_card_id: string
  last4: string
  expiry_month: number
  expiry_year: number
  network: string
  daily_limit: number
  spent_today: number
  status: 'active'|'frozen'|'cancelled'
  online_enabled: boolean
  intl_enabled: boolean
  created_at: string
}

export async function saveTransaction(tx: Omit<Transaction,'id'|'created_at'>) {
  if (!adminDb) {
    throw new Error('Supabase writes require SUPABASE_SERVICE_ROLE_KEY.')
  }
  const { data, error } = await adminDb.from('transactions').insert(tx).select().single()
  if (error) throw new Error(`saveTransaction failed: ${error.message}`)
  return data
}

export async function saveIssuedCard(card: Omit<IssuedCard,'id'|'created_at'>) {
  if (!adminDb) {
    throw new Error('Saving issued cards requires SUPABASE_SERVICE_ROLE_KEY.')
  }
  const { data, error } = await adminDb.from('issued_cards').insert(card).select().single()
  if (error) throw new Error(`saveIssuedCard failed: ${error.message}`)
  return data
}

export async function getUserIdForStripeCardholder(cardholderId: string) {
  if (!adminDb) {
    throw new Error('Resolving Stripe cardholders requires SUPABASE_SERVICE_ROLE_KEY.')
  }
  const { data, error } = await adminDb
    .from('issued_cards')
    .select('owner_user_id')
    .eq('stripe_cardholder_id', cardholderId)
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(`Cardholder lookup failed: ${error.message}`)
  return data?.owner_user_id ?? null
}

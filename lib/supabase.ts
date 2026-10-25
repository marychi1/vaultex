import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const supabase = url && anon ? createClient(url, anon) : null
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

export async function upsertWalletUser(walletAddress: string) {
  const db = adminDb ?? supabase
  if (!db) return null
  const { data, error } = await db
    .from('users')
    .upsert({ wallet_address: walletAddress.toLowerCase() }, { onConflict: 'wallet_address' })
    .select().single()
  if (error) console.error('upsertWalletUser:', error)
  return data
}

export async function saveTransaction(tx: Omit<Transaction,'id'|'created_at'>) {
  if (!supabase) return null
  const { data, error } = await supabase.from('transactions').insert(tx).select().single()
  if (error) console.error('saveTransaction:', error)
  return data
}

export async function getUserTransactions(userId: string, limit = 50) {
  if (!supabase) return []
  const { data } = await supabase
    .from('transactions').select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function saveIssuedCard(card: Omit<IssuedCard,'id'|'created_at'>) {
  const db = adminDb ?? supabase
  if (!db) return null
  const { data, error } = await db.from('issued_cards').insert(card).select().single()
  if (error) console.error('saveIssuedCard:', error)
  return data
}

export async function getIssuedCards(walletAddress: string) {
  if (!supabase) return []
  const { data } = await supabase
    .from('issued_cards').select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('created_at', { ascending: false })
  return data ?? []
}

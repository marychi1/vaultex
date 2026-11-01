import 'server-only'

import { getSessionClient } from '@/lib/supabase/server'

export interface CustomerTransaction {
  reference: string
  type: 'swap'|'send'|'receive'|'earn'|'card_spend'
  from_token: string|null
  to_token: string|null
  from_amount: number|null
  to_amount: number|null
  usd_value: number|null
  merchant_name: string|null
  status: 'pending'|'confirmed'|'failed'
  created_at: string|null
  chain: string|null
  fee_usd: number|null
}

type RawTransaction = Omit<
  CustomerTransaction,
  'from_amount'|'to_amount'|'usd_value'|'fee_usd'
> & {
  from_amount: number|string|null
  to_amount: number|string|null
  usd_value: number|string|null
  fee_usd: number|string|null
}

function parseAmount(value: number|string|null): number|null {
  if (value === null) return null
  const amount = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(amount) ? amount : null
}

function normalizeTransaction(row: RawTransaction): CustomerTransaction {
  return {
    ...row,
    from_amount: parseAmount(row.from_amount),
    to_amount: parseAmount(row.to_amount),
    usd_value: parseAmount(row.usd_value),
    fee_usd: parseAmount(row.fee_usd),
  }
}

const transactionFields =
  'reference,type,from_token,to_token,from_amount,to_amount,usd_value,merchant_name,status,created_at,chain,fee_usd'

export async function listTransactionsForUser(userId: string) {
  const supabase = await getSessionClient()
  const { data, error } = await supabase
    .from('transactions')
    .select(transactionFields)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(25)

  if (error) {
    console.error('Unable to load customer transaction history:', error)
    return { ok: false as const }
  }

  return {
    ok: true as const,
    transactions: (data ?? []).map((row) =>
      normalizeTransaction(row)
    ),
  }
}

export async function getTransactionForUser(reference: string, userId: string) {
  const supabase = await getSessionClient()
  const { data, error } = await supabase
    .from('transactions')
    .select(transactionFields)
    .eq('reference', reference)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Unable to load customer transaction receipt:', error)
    return { ok: false as const }
  }
  if (!data) return { ok: true as const, transaction: null }

  return {
    ok: true as const,
    transaction: normalizeTransaction(data),
  }
}

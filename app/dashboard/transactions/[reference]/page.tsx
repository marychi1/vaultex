import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getTransactionForUser } from '@/lib/transaction-receipts'
import { getSessionClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function formatAmount(amount: number|null, currency: string|null) {
  if (amount === null) return 'Unavailable'
  if (!currency) return amount.toLocaleString(undefined, { maximumFractionDigits: 8 })

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 8,
    }).format(amount)
  } catch {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${currency}`
  }
}

export default async function TransactionReceiptPage({
  params,
}: {
  params: Promise<{ reference: string }>
}) {
  const { reference } = await params
  if (!/^VTX-[A-F0-9]{16}$/.test(reference)) notFound()

  const supabase = await getSessionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const result = await getTransactionForUser(reference, user.id)
  if (!result.ok) {
    return (
      <main className="page receipt-page">
        <p className="activity-notice" role="alert">
          This receipt is temporarily unavailable. Please try again later.
        </p>
        <Link className="receipt-back" href="/dashboard">Back to dashboard</Link>
      </main>
    )
  }
  if (!result.transaction) notFound()

  const transaction = result.transaction
  const transactionType =
    transaction.type === 'card_spend'
      ? 'Card activity'
      : transaction.type.replace('_', ' ')
  const status =
    transaction.status === 'confirmed'
      ? 'Recorded by provider'
      : transaction.status[0].toUpperCase() + transaction.status.slice(1)

  return (
    <main className="page receipt-page">
      <Link className="receipt-back" href="/dashboard">Back to dashboard</Link>
      <article className="receipt-card">
        <p className="eyebrow">VAULTEX transaction record</p>
        <h1>Receipt</h1>
        <p className="receipt-reference">{transaction.reference}</p>

        <dl className="receipt-details">
          <div>
            <dt>Activity</dt>
            <dd>{transactionType}</dd>
          </div>
          {transaction.merchant_name && (
            <div>
              <dt>Merchant</dt>
              <dd>{transaction.merchant_name}</dd>
            </div>
          )}
          <div>
            <dt>Amount</dt>
            <dd>{formatAmount(transaction.from_amount, transaction.from_token)}</dd>
          </div>
          {transaction.to_amount !== null && transaction.to_token && (
            <div>
              <dt>Converted amount</dt>
              <dd>{formatAmount(transaction.to_amount, transaction.to_token)}</dd>
            </div>
          )}
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
          <div>
            <dt>Payment provider</dt>
            <dd>{transaction.chain ?? 'Not provided'}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>
              {transaction.created_at
                ? new Date(transaction.created_at).toLocaleString()
                : 'Not provided'}
            </dd>
          </div>
          {transaction.fee_usd !== null && (
            <div>
              <dt>Recorded fee (USD)</dt>
              <dd>{formatAmount(transaction.fee_usd, 'USD')}</dd>
            </div>
          )}
        </dl>

        {transaction.type === 'send' && (
          <p className="receipt-disclaimer">
            Recipient details are not included in this transaction record.
          </p>
        )}
        <p className="receipt-disclaimer">
          This receipt reflects activity recorded by the listed provider. It
          does not confirm that a recipient bank received funds.
        </p>
      </article>
    </main>
  )
}

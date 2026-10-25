import 'server-only'

import Stripe from 'stripe'

let stripeClient: Stripe | undefined

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Stripe is not configured: STRIPE_SECRET_KEY is missing.')
  }

  stripeClient ??= new Stripe(secretKey, {
    apiVersion: '2026-06-24.dahlia',
  })
  return stripeClient
}

// Card spending categories allowed
export const ALLOWED_CATEGORIES = [
  'food_and_drink', 'retail_stores', 'online_services',
  'travel', 'entertainment', 'health_and_beauty',
]

export interface CardholderData {
  walletAddress: string
  firstName: string
  lastName: string
  email: string
  phone: string
  line1: string
  city: string
  state: string
  postalCode: string
  country: string
  dateOfBirth: {
    day: number
    month: number
    year: number
  }
}

// Create a verified Stripe Issuing cardholder
export async function createCardholder(data: CardholderData) {
  return await getStripe().issuing.cardholders.create({
    name:   `${data.firstName} ${data.lastName}`,
    email:  data.email,
    phone_number: data.phone,
    type:   'individual',
    individual: {
      first_name: data.firstName,
      last_name:  data.lastName,
      dob: data.dateOfBirth,
    },
    billing: {
      address: {
        line1:       data.line1,
        city:        data.city,
        state:       data.state,
        postal_code: data.postalCode,
        country:     data.country,
      },
    },
    metadata: { wallet_address: data.walletAddress },
  })
}

// Issue a virtual Visa card to a cardholder
export async function issueVirtualCard(cardholderId: string, dailyLimit: number = 2500) {
  return await getStripe().issuing.cards.create({
    cardholder:   cardholderId,
    currency:     'usd',
    type:         'virtual',
    status:       'active',
    spending_controls: {
      spending_limits: [
        { amount: dailyLimit * 100, interval: 'daily'   },
        { amount: 10000   * 100, interval: 'monthly'  },
      ],
    },
    metadata: { issued_by: 'vaultex' },
  })
}

// Get full card details including PAN (only available once)
export async function getCardDetails(cardId: string) {
  return await getStripe().issuing.cards.retrieve(cardId, {
    expand: ['number', 'cvc'],
  })
}

// Freeze or unfreeze a card
export async function updateCardStatus(cardId: string, status: 'active' | 'inactive') {
  return await getStripe().issuing.cards.update(cardId, { status })
}

// Update spending limits
export async function updateSpendingLimit(cardId: string, dailyLimit: number) {
  return await getStripe().issuing.cards.update(cardId, {
    spending_controls: {
      spending_limits: [
        { amount: dailyLimit * 100, interval: 'daily'  },
        { amount: 10000    * 100, interval: 'monthly' },
      ],
    },
  })
}

// List transactions for a card
export async function getCardTransactions(cardId: string) {
  return await getStripe().issuing.transactions.list({ card: cardId, limit: 50 })
}

// Create a payment intent for fiat on-ramp
export async function createOnRampPaymentIntent(amountUsd: number, currency = 'usd') {
  return await getStripe().paymentIntents.create({
    amount:   Math.round(amountUsd * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { type: 'crypto_onramp' },
  })
}

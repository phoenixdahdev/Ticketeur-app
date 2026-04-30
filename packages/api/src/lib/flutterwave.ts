// Flutterwave Standard v3 — minimal client wrapper.
// Docs: https://developer.flutterwave.com (v3 endpoints)
//
// Three calls we use here:
//   1) POST /v3/payments  — create hosted-checkout link
//   2) GET  /v3/transactions/:id/verify — confirm a transaction
//   3) Webhook signature verification — header `verif-hash` must equal
//      our configured FLW_SECRET_HASH. Plus we always re-verify by id
//      before persisting the paid state to the DB.

import { env } from '@ticketur/env/core'

const BASE_URL = 'https://api.flutterwave.com/v3'

export type FlutterwaveCustomer = {
  email: string
  name: string
  phonenumber?: string
}

export type FlutterwaveCustomization = {
  title?: string
  description?: string
  logo?: string
}

export type CreatePaymentInput = {
  txRef: string
  // Amount in major units (Naira). Flutterwave doesn't accept kobo.
  amount: number
  currency?: 'NGN'
  redirectUrl: string
  customer: FlutterwaveCustomer
  meta?: Record<string, string | number>
  customizations?: FlutterwaveCustomization
}

export type CreatePaymentResult = {
  link: string
}

type FlutterwaveCreatePaymentResponse = {
  status: 'success' | 'error'
  message: string
  data?: { link: string }
}

function requireSecret(): string {
  if (!env.FLW_SECRET_KEY) {
    throw new Error('FLW_SECRET_KEY is not configured')
  }
  return env.FLW_SECRET_KEY
}

export async function createPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  const secret = requireSecret()

  const body = {
    tx_ref: input.txRef,
    amount: input.amount,
    currency: input.currency ?? 'NGN',
    redirect_url: input.redirectUrl,
    customer: input.customer,
    meta: input.meta ?? {},
    customizations: input.customizations,
    payment_options: 'card,banktransfer,ussd,account',
  }

  const res = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = (await res.json()) as FlutterwaveCreatePaymentResponse
  if (!res.ok || json.status !== 'success' || !json.data?.link) {
    throw new Error(
      `Flutterwave create payment failed: ${json.message ?? res.statusText}`
    )
  }
  return { link: json.data.link }
}

export type FlutterwaveTransaction = {
  id: number
  tx_ref: string
  status: string
  amount: number
  currency: string
  customer: {
    email: string
    name?: string
    phone_number?: string | null
  }
}

type FlutterwaveVerifyResponse = {
  status: 'success' | 'error'
  message: string
  data?: FlutterwaveTransaction
}

export async function verifyTransaction(
  transactionId: string | number
): Promise<FlutterwaveTransaction | null> {
  const secret = requireSecret()
  const res = await fetch(
    `${BASE_URL}/transactions/${transactionId}/verify`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    }
  )
  const json = (await res.json()) as FlutterwaveVerifyResponse
  if (!res.ok || json.status !== 'success' || !json.data) {
    return null
  }
  return json.data
}

export function isWebhookSignatureValid(headerValue: string | null): boolean {
  if (!env.FLW_SECRET_HASH || !headerValue) return false
  return headerValue === env.FLW_SECRET_HASH
}

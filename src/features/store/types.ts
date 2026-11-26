import type { DepreciationQuote } from "./pricing-engine"

export type PaymentMethod = "aba_khqr"

export interface StoreSeatListing {
  id: string
  sku: string
  shortLabel: string
  label: string
  tier: string
  region: string
  activated_at: string
  highlights: string[]
  stock: number
  backgroundImage: string
  popular?: boolean
  featured?: boolean
}

export interface PricedSeatListing extends StoreSeatListing {
  quote: DepreciationQuote
}

export interface DeliveredGoogleAccount {
  email: string
  password: string
  recovery_email: string
  backup_codes: string[]
  plan: string
  storage_quota: string
  activated_at: string
  expires_at: string
  login_url: string
  security_note: string
}

export interface PurchaseReceipt {
  order_id: string
  status: "completed"
  seat: {
    id: string
    sku: string
    label: string
    tier: string
    activated_at: string
  }
  payment_method: PaymentMethod
  buyer_email: string
  total_usd: number
  total_khr: number
  quote: DepreciationQuote
  delivered_account: DeliveredGoogleAccount
  created_at_utc: string
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatKhr(amount: number): string {
  return `${amount.toLocaleString("en-US")} ៛`
}

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(clamped / 86400)
  const hours = Math.floor((clamped % 86400) / 3600)
  const minutes = Math.floor((clamped % 3600) / 60)
  const seconds = clamped % 60

  const hh = String(hours).padStart(2, "0")
  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")

  if (days > 0) {
    return `${days}d ${hh}:${mm}:${ss}`
  }
  return `${hh}:${mm}:${ss}`
}

export function formatUtcShort(iso: string): string {
  const date = new Date(iso)
  return date.toISOString().replace("T", " ").slice(0, 16) + " UTC"
}

export function formatUtcDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10)
}

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

export function formatShortDate(iso: string): string {
  const date = new Date(iso)
  return `${SHORT_MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

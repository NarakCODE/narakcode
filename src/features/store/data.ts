import { MS_PER_DAY, PLAN_DAYS } from "./pricing-engine"
import type { DeliveredGoogleAccount, StoreSeatListing } from "./types"

export const GEMINI_LOGO_URL =
  "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_SparkIcon_.width-500.format-webp.webp"

export const STORE_CARD_BG_URL = "/images/stores/card-bg.webp"

export type PlanFeatureIconKey =
  | "gemini"
  | "flow"
  | "search"
  | "antigravity"
  | "notebook"
  | "workspace"
  | "youtube"
  | "storage"

export interface PlanFeatureItem {
  id: string
  icon: PlanFeatureIconKey
  title: string
  summary: string
  description: string
}

export const GEMINI_PLAN_FEATURES: PlanFeatureItem[] = [
  {
    id: "gemini-app",
    icon: "gemini",
    title: "Gemini app",
    summary:
      "Access to Gemini 4 Neon & Gemini 4 Hydrogen, 4x higher usage limits, and video generation.",
    description:
      "Access to Gemini 4 Neon and Gemini 4 Hydrogen, four times higher usage limits than Free, and video generation.",
  },
  {
    id: "google-flow",
    icon: "flow",
    title: "Google Flow",
    summary:
      "1,000 credits for AI creative studio with Gemini Omni Flash and custom tools.",
    description:
      "Get 1,000 Google Flow credits across the AI creative studio to create cinematic scenes and stories with Gemini Omni Flash and custom tool creation.",
  },
  {
    id: "google-search",
    icon: "search",
    title: "Google Search",
    summary: "Higher access to Nano Banana, agentic capabilities, and more.",
    description:
      "Higher access to Nano Banana, agentic capabilities, and more.",
  },
  {
    id: "google-antigravity",
    icon: "antigravity",
    title: "Google Antigravity",
    summary: "Entry rate limits to agent models in Google Antigravity.",
    description:
      "Entry rate limits to agent models in Google Antigravity, the agentic development platform.",
  },
  {
    id: "gemini-notebook",
    icon: "notebook",
    title: "Gemini Notebook",
    summary:
      "Research and writing assistant with 5x more Audio Overviews and notebooks.",
    description:
      "Research and writing assistant with 5x more Audio Overviews, notebooks, and more.",
  },
  {
    id: "google-apps",
    icon: "workspace",
    title: "Gemini in Gmail, Docs, Vids and more",
    summary: "Access Gemini directly in Google apps.",
    description: "Access Gemini directly in Gmail, Docs, Vids, and more.",
  },
  {
    id: "youtube-premium-lite",
    icon: "youtube",
    title: "YouTube Premium Lite individual plan",
    summary: "Most videos ad-free, offline, and in the background.",
    description: "Most videos ad-free, offline, and in the background.",
  },
  {
    id: "storage",
    icon: "storage",
    title: "5 TB storage",
    summary: "5 TB of cloud storage across Gmail, Drive, and Photos.",
    description: "5 TB of cloud storage across Gmail, Drive, and Photos.",
  },
]

const SHARED_SEAT_HIGHLIGHTS = [
  "Access to Gemini 4 Neon & Gemini 4 Hydrogen (4x Free limits + video generation)",
  "1,000 Google Flow credits, Google Antigravity, Gemini Notebook & YouTube Premium Lite",
  "5 TB cloud storage across Gmail, Drive, and Photos",
  "Private personal account with instant handover and recovery transfer",
]

export const GEMINI_SEAT_LISTINGS: StoreSeatListing[] = [
  {
    id: "gp-12m-fresh",
    sku: "NC-GP12-01",
    shortLabel: "Google AI Pro",
    label: "Google AI Pro · Full 12 months",
    tier: "Google One AI Pro (5 TB + Gemini Pro)",
    region: "Global private account",
    activated_at: "2026-11-26T08:00:00.000Z",
    highlights: SHARED_SEAT_HIGHLIGHTS,
    stock: 3,
    backgroundImage: STORE_CARD_BG_URL,
    featured: true,
  },
  {
    id: "gp-12m-11m",
    sku: "NC-GP12-02",
    shortLabel: "Google AI Pro",
    label: "Google AI Pro · 46 weeks left",
    tier: "Google One AI Pro (5 TB + Gemini Pro)",
    region: "Global private account",
    activated_at: "2026-10-15T12:00:00.000Z",
    highlights: SHARED_SEAT_HIGHLIGHTS,
    stock: 2,
    backgroundImage: STORE_CARD_BG_URL,
    popular: true,
  },
  {
    id: "gp-12m-4m",
    sku: "NC-GP12-03",
    shortLabel: "Google AI Pro",
    label: "Google AI Pro · 17 weeks left",
    tier: "Google One AI Pro (5 TB + Gemini Pro)",
    region: "Global private account",
    activated_at: "2026-03-26T15:45:00.000Z",
    highlights: SHARED_SEAT_HIGHLIGHTS,
    stock: 2,
    backgroundImage: STORE_CARD_BG_URL,
  },
  {
    id: "gp-12m-floor",
    sku: "NC-GP12-04",
    shortLabel: "Google AI Pro",
    label: "Google AI Pro · Final weeks",
    tier: "Google One AI Pro (5 TB + Gemini Pro)",
    region: "Global private account",
    activated_at: "2025-12-21T06:00:00.000Z",
    highlights: SHARED_SEAT_HIGHLIGHTS,
    stock: 1,
    backgroundImage: STORE_CARD_BG_URL,
  },
]

interface SeatCredentialSeed {
  emailPrefix: string
  passwordPrefix: string
  recoveryEmail: string
  backupCodes: string[]
}

const STATIC_ACCOUNT_SEEDS: Record<string, SeatCredentialSeed> = {
  "gp-12m-fresh": {
    emailPrefix: "narak.gp12.fresh",
    passwordPrefix: "NrkPro!26F",
    recoveryEmail: "recovery-gp01@narakcode.dev",
    backupCodes: ["4829 1047", "7391 6204", "1584 9372", "6042 8159"],
  },
  "gp-12m-11m": {
    emailPrefix: "narak.gp12.oct",
    passwordPrefix: "NrkPro!26O",
    recoveryEmail: "recovery-gp02@narakcode.dev",
    backupCodes: ["9135 2840", "2468 7513", "8701 4629", "5392 1084"],
  },
  "gp-12m-4m": {
    emailPrefix: "narak.gp12.sprint",
    passwordPrefix: "NrkPro!26S",
    recoveryEmail: "recovery-gp04@narakcode.dev",
    backupCodes: ["7502 3196", "1849 6027", "9426 5381", "3068 4719"],
  },
  "gp-12m-floor": {
    emailPrefix: "narak.gp12.clear",
    passwordPrefix: "NrkPro!26C",
    recoveryEmail: "recovery-gp05@narakcode.dev",
    backupCodes: ["6294 8510", "4071 2368", "8539 1472", "2916 7803"],
  },
}

export function buildDeliveredGoogleAccount(
  seat: StoreSeatListing,
  orderId: string,
  purchaseIndex = 1
): DeliveredGoogleAccount {
  const seed = STATIC_ACCOUNT_SEEDS[seat.id] ?? {
    emailPrefix: "narak.gp12.seat",
    passwordPrefix: "NrkPro!26X",
    recoveryEmail: "recovery@narakcode.dev",
    backupCodes: ["5182 4093", "7420 6815", "3964 1278", "8051 9346"],
  }

  const slotTag = String(purchaseIndex).padStart(2, "0")
  const orderSuffix = orderId.slice(-4).toUpperCase()
  const activatedMs = new Date(seat.activated_at).getTime()
  const expiresAtIso = new Date(
    activatedMs + PLAN_DAYS * MS_PER_DAY
  ).toISOString()

  return {
    email: `${seed.emailPrefix}.${slotTag}@gmail.com`,
    password: `${seed.passwordPrefix}-${orderSuffix}#9`,
    recovery_email: seed.recoveryEmail,
    backup_codes: seed.backupCodes,
    plan: seat.tier,
    storage_quota: "5 TB cloud storage",
    activated_at: seat.activated_at,
    expires_at: expiresAtIso,
    login_url: "https://accounts.google.com",
    security_note:
      "Change the password and recovery email immediately after signing in.",
  }
}

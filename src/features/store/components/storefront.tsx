"use client"

import { useMemo, useState } from "react"
import {
  BookOpenIcon,
  ClapperboardIcon,
  CornerDownRightIcon,
  CpuIcon,
  HardDriveIcon,
  MailIcon,
  PlayIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from "@/components/page-heading"

import {
  buildDeliveredGoogleAccount,
  GEMINI_LOGO_URL,
  GEMINI_PLAN_FEATURES,
  GEMINI_SEAT_LISTINGS,
  type PlanFeatureIconKey,
} from "../data"
import {
  calculateDepreciationQuote,
  DEFAULT_PRICING_CONFIG,
} from "../pricing-engine"
import {
  formatKhr,
  formatUsd,
  type PricedSeatListing,
  type PurchaseReceipt,
} from "../types"
import { CheckoutPopup } from "./checkout-popup"
import { StoreSkyBackground } from "./store-sky-background"

interface StorefrontProps {
  initialNowIso: string
}

function FeatureIcon({
  icon,
  className,
}: {
  icon: PlanFeatureIconKey
  className?: string
}) {
  switch (icon) {
    case "gemini":
      return <SparklesIcon className={className} aria-hidden />
    case "flow":
      return <ClapperboardIcon className={className} aria-hidden />
    case "search":
      return <SearchIcon className={className} aria-hidden />
    case "antigravity":
      return <CpuIcon className={className} aria-hidden />
    case "notebook":
      return <BookOpenIcon className={className} aria-hidden />
    case "workspace":
      return <MailIcon className={className} aria-hidden />
    case "youtube":
      return <PlayIcon className={className} aria-hidden />
    case "storage":
      return <HardDriveIcon className={className} aria-hidden />
  }
}

export function Storefront({ initialNowIso }: StorefrontProps) {
  const evaluatedAtMs = useMemo(
    () => new Date(initialNowIso).getTime(),
    [initialNowIso]
  )
  const [activeSeatId, setActiveSeatId] = useState<string | null>(null)
  const [purchaseCountBySeat, setPurchaseCountBySeat] = useState<
    Record<string, number>
  >({})
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null)

  // Order ascending by remaining weeks ($0.50 -> $5.00) for clear weekly value progression.
  const accounts = useMemo<PricedSeatListing[]>(() => {
    return [...GEMINI_SEAT_LISTINGS]
      .map((account) => ({
        ...account,
        quote: calculateDepreciationQuote(
          account.activated_at,
          DEFAULT_PRICING_CONFIG,
          evaluatedAtMs
        ),
      }))
      .sort(
        (a, b) =>
          a.quote.billable_weeks - b.quote.billable_weeks ||
          a.quote.billable_days - b.quote.billable_days
      )
  }, [evaluatedAtMs])

  const activeAccount = useMemo(
    () => accounts.find((account) => account.id === activeSeatId) ?? null,
    [accounts, activeSeatId]
  )

  function handleOpenAccount(account: PricedSeatListing) {
    setReceipt(null)
    setActiveSeatId(account.id)
  }

  function handleClosePopup() {
    setActiveSeatId(null)
    setReceipt(null)
  }

  function handleCompletePurchase(
    account: PricedSeatListing,
    buyerEmail: string
  ) {
    const purchaseTime = new Date()
    const freshQuote = calculateDepreciationQuote(
      account.activated_at,
      DEFAULT_PRICING_CONFIG,
      purchaseTime
    )
    const nextIndex = (purchaseCountBySeat[account.id] ?? 0) + 1
    const orderId = `ORD-${purchaseTime.getTime().toString(36).toUpperCase()}`
    const deliveredAccount = buildDeliveredGoogleAccount(
      account,
      orderId,
      nextIndex
    )

    setPurchaseCountBySeat((prev) => ({
      ...prev,
      [account.id]: nextIndex,
    }))

    setReceipt({
      order_id: orderId,
      status: "completed",
      seat: {
        id: account.id,
        sku: account.sku,
        label: account.label,
        tier: account.tier,
        activated_at: account.activated_at,
      },
      payment_method: "aba_khqr",
      buyer_email: buyerEmail.trim() || "buyer@narakcode.dev",
      total_usd: freshQuote.final_usd,
      total_khr: freshQuote.final_khr,
      quote: freshQuote,
      delivered_account: deliveredAccount,
      created_at_utc: purchaseTime.toISOString(),
    })
  }

  return (
    <div data-slot="store-sky" className="text-foreground">
      {/* Painted ASCII sky spanning full width behind the header and hero */}
      <StoreSkyBackground />

      {/* Native PageHeading primitive positioned below the open ASCII sky band */}
      <PageHeading className="pt-28 sm:pt-36">
        <PageHeadingTitle>Google AI Pro accounts</PageHeadingTitle>
        <PageHeadingDescription>
          12-month accounts from{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatUsd(DEFAULT_PRICING_CONFIG.default_retail_price_usd)}
          </span>{" "}
          — price drops weekly for pre-activated accounts.
        </PageHeadingDescription>
      </PageHeading>

      {/* 4-Column Gemini Account Grid */}
      <section
        aria-label="Available Gemini accounts"
        className="screen-line-bottom"
      >
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {accounts.map((account) => {
            const q = account.quote
            const remainingPercent = Math.max(
              4,
              Math.round((q.billable_weeks / q.total_weeks) * 100)
            )

            return (
              <div
                key={account.id}
                className={cn(
                  "flex flex-col px-4 py-6 sm:px-5",
                  "sm:border-b sm:border-line sm:odd:border-r lg:border-b-0 lg:not-last:border-r lg:odd:border-r-0"
                )}
              >
                {/* Google AI Pro Banner Card with ASCII Artwork Background */}
                <Card className="relative h-56 gap-0 bg-foreground p-5 text-white shadow-none ring-black/10 dark:ring-white/15">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                  >
                    <img
                      src={account.backgroundImage}
                      alt=""
                      loading="eager"
                      decoding="async"
                      className="size-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>

                  <div className="relative z-1 flex h-full flex-col justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={GEMINI_LOGO_URL}
                        alt=""
                        aria-hidden
                        width={20}
                        height={20}
                        className="size-5 shrink-0 object-contain select-none"
                      />
                      <h2 className="truncate text-xl/tight font-medium tracking-tight text-white">
                        {account.shortLabel}
                      </h2>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium tracking-tight text-white tabular-nums">
                            {formatUsd(q.final_usd)}
                          </span>
                          {q.discount_percent_off_default > 0 && (
                            <span className="text-sm text-white/65 tabular-nums line-through">
                              {formatUsd(
                                DEFAULT_PRICING_CONFIG.default_retail_price_usd
                              )}
                            </span>
                          )}
                        </div>

                        {q.floor_applied ? (
                          <span className="inline-flex rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-xs">
                            Floor price
                          </span>
                        ) : q.discount_percent_off_default > 0 ? (
                          <span className="inline-flex rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white tabular-nums backdrop-blur-xs">
                            Save {Math.round(q.discount_percent_off_default)}%
                          </span>
                        ) : (
                          <span className="text-xs text-white/80">
                            Full term
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-white/85 tabular-nums">
                        <span>
                          {q.billable_weeks}{" "}
                          {q.billable_weeks === 1 ? "week" : "weeks"} left
                        </span>
                        <span>{formatKhr(q.final_khr)}</span>
                      </div>

                      <div
                        aria-hidden
                        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/25"
                      >
                        <div
                          className="h-full rounded-full bg-white"
                          style={{ width: `${remainingPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Full-Width System Disabled Button */}
                <Button
                  type="button"
                  size="lg"
                  disabled
                  onClick={() => handleOpenAccount(account)}
                  aria-label={`${account.shortLabel} (${q.billable_weeks} weeks left) — coming soon`}
                  className="mt-3.5 w-full"
                >
                  Coming soon
                </Button>

                {/* Included Account Features with Dashed Horizontal Dividers */}
                <div className="mt-6 flex-1">
                  <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Everything in Free and</span>
                    <CornerDownRightIcon
                      className="size-3 shrink-0"
                      aria-hidden
                    />
                  </div>

                  <ul className="divide-y divide-dashed divide-line text-xs">
                    {GEMINI_PLAN_FEATURES.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-start gap-2.5 py-2.5"
                      >
                        <FeatureIcon
                          icon={feature.icon}
                          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-foreground">
                            {feature.title}
                          </div>
                          <p className="mt-0.5 text-muted-foreground">
                            {feature.summary}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Smooth Motion checkout & Google account handover popup */}
      <CheckoutPopup
        seat={activeAccount}
        receipt={receipt}
        onClose={handleClosePopup}
        onCompletePurchase={handleCompletePurchase}
      />
    </div>
  )
}

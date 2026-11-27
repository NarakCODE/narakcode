"use client"

import { useMemo, useRef, useState } from "react"
import {
  BookOpenIcon,
  ClapperboardIcon,
  CpuIcon,
  HardDriveIcon,
  MailIcon,
  PlayIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"
import { SiGooglegemini } from "react-icons/si"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClaudeIcon, OpenAIIcon } from "@/components/icons"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from "@/components/page-heading"
import {
  createLightboxHandle,
  Lightbox,
  LightboxClose,
  LightboxContent,
  LightboxHeader,
  LightboxItem,
  LightboxSlide,
  LightboxSlides,
} from "@/registry/components/lightbox"

import {
  buildDeliveredGoogleAccount,
  GEMINI_LOGO_URL,
  GEMINI_PLAN_FEATURES,
  GEMINI_SEAT_LISTINGS,
  type ModelLogoKey,
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
import { LightboxDeliveredView, LightboxPaymentView } from "./checkout-popup"
import { StoreCardAsciiBackground } from "./store-card-ascii-background"
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

function ModelLogo({
  logo,
  className,
}: {
  logo: ModelLogoKey
  className?: string
}) {
  switch (logo) {
    case "gemini":
      return <SiGooglegemini className={className} aria-hidden />
    case "claude":
      return <ClaudeIcon className={className} aria-hidden />
    case "openai":
      return <OpenAIIcon className={className} aria-hidden />
  }
}

export function Storefront({ initialNowIso }: StorefrontProps) {
  const evaluatedAtMs = useMemo(
    () => new Date(initialNowIso).getTime(),
    [initialNowIso]
  )
  const [lightboxStep, setLightboxStep] = useState<
    "overview" | "payment" | "delivered"
  >("overview")
  const [purchaseCountBySeat, setPurchaseCountBySeat] = useState<
    Record<string, number>
  >({})
  const [receipt, setReceipt] = useState<PurchaseReceipt | null>(null)
  const lightboxHandle = useMemo(() => createLightboxHandle(), [])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const slideSurfaceRefs = useRef<(HTMLDivElement | null)[]>([])
  const slideContentRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeAnimationsRef = useRef<Animation[]>([])

  function openOverviewFromCard(index: number) {
    setLightboxStep("overview")
    setReceipt(null)
    const rect = cardRefs.current[index]?.getBoundingClientRect()
    lightboxHandle.open(index)

    requestAnimationFrame(() => {
      const surfaceEl = slideSurfaceRefs.current[index]
      const contentEl = slideContentRefs.current[index]
      if (!surfaceEl) return

      for (const anim of activeAnimationsRef.current) {
        anim.cancel()
      }
      activeAnimationsRef.current = []

      const reduced =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
      const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)"

      if (reduced || !rect) {
        activeAnimationsRef.current.push(
          surfaceEl.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 160,
            easing: easeOut,
            fill: "none",
          })
        )
        return
      }

      const vw = window.innerWidth
      const vh = window.innerHeight
      const top = Math.max(0, Math.round(rect.top))
      const right = Math.max(0, Math.round(vw - rect.right))
      const bottom = Math.max(0, Math.round(vh - rect.bottom))
      const left = Math.max(0, Math.round(rect.left))

      activeAnimationsRef.current.push(
        surfaceEl.animate(
          [
            {
              clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 12px)`,
              opacity: 0.92,
            },
            {
              clipPath: "inset(0px 0px 0px 0px round 0px)",
              opacity: 1,
            },
          ],
          {
            duration: 260,
            easing: easeOut,
            fill: "none",
          }
        )
      )

      if (contentEl) {
        activeAnimationsRef.current.push(
          contentEl.animate(
            [
              {
                opacity: 0,
                transform: "translateY(10px) scale(0.98)",
              },
              {
                opacity: 1,
                transform: "translateY(0px) scale(1)",
              },
            ],
            {
              duration: 220,
              delay: 40,
              easing: easeOut,
              fill: "backwards",
            }
          )
        )
      }
    })
  }

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

  function handleCloseLightbox() {
    lightboxHandle.close()
    setLightboxStep("overview")
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
    setLightboxStep("delivered")
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
          {accounts.map((account, index) => {
            const q = account.quote

            return (
              <div
                key={account.id}
                className={cn(
                  "flex flex-col px-4 py-6 sm:px-5",
                  "sm:border-b sm:border-line sm:odd:border-r lg:border-b-0 lg:not-last:border-r lg:odd:border-r-0"
                )}
              >
                {/* Google AI Pro Banner Card with ASCII Artwork Background */}
                <Card
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${account.label} details`}
                  onClick={() => openOverviewFromCard(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openOverviewFromCard(index)
                    }
                  }}
                  className="relative h-56 cursor-pointer touch-manipulation gap-0 bg-foreground p-5 text-white shadow-none ring-black/10 transition-transform duration-150 ease-out [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97] dark:ring-white/15 [@media(hover:hover)_and_(pointer:fine)]:hover:ring-white/30"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                  >
                    <StoreCardAsciiBackground />
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

                      <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-white/85 tabular-nums">
                        <span>
                          {q.billable_weeks}{" "}
                          {q.billable_weeks === 1 ? "week" : "weeks"} left
                        </span>
                        <span>{formatKhr(q.final_khr)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Full-Width Buy Now Button */}
                <Button
                  type="button"
                  size="lg"
                  onClick={() => openOverviewFromCard(index)}
                  aria-label={`Buy ${account.shortLabel} (${q.billable_weeks} weeks left)`}
                  className="mt-3.5 w-full"
                >
                  Buy now
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Unified product overview, KHQR payment & handover Lightbox */}
      <Lightbox
        handle={lightboxHandle}
        onOpenChange={(open) => {
          if (!open) {
            setLightboxStep("overview")
            setReceipt(null)
          }
        }}
      >
        <LightboxContent
          aria-label="Google AI Pro account overview"
          pullToClose={false}
          className="[--lightbox-vt-duration:180ms]"
        >
          <LightboxSlides
            aria-label="Available accounts"
            aria-roledescription="carousel"
            className="touch-pan-y overflow-x-hidden!"
          >
            {accounts.map((account, index) => {
              const q = account.quote

              return (
                <LightboxSlide key={account.id} className="p-0">
                  <LightboxItem
                    index={index}
                    caption={account.label}
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${accounts.length}`}
                    className="size-full"
                  >
                    <div
                      ref={(el) => {
                        slideSurfaceRefs.current[index] = el
                      }}
                      className="relative size-full overflow-hidden bg-foreground"
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                      >
                        <StoreCardAsciiBackground />
                        <div className="absolute inset-0 bg-black/80" />
                      </div>

                      <div
                        ref={(el) => {
                          slideContentRefs.current[index] = el
                        }}
                        className="relative z-1 flex size-full flex-col overflow-hidden pt-(--lb-inset-top) text-left text-white"
                      >
                        {lightboxStep === "delivered" &&
                        receipt &&
                        receipt.seat.id === account.id ? (
                          <LightboxDeliveredView
                            receipt={receipt}
                            onDone={handleCloseLightbox}
                          />
                        ) : lightboxStep === "payment" ? (
                          <LightboxPaymentView
                            seat={account}
                            onBack={() => setLightboxStep("overview")}
                            onCompletePurchase={handleCompletePurchase}
                          />
                        ) : (
                          <>
                            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                              <div className="px-4 py-6 sm:px-8 sm:py-10 md:px-20">
                                <div className="mx-auto max-w-5xl">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={GEMINI_LOGO_URL}
                                      alt=""
                                      aria-hidden
                                      width={36}
                                      height={36}
                                      className="size-8 shrink-0 object-contain select-none sm:size-9"
                                    />
                                    <h2 className="text-xl/tight font-medium tracking-tight text-white sm:text-4xl/tight sm:tracking-[-0.02em]">
                                      {account.label}
                                    </h2>
                                  </div>
                                  <p className="mt-1.5 text-sm text-white/80">
                                    {account.tier}
                                  </p>
                                </div>
                              </div>

                              <div className="border-y border-white/15 bg-black/30 px-4 sm:px-8 md:px-20">
                                <dl className="mx-auto grid max-w-5xl grid-cols-2 text-xs sm:grid-cols-4">
                                  <div className="border-r border-b border-white/15 py-3.5 pr-4 sm:border-b-0">
                                    <dt className="text-white/65">Remaining</dt>
                                    <dd className="mt-0.5 font-medium text-white tabular-nums">
                                      {q.billable_weeks}{" "}
                                      {q.billable_weeks === 1
                                        ? "week"
                                        : "weeks"}{" "}
                                      ({q.billable_days}d)
                                    </dd>
                                  </div>
                                  <div className="border-b border-white/15 py-3.5 pl-4 sm:border-r sm:border-b-0 sm:px-4">
                                    <dt className="text-white/65">Region</dt>
                                    <dd className="mt-0.5 font-medium text-white">
                                      {account.region}
                                    </dd>
                                  </div>
                                  <div className="border-r border-white/15 py-3.5 pr-4 sm:px-4">
                                    <dt className="text-white/65">SKU</dt>
                                    <dd className="mt-0.5 font-medium text-white tabular-nums">
                                      {account.sku}
                                    </dd>
                                  </div>
                                  <div className="py-3.5 pl-4">
                                    <dt className="text-white/65">Stock</dt>
                                    <dd className="mt-0.5 font-medium text-white tabular-nums">
                                      {account.stock} available
                                    </dd>
                                  </div>
                                </dl>
                              </div>

                              <div className="px-4 py-6 sm:px-8 md:px-20">
                                <div className="mx-auto max-w-5xl">
                                  <h3 className="text-xs font-medium text-white/70">
                                    Included in this account
                                  </h3>
                                  <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {GEMINI_PLAN_FEATURES.map((feature) => (
                                      <li
                                        key={feature.id}
                                        className="flex items-start gap-2.5 text-xs"
                                      >
                                        <FeatureIcon
                                          icon={feature.icon}
                                          className="mt-0.5 size-3.5 shrink-0 text-white/75"
                                        />
                                        <div className="min-w-0">
                                          <div className="font-medium text-white">
                                            {feature.title}
                                          </div>
                                          <p className="mt-0.5 text-white/75">
                                            {feature.summary}
                                          </p>
                                          {feature.subFeatures &&
                                            feature.subFeatures.length > 0 && (
                                              <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 border-l border-white/20 pl-2.5 text-white/80">
                                                {feature.subFeatures.map(
                                                  (item) => (
                                                    <li
                                                      key={item.label}
                                                      className="flex min-w-0 items-center gap-1.5"
                                                    >
                                                      <ModelLogo
                                                        logo={item.logo}
                                                        className="size-3.5 shrink-0 text-white"
                                                      />
                                                      <span className="truncate">
                                                        {item.label}
                                                      </span>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 border-t border-white/15 bg-black/40 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs sm:px-8 md:px-20 [@media(prefers-reduced-transparency:reduce)]:bg-black [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
                              <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
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
                                  <p className="mt-0.5 text-xs text-white/75 tabular-nums">
                                    {formatKhr(q.final_khr)}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  size="lg"
                                  className="h-11 w-full bg-white text-black hover:bg-white/90 sm:h-10 sm:w-auto"
                                  onClick={() => setLightboxStep("payment")}
                                >
                                  Buy now
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </LightboxItem>
                </LightboxSlide>
              )
            })}
          </LightboxSlides>

          <LightboxHeader>
            <LightboxClose />
          </LightboxHeader>
        </LightboxContent>
      </Lightbox>
    </div>
  )
}

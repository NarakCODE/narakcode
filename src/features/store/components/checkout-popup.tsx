"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { CopyButton } from "@/registry/components/copy-button"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"

import {
  cancelOrder,
  clearPersistedCheckout,
  createGuestSession,
  createKhqrPayment,
  createOrder,
  getOrderStatus,
  loadPersistedCheckoutForOffer,
  requestEmailVerification,
  resendOrderReceipt,
  revealOrderCredentials,
  savePersistedCheckout,
  simulateDevPayment,
  StorefrontApiError,
  triggerManualPaymentVerify,
  verifyEmailCode,
  type ApiKhqrPayment,
  type ApiOrderCreated,
  type ApiRevealedDelivery,
  type PersistedCheckoutState,
} from "../api"
import { GEMINI_LOGO_URL } from "../data"
import { encodeQrCode } from "../qr-encoder"
import {
  formatCountdown,
  formatKhr,
  formatUsd,
  formatUtcDate,
  type PricedSeatListing,
  type PurchaseReceipt,
} from "../types"

interface LightboxPaymentViewProps {
  seat: PricedSeatListing
  onBack: () => void
  onCatalogStale?: () => void
  onReservationChange?: () => void
  onCompletePurchase: (
    seat: PricedSeatListing,
    buyerEmail: string,
    liveResult: {
      order: ApiOrderCreated
      delivery: ApiRevealedDelivery
      csrfToken: string
    }
  ) => void
}

type CheckoutStage =
  | "email"
  | "otp"
  | "khqr"
  | "processing"
  | "review"
  | "expired"

const IS_DEV = process.env.NODE_ENV !== "production"

function formatCheckoutApiError(err: StorefrontApiError): string {
  switch (err.code) {
    case "INVENTORY_UNAVAILABLE":
      return "This offer was just taken. Return to the store to pick another available offer."
    case "PRICE_CHANGED":
      return "The offer price just changed. Return to the store to confirm the updated price."
    case "ACTIVE_ORDER_EXISTS":
      return "You already have an active unpaid reservation. Resume or cancel it from the store banner first."
    case "SESSION_REQUIRED":
    case "EMAIL_VERIFICATION_REQUIRED":
      return "Your verification session expired. Verify your email again to continue."
    case "RATE_LIMITED":
      return err.retryAfter
        ? `Too many requests. Please wait ${err.retryAfter}s and try again.`
        : "Too many requests. Please wait a moment and try again."
    case "PAYMENT_PROVIDER_UNAVAILABLE":
    case "QUOTA_EXHAUSTED":
      return "Payment verification is temporarily delayed. Keep this screen open or check again shortly."
    default:
      return err.message
  }
}

export function LightboxPaymentView({
  seat,
  onBack,
  onCatalogStale,
  onReservationChange,
  onCompletePurchase,
}: LightboxPaymentViewProps) {
  const isLiveOffer = Boolean(seat.offerId)
  const [persisted] = useState<PersistedCheckoutState | null>(() =>
    loadPersistedCheckoutForOffer(seat.offerId)
  )
  const [stage, setStage] = useState<CheckoutStage>(
    persisted ? "khqr" : isLiveOffer ? "email" : "khqr"
  )
  const [buyerEmail, setBuyerEmail] = useState(persisted?.buyerEmail ?? "")
  const [otpCode, setOtpCode] = useState("")
  const [csrfToken, setCsrfToken] = useState(persisted?.csrfToken ?? "")
  const [order, setOrder] = useState<ApiOrderCreated | null>(
    persisted?.order ?? null
  )
  const [payment, setPayment] = useState<ApiKhqrPayment | null>(
    persisted?.payment ?? null
  )
  const [pendingAction, setPendingAction] = useState<
    "send-otp" | "verify-otp" | "cancel" | "simulate" | "verify-payment" | null
  >(null)
  const busy = pendingAction !== null
  const [statusMessage, setStatusMessage] = useState<string | null>(
    persisted
      ? `Resumed active order ${persisted.order.orderNumber}. Scan the KHQR code to pay.`
      : null
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const revealingRef = useRef(false)

  // Live reservation countdown while KHQR payment is active
  useEffect(() => {
    if (!order || stage !== "khqr") return
    const timer = window.setInterval(() => {
      setNowMs(Date.now())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [order, stage])

  const secondsLeft =
    order && stage === "khqr"
      ? Math.max(
          0,
          Math.floor((new Date(order.expiresAt).getTime() - nowMs) / 1000)
        )
      : null

  // Poll local order status every 5s while KHQR or processing is active & page is visible
  useEffect(() => {
    if (!order || (stage !== "khqr" && stage !== "processing")) return

    let cancelled = false

    async function pollOnce() {
      if (cancelled || !order) return
      if (
        typeof document !== "undefined" &&
        document.visibilityState !== "visible"
      ) {
        return
      }
      try {
        const status = await getOrderStatus(order.orderId)
        if (cancelled) return

        if (
          status.orderStatus === "EXPIRED" ||
          status.orderStatus === "CANCELLED"
        ) {
          clearPersistedCheckout()
          onReservationChange?.()
          setStage("expired")
          setStatusMessage(
            status.orderStatus === "EXPIRED"
              ? "This reservation expired before payment was confirmed."
              : "This order was cancelled."
          )
          return
        }

        if (status.orderStatus === "REQUIRES_REVIEW") {
          clearPersistedCheckout()
          onReservationChange?.()
          setStage("review")
          setStatusMessage(
            "Payment received — your order is under manual review."
          )
          return
        }

        if (status.orderStatus === "PROCESSING") {
          setStage("processing")
          setStatusMessage("Payment confirmed. Preparing your order...")
          return
        }

        if (
          status.orderStatus === "COMPLETED" &&
          status.credentialsAvailable &&
          !revealingRef.current
        ) {
          revealingRef.current = true
          const delivery = await revealOrderCredentials(
            order.orderId,
            csrfToken
          )
          if (!cancelled) {
            clearPersistedCheckout()
            onReservationChange?.()
            onCompletePurchase(seat, buyerEmail, {
              order,
              delivery,
              csrfToken,
            })
          }
        }
      } catch {
        // Back off silently on transient poll errors; next tick retries
      }
    }

    const timer = window.setInterval(() => {
      void pollOnce()
    }, 5000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [
    order,
    stage,
    csrfToken,
    seat,
    buyerEmail,
    onCompletePurchase,
    onReservationChange,
  ])

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    const trimmed = buyerEmail.trim()
    if (!trimmed) {
      setErrorMessage("Please enter a valid contact email.")
      return
    }
    setPendingAction("send-otp")
    setErrorMessage(null)
    try {
      const session = await createGuestSession()
      setCsrfToken(session.csrfToken)
      await requestEmailVerification(trimmed, session.csrfToken)
      setStage("otp")
      setStatusMessage(
        IS_DEV
          ? "Verification code sent (check your Spring Boot console log in dev mode)."
          : "Verification code sent to your email."
      )
    } catch (err) {
      setErrorMessage(
        err instanceof StorefrontApiError
          ? formatCheckoutApiError(err)
          : "Unable to start checkout session. Is storefront-api running?"
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleVerifyAndReserve(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !seat.offerId) return
    setPendingAction("verify-otp")
    setErrorMessage(null)
    try {
      const verified = await verifyEmailCode(
        buyerEmail.trim(),
        otpCode.trim(),
        csrfToken
      )
      setCsrfToken(verified.csrfToken)

      const createdOrder = await createOrder({
        offerId: seat.offerId,
        expectedPrice: seat.serverPrice ?? seat.quote.final_usd.toFixed(2),
        currency: "USD",
        csrfToken: verified.csrfToken,
      })
      setOrder(createdOrder)

      const khqr = await createKhqrPayment({
        orderId: createdOrder.orderId,
        csrfToken: verified.csrfToken,
      })
      setPayment(khqr)
      savePersistedCheckout({
        offerId: seat.offerId,
        buyerEmail: buyerEmail.trim(),
        csrfToken: verified.csrfToken,
        order: createdOrder,
        payment: khqr,
      })
      onReservationChange?.()
      setStage("khqr")
      setStatusMessage(
        `Order ${createdOrder.orderNumber} reserved. Scan the KHQR code to pay.`
      )
    } catch (err) {
      if (err instanceof StorefrontApiError) {
        if (
          err.code === "PRICE_CHANGED" ||
          err.code === "INVENTORY_UNAVAILABLE"
        ) {
          onCatalogStale?.()
        } else if (
          err.code === "SESSION_REQUIRED" ||
          err.code === "EMAIL_VERIFICATION_REQUIRED"
        ) {
          setStage("email")
        }
        setErrorMessage(formatCheckoutApiError(err))
      } else {
        setErrorMessage("Could not verify email or reserve offer.")
      }
    } finally {
      setPendingAction(null)
    }
  }

  async function handleManualVerify() {
    if (!payment || !order || busy) return
    setPendingAction("verify-payment")
    setErrorMessage(null)
    try {
      const res = await triggerManualPaymentVerify(payment.paymentId, csrfToken)
      setStatusMessage(
        res.queued
          ? "Verification queued — checking with payment provider..."
          : `Current payment status: ${res.currentStatus}`
      )
      const status = await getOrderStatus(order.orderId)
      if (status.orderStatus === "COMPLETED" && status.credentialsAvailable) {
        revealingRef.current = true
        const delivery = await revealOrderCredentials(order.orderId, csrfToken)
        clearPersistedCheckout()
        onReservationChange?.()
        onCompletePurchase(seat, buyerEmail, { order, delivery, csrfToken })
      }
    } catch (err) {
      setErrorMessage(
        err instanceof StorefrontApiError
          ? formatCheckoutApiError(err)
          : "Unable to check payment status."
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleSimulateDevPaid() {
    if (!payment || !order || busy) return
    setPendingAction("simulate")
    setErrorMessage(null)
    try {
      await simulateDevPayment(payment.paymentId, "PAID")
      const status = await getOrderStatus(order.orderId)
      if (status.orderStatus === "COMPLETED" && status.credentialsAvailable) {
        revealingRef.current = true
        const delivery = await revealOrderCredentials(order.orderId, csrfToken)
        clearPersistedCheckout()
        onReservationChange?.()
        onCompletePurchase(seat, buyerEmail, { order, delivery, csrfToken })
      } else if (status.orderStatus === "REQUIRES_REVIEW") {
        clearPersistedCheckout()
        onReservationChange?.()
        setStage("review")
      } else {
        setStage("processing")
      }
    } catch (err) {
      setErrorMessage(
        err instanceof StorefrontApiError
          ? formatCheckoutApiError(err)
          : "Dev payment simulation failed."
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleCancelOrder() {
    if (!order || !csrfToken || busy) return
    setPendingAction("cancel")
    setErrorMessage(null)
    try {
      await cancelOrder(order.orderId, csrfToken)
      clearPersistedCheckout()
      onReservationChange?.()
      setOrder(null)
      setPayment(null)
      setStage("email")
      setStatusMessage("Order cancelled. You can start a new checkout.")
    } catch (err) {
      setErrorMessage(
        err instanceof StorefrontApiError
          ? formatCheckoutApiError(err)
          : "Unable to cancel order."
      )
    } finally {
      setPendingAction(null)
    }
  }

  const displayUsd = order
    ? Number(order.total)
    : seat.serverPrice
      ? Number(seat.serverPrice)
      : seat.quote.final_usd
  const displayKhr = Math.round(displayUsd * 4070)
  const qrSeed = payment?.qrPayload ?? seat.sku

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 py-6 sm:px-8 sm:py-10 md:px-20">
          <div className="mx-auto max-w-5xl">
            <button
              type="button"
              onClick={onBack}
              className="mb-3 -ml-2 inline-flex min-h-11 touch-manipulation items-center gap-1.5 px-2 text-xs font-medium text-white/75 transition-colors duration-150 hover:text-white sm:min-h-0 sm:py-1"
            >
              <ArrowLeftIcon className="size-3.5" aria-hidden />
              <span>Back to overview</span>
            </button>

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
                {stage === "email"
                  ? "Verify your email"
                  : stage === "otp"
                    ? "Enter verification code"
                    : stage === "review"
                      ? "Order under review"
                      : stage === "expired"
                        ? "Order expired"
                        : "KHQR payment"}
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-white/80">
              {seat.label} · ABA Bank · Bakong
              {order ? ` · ${order.orderNumber}` : ""}
            </p>
          </div>
        </div>

        <div className="border-t border-white/15 px-4 py-6 sm:px-8 md:px-20">
          <div className="mx-auto max-w-5xl space-y-5">
            {errorMessage && (
              <div
                role="alert"
                className="border border-red-400/40 bg-red-950/50 px-4 py-3 text-xs text-red-200"
              >
                {errorMessage}
              </div>
            )}

            {statusMessage && !errorMessage && (
              <div className="border border-white/20 bg-white/5 px-4 py-3 text-xs text-white/85">
                {statusMessage}
              </div>
            )}

            {stage === "email" && (
              <form onSubmit={handleSendOtp} className="max-w-md space-y-4">
                <label className="flex flex-col gap-1.5 text-xs">
                  <span className="font-medium text-white/80">
                    Contact email (required for receipt & secure recovery)
                  </span>
                  <Input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 border-white/20 bg-black/40 text-base text-white placeholder:text-white/45 sm:h-10 sm:text-sm"
                  />
                </label>
                <Button
                  type="submit"
                  size="lg"
                  disabled={busy}
                  className="h-11 w-full bg-white text-black hover:bg-white/90 sm:h-10 sm:w-auto"
                >
                  {pendingAction === "send-otp" && (
                    <Spinner className="size-3.5" aria-hidden />
                  )}
                  <span>
                    {pendingAction === "send-otp"
                      ? "Sending code..."
                      : "Send verification code"}
                  </span>
                </Button>
              </form>
            )}

            {stage === "otp" && (
              <form
                onSubmit={handleVerifyAndReserve}
                className="max-w-md space-y-4"
              >
                <label className="flex flex-col gap-1.5 text-xs">
                  <span className="font-medium text-white/80">
                    6-digit code sent to {buyerEmail}
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="h-11 border-white/20 bg-black/40 text-base tracking-widest text-white tabular-nums placeholder:text-white/45 sm:h-10 sm:text-sm"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={busy || otpCode.trim().length < 6}
                    className="h-11 bg-white text-black hover:bg-white/90 sm:h-10"
                  >
                    {pendingAction === "verify-otp" && (
                      <Spinner className="size-3.5" aria-hidden />
                    )}
                    <span>
                      {pendingAction === "verify-otp"
                        ? "Verifying & reserving..."
                        : "Verify & generate KHQR"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={busy}
                    onClick={() => setStage("email")}
                    className="h-11 border-white/25 bg-transparent text-white hover:bg-white/10 sm:h-10"
                  >
                    Change email
                  </Button>
                </div>
              </form>
            )}

            {(stage === "khqr" || stage === "processing") && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
                <div className="flex flex-col items-center gap-4 border border-white/15 bg-black/30 p-6 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                  <KhqrCode value={qrSeed} />

                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-white/65">Merchant</div>
                    <div className="mt-0.5 text-base font-medium text-white">
                      NarakCODE
                    </div>

                    <div className="mt-3 flex items-baseline justify-center gap-2 sm:justify-start">
                      <span className="text-2xl font-medium tracking-tight text-white tabular-nums">
                        {formatUsd(displayUsd)}
                      </span>
                      <span className="text-xs text-white/75 tabular-nums">
                        {formatKhr(displayKhr)}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-white/75">
                      {stage === "processing"
                        ? "Payment confirmed. Preparing your digital delivery..."
                        : isLiveOffer
                          ? "Scan with ABA Mobile or any Bakong KHQR app. Status updates automatically every 5s."
                          : "Preview mode (backend offline). Click Mark as paid to preview handover."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <dl className="divide-y divide-white/15 border-y border-white/15 text-xs">
                    {order && (
                      <div className="flex items-center justify-between gap-3 py-3">
                        <dt className="text-white/65">Order</dt>
                        <dd className="font-medium text-white tabular-nums">
                          {order.orderNumber}
                        </dd>
                      </div>
                    )}
                    {secondsLeft !== null && (
                      <div className="flex items-center justify-between gap-3 py-3">
                        <dt className="text-white/65">
                          Reservation expires in
                        </dt>
                        <dd className="font-medium text-white tabular-nums">
                          {formatCountdown(secondsLeft)}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3 py-3">
                      <dt className="text-white/65">Remaining term</dt>
                      <dd className="font-medium text-white tabular-nums">
                        {seat.quote.billable_weeks}{" "}
                        {seat.quote.billable_weeks === 1 ? "week" : "weeks"} (
                        {seat.quote.billable_days}d)
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 py-3">
                      <dt className="text-white/65">Payment method</dt>
                      <dd className="font-medium text-white">
                        {payment?.provider ?? "ABA KHQR"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {stage === "expired" && (
              <div className="max-w-xl space-y-4 border border-white/15 bg-black/30 p-5 text-xs text-white/85">
                <p className="font-medium text-white">
                  {statusMessage ?? "This reservation is no longer active."}
                </p>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => {
                    setOrder(null)
                    setPayment(null)
                    setOtpCode("")
                    setErrorMessage(null)
                    setStatusMessage(null)
                    setStage("email")
                  }}
                  className="h-11 bg-white text-black hover:bg-white/90 sm:h-10"
                >
                  Start a new checkout
                </Button>
              </div>
            )}

            {stage === "review" && (
              <div className="max-w-xl border border-amber-400/30 bg-amber-950/30 p-5 text-xs text-amber-100">
                <p className="font-medium">
                  Your payment was recorded, but delivery requires review.
                </p>
                <p className="mt-1.5 text-amber-200/80">
                  Please contact support with reference{" "}
                  <span className="font-medium text-white tabular-nums">
                    {order?.orderNumber}
                  </span>
                  . We never disclose credentials until payment and allocation
                  match.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {(stage === "khqr" || stage === "processing") && (
        <div className="shrink-0 border-t border-white/15 bg-black/40 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs sm:px-8 md:px-20 [@media(prefers-reduced-transparency:reduce)]:bg-black [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-2xl font-medium tracking-tight text-white tabular-nums">
                {formatUsd(displayUsd)}
              </div>
              <p className="mt-0.5 text-xs text-white/75 tabular-nums">
                {formatKhr(displayKhr)}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {isLiveOffer && order && stage === "khqr" && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={busy}
                  onClick={() => void handleCancelOrder()}
                  className="h-11 border-white/25 bg-transparent text-white hover:bg-white/10 sm:h-10"
                >
                  {pendingAction === "cancel" && (
                    <Spinner className="size-3.5" aria-hidden />
                  )}
                  <span>
                    {pendingAction === "cancel"
                      ? "Cancelling..."
                      : "Cancel order"}
                  </span>
                </Button>
              )}
              {IS_DEV && isLiveOffer && payment && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={busy}
                  onClick={() => void handleSimulateDevPaid()}
                  className="h-11 border-white/25 bg-transparent text-white hover:bg-white/10 sm:h-10"
                >
                  {pendingAction === "simulate" && (
                    <Spinner className="size-3.5" aria-hidden />
                  )}
                  <span>
                    {pendingAction === "simulate"
                      ? "Simulating..."
                      : "Simulate Paid (Dev)"}
                  </span>
                </Button>
              )}
              <Button
                type="button"
                size="lg"
                disabled={busy}
                onClick={() => void handleManualVerify()}
                className="h-11 w-full bg-white text-black hover:bg-white/90 sm:h-10 sm:w-auto"
              >
                {pendingAction === "verify-payment" ? (
                  <Spinner className="size-3.5" aria-hidden />
                ) : (
                  <RefreshCwIcon className="size-3.5" aria-hidden />
                )}
                <span>
                  {pendingAction === "verify-payment"
                    ? "Checking..."
                    : "I've paid — check now"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface LightboxDeliveredViewProps {
  receipt: PurchaseReceipt
  onDone: () => void
}

export function LightboxDeliveredView({
  receipt,
  onDone,
}: LightboxDeliveredViewProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  const { delivered_account: account } = receipt
  const isActivationCode = Boolean(account.activation_code)

  const allCredentialsText = isActivationCode
    ? [
        `Order: ${receipt.order_id}`,
        `Plan: ${account.plan}`,
        `Activation code: ${account.activation_code}`,
        `Valid until: ${formatUtcDate(account.expires_at)}`,
        `Redeem: ${account.login_url}`,
      ].join("\n")
    : [
        `Order: ${receipt.order_id}`,
        `Plan: ${account.plan}`,
        `Google email: ${account.email}`,
        `Password: ${account.password}`,
        ...(account.recovery_email
          ? [`Recovery email: ${account.recovery_email}`]
          : []),
        ...(account.backup_codes.length > 0
          ? [`Backup codes: ${account.backup_codes.join(", ")}`]
          : []),
        `Valid until: ${formatUtcDate(account.expires_at)}`,
        `Sign in: ${account.login_url}`,
      ].join("\n")

  async function handleResendReceipt() {
    if (!receipt.backend_order_id || !receipt.csrf_token || resending) return
    setResending(true)
    try {
      await resendOrderReceipt(receipt.backend_order_id, receipt.csrf_token)
      setResendStatus("Receipt queued for delivery.")
    } catch {
      setResendStatus("Could not resend receipt right now.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 py-8 sm:px-8 sm:py-10 md:px-20">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl/tight font-medium tracking-tight text-white sm:text-4xl/tight">
                {isActivationCode
                  ? "Digital pass delivered"
                  : "Google account delivered"}
              </h2>
              <p className="mt-1.5 text-xs text-white/75 tabular-nums">
                {receipt.order_id} · {formatUsd(receipt.total_usd)} /{" "}
                {formatKhr(receipt.total_khr)} via ABA KHQR
              </p>
            </div>

            <CopyButton
              text={allCredentialsText}
              variant="outline"
              size="sm"
              className="w-fit shrink-0 gap-1.5 border-white/25 bg-black/30 text-xs text-white hover:bg-white/10 active:scale-[0.97]"
            >
              <span>Copy all</span>
            </CopyButton>
          </div>
        </div>

        <div className="border-t border-white/15 px-4 py-6 sm:px-8 md:px-20">
          <div className="mx-auto max-w-5xl">
            <dl className="divide-y divide-white/15 border-b border-white/15 text-xs">
              {isActivationCode ? (
                <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <dt className="shrink-0 text-white/65">Activation code</dt>
                  <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                    <span className="font-medium break-all text-white tabular-nums">
                      {showPassword
                        ? account.activation_code
                        : "••••••••••••••••"}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-white/80 hover:bg-white/10 hover:text-white"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide code" : "Show code"}
                      >
                        <IconSwap>
                          <IconSwapItem
                            key={showPassword ? "hide" : "show"}
                            as={motion.span}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </IconSwapItem>
                        </IconSwap>
                      </Button>
                      <CopyButton
                        text={account.activation_code ?? ""}
                        variant="ghost"
                        size="icon-xs"
                        className="text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Copy activation code"
                      />
                    </div>
                  </dd>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <dt className="shrink-0 text-white/65">Google email</dt>
                    <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                      <span className="font-medium break-all text-white">
                        {account.email}
                      </span>
                      <CopyButton
                        text={account.email}
                        variant="ghost"
                        size="icon-xs"
                        className="text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Copy Google email"
                      />
                    </dd>
                  </div>

                  <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <dt className="shrink-0 text-white/65">Password</dt>
                    <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                      <span className="font-medium break-all text-white">
                        {showPassword ? account.password : "••••••••••••••••"}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-white/80 hover:bg-white/10 hover:text-white"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          <IconSwap>
                            <IconSwapItem
                              key={showPassword ? "hide" : "show"}
                              as={motion.span}
                            >
                              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </IconSwapItem>
                          </IconSwap>
                        </Button>
                        <CopyButton
                          text={account.password}
                          variant="ghost"
                          size="icon-xs"
                          className="text-white/80 hover:bg-white/10 hover:text-white"
                          aria-label="Copy password"
                        />
                      </div>
                    </dd>
                  </div>

                  {account.recovery_email && (
                    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <dt className="shrink-0 text-white/65">Recovery email</dt>
                      <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                        <span className="font-medium break-all text-white">
                          {account.recovery_email}
                        </span>
                        <CopyButton
                          text={account.recovery_email}
                          variant="ghost"
                          size="icon-xs"
                          className="text-white/80 hover:bg-white/10 hover:text-white"
                          aria-label="Copy recovery email"
                        />
                      </dd>
                    </div>
                  )}

                  {account.backup_codes.length > 0 && (
                    <div className="py-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-white/65">Backup codes</dt>
                        <CopyButton
                          text={account.backup_codes.join("\n")}
                          variant="ghost"
                          size="xs"
                          className="gap-1 text-xs text-white/75 hover:bg-white/10 hover:text-white"
                        >
                          <span>Copy codes</span>
                        </CopyButton>
                      </div>
                      <dd className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 font-medium text-white tabular-nums sm:grid-cols-4">
                        {account.backup_codes.map((code) => (
                          <span key={code}>{code}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between gap-3 py-3.5">
                <dt className="shrink-0 text-white/65">Valid until</dt>
                <dd className="font-medium text-white tabular-nums">
                  {formatUtcDate(account.expires_at)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs text-white/75">
              {account.security_note}
            </p>
            {resendStatus && (
              <p className="mt-2 text-xs text-white/80">{resendStatus}</p>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/15 bg-black/40 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs sm:px-8 md:px-20 [@media(prefers-reduced-transparency:reduce)]:bg-black [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {receipt.backend_order_id && receipt.csrf_token && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={resending}
              className="h-11 w-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:h-10 sm:w-auto"
              onClick={() => void handleResendReceipt()}
            >
              {resending && <Spinner className="size-3.5" aria-hidden />}
              <span>{resending ? "Resending..." : "Resend receipt"}</span>
            </Button>
          )}
          <a
            href={account.login_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-sm font-medium whitespace-nowrap text-black transition-transform duration-150 ease-out hover:bg-white/90 active:scale-[0.97] sm:h-10 sm:w-auto"
          >
            <span>{isActivationCode ? "Redeem now" : "Sign in to Google"}</span>
            <ExternalLinkIcon className="size-3.5" aria-hidden />
          </a>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:h-10 sm:w-auto"
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

function KhqrCode({ value }: { value: string }) {
  const { size, pathData } = useMemo(() => {
    const matrix = encodeQrCode(value)
    const parts: string[] = []
    for (let r = 0; r < matrix.size; r++) {
      const row = matrix.modules[r]
      for (let c = 0; c < matrix.size; c++) {
        if (row[c]) {
          parts.push(`M${c + 4},${r + 4}h1v1h-1z`)
        }
      }
    }
    return { size: matrix.size, pathData: parts.join("") }
  }, [value])

  const viewBoxSize = size + 8

  return (
    <div className="flex size-40 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 text-black">
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="size-full"
        shapeRendering="crispEdges"
        role="img"
        aria-label="KHQR payment code"
      >
        <path d={pathData} fill="currentColor" />
      </svg>
    </div>
  )
}

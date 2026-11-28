"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from "@/components/page-heading"
import { CopyButton } from "@/registry/components/copy-button"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"

import {
  getOrderDetail,
  requestOrderRecovery,
  resendOrderReceipt,
  revealOrderCredentials,
  StorefrontApiError,
  verifyOrderRecovery,
  type ApiOrderDetail,
  type ApiRevealedDelivery,
} from "../api"
import { formatUsd, formatUtcDate } from "../types"

type RecoveryViewState =
  | { kind: "request" }
  | { kind: "verifying" }
  | {
      kind: "revealed"
      order: ApiOrderDetail
      delivery: ApiRevealedDelivery
      csrfToken: string
    }
  | { kind: "error"; message: string }

function readHashToken(): string | null {
  if (typeof window === "undefined") return null
  const hash = window.location.hash
  if (!hash) return null
  const params = new URLSearchParams(hash.replace(/^#/, ""))
  const token = params.get("token")
  return token && token.trim().length > 0 ? token.trim() : null
}

export function OrderRecovery() {
  const [state, setState] = useState<RecoveryViewState>({ kind: "request" })
  const [email, setEmail] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [busy, setBusy] = useState(false)
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendFeedback, setResendFeedback] = useState<string | null>(null)

  useEffect(() => {
    const token = readHashToken()
    if (!token) return

    // Immediately scrub single-use recovery token from the address bar and history
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    )

    let cancelled = false

    async function exchange(rawToken: string) {
      setState({ kind: "verifying" })
      try {
        const exchanged = await verifyOrderRecovery(rawToken)
        const [order, delivery] = await Promise.all([
          getOrderDetail(exchanged.orderId),
          revealOrderCredentials(exchanged.orderId, exchanged.csrfToken),
        ])
        if (!cancelled) {
          setState({
            kind: "revealed",
            order,
            delivery,
            csrfToken: exchanged.csrfToken,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            kind: "error",
            message:
              err instanceof StorefrontApiError
                ? err.message
                : "This recovery link is invalid or has expired. Request a new link below.",
          })
        }
      }
    }

    void exchange(token)

    return () => {
      cancelled = true
    }
  }, [])

  async function handleRequestRecovery(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setRequestError("Enter the email address used during checkout.")
      return
    }
    setBusy(true)
    setRequestError(null)
    setRequestFeedback(null)
    try {
      const res = await requestOrderRecovery(
        trimmedEmail,
        orderNumber.trim() || undefined
      )
      setRequestFeedback(
        res.message ||
          "If a matching order exists, a single-use recovery link has been sent to your email."
      )
    } catch (err) {
      setRequestError(
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to send recovery link right now. Please try again."
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleResendReceipt(orderId: string, csrfToken: string) {
    if (resending) return
    setResending(true)
    setResendFeedback(null)
    try {
      await resendOrderReceipt(orderId, csrfToken)
      setResendFeedback("Receipt queued for delivery.")
    } catch (err) {
      setResendFeedback(
        err instanceof StorefrontApiError
          ? err.message
          : "Could not resend receipt right now."
      )
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-[60vh]">
      <div className="screen-line-bottom px-4 py-3">
        <Link
          href="/stores"
          className="inline-flex min-h-9 touch-manipulation items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden />
          <span>Back to store</span>
        </Link>
      </div>

      <PageHeading>
        <PageHeadingTitle>Recover an order</PageHeadingTitle>
        <PageHeadingDescription>
          Request a single-use link to view your delivered credentials.
        </PageHeadingDescription>
      </PageHeading>

      {state.kind === "verifying" && (
        <section className="screen-line-bottom px-4 py-10">
          <p className="text-sm text-muted-foreground">
            Verifying your recovery link...
          </p>
        </section>
      )}

      {state.kind === "revealed" && (
        <section className="screen-line-bottom">
          <div className="flex flex-col gap-4 border-b border-line px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl/tight font-medium tracking-tight text-foreground">
                {state.delivery.productName}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {state.order.orderNumber} ·{" "}
                {formatUsd(Number(state.order.total))} ·{" "}
                {state.order.maskedEmail}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={resending}
                className="transition-transform duration-150 ease-out active:scale-[0.97]"
                onClick={() =>
                  void handleResendReceipt(state.order.orderId, state.csrfToken)
                }
              >
                {resending && <Spinner className="size-3.5" aria-hidden />}
                <span>{resending ? "Resending..." : "Resend receipt"}</span>
              </Button>
              <a
                href={
                  state.delivery.redeemUrl ??
                  state.delivery.loginUrl ??
                  "https://gemini.google.com/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-transform duration-150 ease-out active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-90"
              >
                <span>
                  {state.delivery.activationCode ? "Redeem now" : "Sign in"}
                </span>
                <ExternalLinkIcon className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>

          <div className="px-4 py-6">
            <dl className="divide-y divide-line border-b border-line text-xs">
              {state.delivery.activationCode ? (
                <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <dt className="shrink-0 text-muted-foreground">
                    Activation code
                  </dt>
                  <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                    <span className="font-medium break-all text-foreground tabular-nums">
                      {showSecret
                        ? state.delivery.activationCode
                        : "••••••••••••••••"}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setShowSecret((prev) => !prev)}
                        aria-label={showSecret ? "Hide code" : "Show code"}
                      >
                        <IconSwap>
                          <IconSwapItem
                            key={showSecret ? "hide" : "show"}
                            as={motion.span}
                          >
                            {showSecret ? <EyeOffIcon /> : <EyeIcon />}
                          </IconSwapItem>
                        </IconSwap>
                      </Button>
                      <CopyButton
                        text={state.delivery.activationCode}
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Copy activation code"
                      />
                    </div>
                  </dd>
                </div>
              ) : (
                <>
                  {(state.delivery.accountEmail || state.delivery.email) && (
                    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <dt className="shrink-0 text-muted-foreground">
                        Account email
                      </dt>
                      <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                        <span className="font-medium break-all text-foreground">
                          {state.delivery.accountEmail ?? state.delivery.email}
                        </span>
                        <CopyButton
                          text={
                            state.delivery.accountEmail ??
                            state.delivery.email ??
                            ""
                          }
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Copy account email"
                        />
                      </dd>
                    </div>
                  )}

                  {state.delivery.password && (
                    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <dt className="shrink-0 text-muted-foreground">
                        Password
                      </dt>
                      <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                        <span className="font-medium break-all text-foreground tabular-nums">
                          {showSecret
                            ? state.delivery.password
                            : "••••••••••••••••"}
                        </span>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setShowSecret((prev) => !prev)}
                            aria-label={
                              showSecret ? "Hide password" : "Show password"
                            }
                          >
                            <IconSwap>
                              <IconSwapItem
                                key={showSecret ? "hide" : "show"}
                                as={motion.span}
                              >
                                {showSecret ? <EyeOffIcon /> : <EyeIcon />}
                              </IconSwapItem>
                            </IconSwap>
                          </Button>
                          <CopyButton
                            text={state.delivery.password}
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Copy password"
                          />
                        </div>
                      </dd>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between gap-3 py-3.5">
                <dt className="shrink-0 text-muted-foreground">Valid until</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {formatUtcDate(state.delivery.subscriptionExpiresAt)}
                </dd>
              </div>
            </dl>

            {resendFeedback && (
              <p className="mt-3 text-xs text-muted-foreground">
                {resendFeedback}
              </p>
            )}
          </div>
        </section>
      )}

      {(state.kind === "request" || state.kind === "error") && (
        <section className="screen-line-bottom px-4 py-8">
          {state.kind === "error" && (
            <div
              role="alert"
              className="mb-6 border border-destructive/40 bg-surface px-4 py-3 text-xs text-destructive"
            >
              {state.message}
            </div>
          )}

          {requestError && (
            <div
              role="alert"
              className="mb-6 border border-destructive/40 bg-surface px-4 py-3 text-xs text-destructive"
            >
              {requestError}
            </div>
          )}

          {requestFeedback && (
            <div className="mb-6 border border-line bg-surface px-4 py-3 text-xs text-foreground">
              {requestFeedback}
            </div>
          )}

          <form onSubmit={handleRequestRecovery} className="max-w-md space-y-4">
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">
                Checkout email
              </span>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 text-base sm:h-10 sm:text-sm"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">
                Order number (optional)
              </span>
              <Input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-..."
                className="h-11 text-base tabular-nums sm:h-10 sm:text-sm"
              />
            </label>

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="h-11 w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:h-10 sm:w-auto"
            >
              {busy && <Spinner className="size-3.5" aria-hidden />}
              <span>{busy ? "Sending link..." : "Send recovery link"}</span>
            </Button>
          </form>
        </section>
      )}
    </div>
  )
}

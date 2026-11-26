"use client"

import { useState } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { ExternalLinkIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyButton } from "@/registry/components/copy-button"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"
import {
  StatusButton,
  type ButtonStatus,
} from "@/registry/components/status-button"

import { GEMINI_LOGO_URL } from "../data"
import {
  formatKhr,
  formatShortDate,
  formatUsd,
  formatUtcDate,
  type PricedSeatListing,
  type PurchaseReceipt,
} from "../types"

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface CheckoutPopupProps {
  seat: PricedSeatListing | null
  receipt: PurchaseReceipt | null
  onClose: () => void
  onCompletePurchase: (seat: PricedSeatListing, buyerEmail: string) => void
}

export function CheckoutPopup({
  seat,
  receipt,
  onClose,
  onCompletePurchase,
}: CheckoutPopupProps) {
  const prefersReducedMotion = useReducedMotion()
  const [buyerEmail, setBuyerEmail] = useState("")
  const [payStatus, setPayStatus] = useState<ButtonStatus>("idle")
  const [showPassword, setShowPassword] = useState(false)

  const open = seat !== null

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setPayStatus("idle")
      setShowPassword(false)
      onClose()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!seat || payStatus !== "idle") return

    setPayStatus("loading")
    window.setTimeout(() => {
      setPayStatus("success")
      window.setTimeout(() => {
        onCompletePurchase(seat, buyerEmail)
        setPayStatus("idle")
      }, 260)
    }, 360)
  }

  const popupInitial = prefersReducedMotion
    ? { opacity: 0, transform: "translate(-50%, -50%)" }
    : {
        opacity: 0,
        transform: "translate(-50%, calc(-50% + 10px)) scale(0.95)",
      }

  const popupAnimate = {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
  }

  const popupExit = prefersReducedMotion
    ? { opacity: 0, transform: "translate(-50%, -50%)" }
    : { opacity: 0, transform: "translate(-50%, calc(-50% + 6px)) scale(0.96)" }

  const stepInitial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(6px)", filter: "blur(2px)" }

  const stepAnimate = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }

  const stepExit = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(-4px)", filter: "blur(2px)" }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal keepMounted>
        <AnimatePresence>
          {open && seat && (
            <>
              <DialogPrimitive.Backdrop
                key="checkout-backdrop"
                render={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: prefersReducedMotion ? 0.14 : 0.2,
                        ease: EASE_OUT,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: prefersReducedMotion ? 0.1 : 0.15,
                        ease: EASE_OUT,
                      },
                    }}
                  />
                }
                className="fixed inset-0 isolate z-50 bg-black/25 backdrop-blur-[2px] dark:bg-black/50"
              />

              <DialogPrimitive.Popup
                key="checkout-popup"
                render={
                  <motion.div
                    initial={popupInitial}
                    animate={{
                      ...popupAnimate,
                      transition: {
                        duration: prefersReducedMotion ? 0.16 : 0.24,
                        ease: EASE_OUT,
                      },
                    }}
                    exit={{
                      ...popupExit,
                      transition: {
                        duration: prefersReducedMotion ? 0.12 : 0.16,
                        ease: EASE_OUT,
                      },
                    }}
                  />
                }
                className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100svh-2rem)] w-full max-w-[calc(100%-2rem)] origin-center overflow-y-auto rounded-2xl bg-background text-sm shadow-lg ring-1 ring-foreground/10 outline-none sm:max-w-lg dark:ring-foreground/20"
              >
                <DialogPrimitive.Close
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-4 right-4 z-10 active:scale-[0.97]"
                    />
                  }
                >
                  <XIcon />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                <AnimatePresence mode="wait" initial={false}>
                  {receipt ? (
                    <motion.div
                      key="delivered-view"
                      initial={stepInitial}
                      animate={{
                        ...stepAnimate,
                        transition: {
                          duration: prefersReducedMotion ? 0.14 : 0.2,
                          ease: EASE_OUT,
                        },
                      }}
                      exit={{
                        ...stepExit,
                        transition: {
                          duration: prefersReducedMotion ? 0.1 : 0.14,
                          ease: EASE_OUT,
                        },
                      }}
                      className="p-6"
                    >
                      <DeliveredContent
                        receipt={receipt}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword((p) => !p)}
                        onDone={() => handleOpenChange(false)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="checkout-view"
                      initial={stepInitial}
                      animate={{
                        ...stepAnimate,
                        transition: {
                          duration: prefersReducedMotion ? 0.14 : 0.2,
                          ease: EASE_OUT,
                        },
                      }}
                      exit={{
                        ...stepExit,
                        transition: {
                          duration: prefersReducedMotion ? 0.1 : 0.14,
                          ease: EASE_OUT,
                        },
                      }}
                      className="p-6"
                    >
                      <div className="pr-8">
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {seat.sku}
                        </div>
                        <DialogPrimitive.Title className="mt-1.5 flex items-center gap-2 font-heading text-2xl font-medium tracking-tight text-foreground">
                          <img
                            src={GEMINI_LOGO_URL}
                            alt=""
                            aria-hidden
                            width={22}
                            height={22}
                            className="size-5.5 shrink-0 object-contain select-none"
                          />
                          <span>{seat.shortLabel}</span>
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="mt-1 text-xs text-muted-foreground tabular-nums">
                          {seat.tier} · {seat.quote.billable_weeks} of{" "}
                          {seat.quote.total_weeks} weeks remaining
                        </DialogPrimitive.Description>
                      </div>

                      {/* Price & weekly drop summary */}
                      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 border-y border-line py-4">
                        <div>
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-heading text-4xl font-medium tracking-tight text-foreground tabular-nums">
                              {formatUsd(seat.quote.final_usd)}
                            </span>
                            {seat.quote.discount_percent_off_default > 0 && (
                              <span className="text-sm text-muted-foreground tabular-nums line-through">
                                {formatUsd(5)}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {formatKhr(seat.quote.final_khr)} · Activated{" "}
                            {formatShortDate(seat.activated_at)}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-xs font-medium text-foreground">
                            Weekly price drop
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                            {seat.quote.floor_applied
                              ? "Floor price reached"
                              : seat.quote.next_drop_at
                                ? `Next drop ${formatShortDate(seat.quote.next_drop_at)}`
                                : "Final week"}
                          </div>
                          {!seat.quote.floor_applied &&
                            seat.quote.next_drop_amount_usd > 0 && (
                              <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                                -{formatUsd(seat.quote.next_drop_amount_usd)}{" "}
                                per week
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Included specs */}
                      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        {seat.highlights.map((item) => (
                          <li key={item} className="flex items-baseline gap-2">
                            <span
                              aria-hidden
                              className="text-muted-foreground/60"
                            >
                              —
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        <label className="flex flex-col gap-1.5 text-xs">
                          <span className="font-medium text-muted-foreground">
                            Receipt email (optional)
                          </span>
                          <Input
                            type="email"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-9 bg-background text-sm"
                          />
                        </label>

                        <div className="flex items-center justify-between border-t border-line pt-4 text-xs">
                          <span className="text-muted-foreground">
                            Payment method
                          </span>
                          <span className="font-medium text-foreground">
                            ABA KHQR
                          </span>
                        </div>

                        <StatusButton
                          type="submit"
                          size="lg"
                          status={payStatus}
                          successLabel="Account ready"
                          className="w-full active:scale-[0.97]"
                        >
                          Pay {formatUsd(seat.quote.final_usd)} with ABA KHQR
                        </StatusButton>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DialogPrimitive.Popup>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function DeliveredContent({
  receipt,
  showPassword,
  onTogglePassword,
  onDone,
}: {
  receipt: PurchaseReceipt
  showPassword: boolean
  onTogglePassword: () => void
  onDone: () => void
}) {
  const { delivered_account: account } = receipt

  const allCredentialsText = [
    `Order: ${receipt.order_id}`,
    `Plan: ${account.plan}`,
    `Google email: ${account.email}`,
    `Password: ${account.password}`,
    `Recovery email: ${account.recovery_email}`,
    `Backup codes: ${account.backup_codes.join(", ")}`,
    `Valid until: ${formatUtcDate(account.expires_at)}`,
    `Sign in: ${account.login_url}`,
  ].join("\n")

  return (
    <div>
      <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <DialogPrimitive.Title className="font-heading text-2xl font-medium tracking-tight text-foreground">
            Google account delivered
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1 text-xs text-muted-foreground tabular-nums">
            {receipt.order_id} · {formatUsd(receipt.total_usd)} /{" "}
            {formatKhr(receipt.total_khr)} via ABA KHQR
          </DialogPrimitive.Description>
        </div>

        <CopyButton
          text={allCredentialsText}
          variant="outline"
          size="sm"
          className="w-fit shrink-0 gap-1.5 text-xs active:scale-[0.97]"
        >
          <span>Copy all</span>
        </CopyButton>
      </div>

      {/* Hairline-divided credentials list — zero nested boxes */}
      <dl className="mt-5 divide-y divide-line border-y border-line text-xs">
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <dt className="shrink-0 text-muted-foreground">Google email</dt>
          <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
            <span className="font-medium break-all text-foreground">
              {account.email}
            </span>
            <CopyButton
              text={account.email}
              variant="ghost"
              size="icon-xs"
              aria-label="Copy Google email"
            />
          </dd>
        </div>

        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <dt className="shrink-0 text-muted-foreground">Password</dt>
          <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
            <span className="font-medium break-all text-foreground">
              {showPassword ? account.password : "••••••••••••••••"}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onTogglePassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                aria-label="Copy password"
              />
            </div>
          </dd>
        </div>

        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <dt className="shrink-0 text-muted-foreground">Recovery email</dt>
          <dd className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
            <span className="font-medium break-all text-foreground">
              {account.recovery_email}
            </span>
            <CopyButton
              text={account.recovery_email}
              variant="ghost"
              size="icon-xs"
              aria-label="Copy recovery email"
            />
          </dd>
        </div>

        <div className="py-3">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Backup codes</dt>
            <CopyButton
              text={account.backup_codes.join("\n")}
              variant="ghost"
              size="xs"
              className="gap-1 text-xs text-muted-foreground"
            >
              <span>Copy codes</span>
            </CopyButton>
          </div>
          <dd className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 font-medium text-foreground tabular-nums">
            {account.backup_codes.map((code) => (
              <span key={code}>{code}</span>
            ))}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="shrink-0 text-muted-foreground">Valid until</dt>
          <dd className="font-medium text-foreground tabular-nums">
            {formatUtcDate(account.expires_at)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-muted-foreground">
        {account.security_note}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={account.login_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-medium whitespace-nowrap text-background transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
        >
          <span>Sign in to Google</span>
          <ExternalLinkIcon className="size-3.5" aria-hidden />
        </a>
        <Button type="button" variant="outline" size="default" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}

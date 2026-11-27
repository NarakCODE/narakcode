"use client"

import { useState } from "react"
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyButton } from "@/registry/components/copy-button"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"

import { GEMINI_LOGO_URL } from "../data"
import {
  formatKhr,
  formatUsd,
  formatUtcDate,
  type PricedSeatListing,
  type PurchaseReceipt,
} from "../types"

interface LightboxPaymentViewProps {
  seat: PricedSeatListing
  onBack: () => void
  onCompletePurchase: (seat: PricedSeatListing, buyerEmail: string) => void
}

export function LightboxPaymentView({
  seat,
  onBack,
  onCompletePurchase,
}: LightboxPaymentViewProps) {
  const [buyerEmail, setBuyerEmail] = useState("")
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (payStatus !== "idle") return

    setPayStatus("loading")
    window.setTimeout(() => {
      setPayStatus("success")
      window.setTimeout(() => {
        onCompletePurchase(seat, buyerEmail)
        setPayStatus("idle")
      }, 240)
    }, 320)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="shrink-0 px-4 py-6 sm:px-8 sm:py-10 md:px-20">
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
              KHQR payment
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-white/80">
            {seat.label} · ABA Bank · Bakong
          </p>
        </div>
      </div>

      <div className="flex-1 border-t border-white/15 px-4 py-6 sm:px-8 md:px-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          <div className="flex flex-col items-center gap-4 border border-white/15 bg-black/30 p-6 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
            <StaticKhqrCode seed={seat.sku} />

            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/65">Merchant</div>
              <div className="mt-0.5 text-base font-medium text-white">
                NarakCODE
              </div>

              <div className="mt-3 flex items-baseline justify-center gap-2 sm:justify-start">
                <span className="text-2xl font-medium tracking-tight text-white tabular-nums">
                  {formatUsd(seat.quote.final_usd)}
                </span>
                <span className="text-xs text-white/75 tabular-nums">
                  {formatKhr(seat.quote.final_khr)}
                </span>
              </div>

              <p className="mt-2.5 text-xs text-white/75">
                Scan with ABA Mobile or any Bakong KHQR app, then click Mark as
                paid below.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-white/80">
                Receipt email (optional)
              </span>
              <Input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 border-white/20 bg-black/40 text-base text-white placeholder:text-white/45 sm:h-10 sm:text-sm"
              />
            </label>

            <dl className="divide-y divide-white/15 border-y border-white/15 text-xs">
              <div className="flex items-center justify-between gap-3 py-3">
                <dt className="text-white/65">SKU</dt>
                <dd className="font-medium text-white tabular-nums">
                  {seat.sku}
                </dd>
              </div>
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
                <dd className="font-medium text-white">ABA KHQR</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/15 bg-black/40 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs sm:px-8 md:px-20 [@media(prefers-reduced-transparency:reduce)]:bg-black [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-2xl font-medium tracking-tight text-white tabular-nums">
              {formatUsd(seat.quote.final_usd)}
            </div>
            <p className="mt-0.5 text-xs text-white/75 tabular-nums">
              {formatKhr(seat.quote.final_khr)}
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={payStatus !== "idle"}
            className="h-11 w-full bg-white text-black hover:bg-white/90 sm:h-10 sm:w-auto"
          >
            {payStatus === "loading"
              ? "Verifying payment..."
              : payStatus === "success"
                ? "Account ready"
                : "Mark as paid"}
          </Button>
        </div>
      </div>
    </form>
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
    <div className="flex flex-1 flex-col">
      <div className="shrink-0 px-4 py-8 sm:px-8 sm:py-10 md:px-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-2xl/tight font-medium tracking-tight text-white sm:text-4xl/tight">
              Google account delivered
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

      <div className="flex-1 border-t border-white/15 px-4 py-6 sm:px-8 md:px-20">
        <div className="mx-auto max-w-5xl">
          <dl className="divide-y divide-white/15 border-b border-white/15 text-xs">
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

            <div className="flex items-center justify-between gap-3 py-3.5">
              <dt className="shrink-0 text-white/65">Valid until</dt>
              <dd className="font-medium text-white tabular-nums">
                {formatUtcDate(account.expires_at)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-xs text-white/75">{account.security_note}</p>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/15 bg-black/40 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs sm:px-8 md:px-20 [@media(prefers-reduced-transparency:reduce)]:bg-black [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <a
            href={account.login_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-sm font-medium whitespace-nowrap text-black transition-transform duration-150 ease-out hover:bg-white/90 active:scale-[0.97] sm:h-10 sm:w-auto"
          >
            <span>Sign in to Google</span>
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

function StaticKhqrCode({ seed }: { seed: string }) {
  const size = 21
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  const cells: Array<{ x: number; y: number }> = []

  function inFinder(r: number, c: number, tr: number, tc: number) {
    const dr = r - tr
    const dc = c - tc
    if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return null
    if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true
    if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true
    return false
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r >= 8 && r <= 12 && c >= 8 && c <= 12) continue

      const f1 = inFinder(r, c, 0, 0)
      const f2 = inFinder(r, c, 0, size - 7)
      const f3 = inFinder(r, c, size - 7, 0)
      const finder = f1 ?? f2 ?? f3
      if (finder !== null) {
        if (finder) cells.push({ x: c, y: r })
        continue
      }

      if (
        (r === 7 && (c <= 7 || c >= size - 8)) ||
        (c === 7 && (r <= 7 || r >= size - 8)) ||
        (r === size - 8 && c <= 7) ||
        (c === size - 8 && r <= 7)
      ) {
        continue
      }

      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) cells.push({ x: c, y: r })
        continue
      }

      const bit = Math.imul(hash ^ (r * 31 + c * 17), 2654435761) >>> 28
      if (bit % 2 === 0) cells.push({ x: c, y: r })
    }
  }

  return (
    <div className="relative flex size-36 shrink-0 items-center justify-center rounded-lg bg-white p-2.5 text-black">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="size-full"
        role="img"
        aria-label="Static KHQR payment code"
      >
        {cells.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width={1}
            height={1}
            fill="currentColor"
          />
        ))}
      </svg>
      <span
        aria-hidden
        className="absolute flex size-6 items-center justify-center rounded-full bg-black text-xs font-medium text-white"
      >
        $
      </span>
    </div>
  )
}

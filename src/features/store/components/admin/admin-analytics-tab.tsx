"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
  fetchAdminSalesAnalytics,
  type AdminSalesMetrics,
} from "../../admin-api"
import { StorefrontApiError } from "../../api"
import { formatUsd, formatUtcShort } from "../../types"

interface AdminAnalyticsTabProps {
  initialMetrics: AdminSalesMetrics | null
  onNotify: (kind: "info" | "error", text: string) => void
}

function defaultDateRange() {
  const to = new Date()
  const from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

export function AdminAnalyticsTab({
  initialMetrics,
  onNotify,
}: AdminAnalyticsTabProps) {
  const [range] = useState(() => defaultDateRange())
  const [fromDate, setFromDate] = useState(range.from)
  const [toDate, setToDate] = useState(range.to)
  const [currency, setCurrency] = useState("USD")
  const [metrics, setMetrics] = useState<AdminSalesMetrics | null>(
    initialMetrics
  )
  const [loading, setLoading] = useState(false)

  const displayMetrics = metrics ?? initialMetrics

  async function handleRunQuery(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const next = await fetchAdminSalesAnalytics({
        from: fromDate || undefined,
        to: toDate || undefined,
        currency: currency || undefined,
      })
      setMetrics(next)
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to load sales analytics."
      )
    } finally {
      setLoading(false)
    }
  }

  const conversionPct = displayMetrics
    ? `${(Number(displayMetrics.checkoutConversionRate) * 100).toFixed(1)}%`
    : "0.0%"

  return (
    <section className="screen-line-bottom">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-4 sm:px-5">
        <div>
          <h2 className="text-base font-medium text-foreground">
            Sales analytics
          </h2>
          {displayMetrics && (
            <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
              {formatUtcShort(displayMetrics.periodStartUtc)} —{" "}
              {formatUtcShort(displayMetrics.periodEndUtc)}
            </p>
          )}
        </div>

        <form
          onSubmit={handleRunQuery}
          className="flex flex-wrap items-end gap-2 text-xs"
        >
          <label className="flex flex-col gap-1">
            <span className="font-medium text-muted-foreground">From</span>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-8 text-xs tabular-nums"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-muted-foreground">To</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-8 text-xs tabular-nums"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-muted-foreground">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </label>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="h-8 transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {loading && <Spinner className="size-3.5" aria-hidden />}
            <span>{loading ? "Loading..." : "Apply"}</span>
          </Button>
        </form>
      </div>

      {!displayMetrics ? (
        <div className="px-4 py-8 text-xs text-muted-foreground sm:px-5">
          Select a date range and click Apply to load sales metrics.
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          <div className="p-4 sm:px-5">
            <div className="text-xs text-muted-foreground">Gross received</div>
            <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
              {formatUsd(Number(displayMetrics.grossReceived))}
            </div>
          </div>
          <div className="p-4 sm:px-5">
            <div className="text-xs text-muted-foreground">
              Confirmed refunds
            </div>
            <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
              {formatUsd(Number(displayMetrics.confirmedRefunds))}
            </div>
          </div>
          <div className="p-4 sm:px-5">
            <div className="text-xs text-muted-foreground">Net receipts</div>
            <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
              {formatUsd(Number(displayMetrics.netReceipts))}
            </div>
          </div>
          <div className="p-4 sm:px-5">
            <div className="text-xs text-muted-foreground">
              Completed orders
            </div>
            <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
              {displayMetrics.completedOrders}
            </div>
          </div>
          <div className="p-4 sm:px-5">
            <div className="text-xs text-muted-foreground">Created orders</div>
            <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
              {displayMetrics.createdOrders}
            </div>
          </div>
          <div className="p-4 sm:px-5">
            <div className="text-xs text-muted-foreground">Conversion rate</div>
            <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
              {conversionPct}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

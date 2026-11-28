"use client"

import { cn } from "@/lib/utils"

import type { AdminDashboardSummary } from "../../admin-api"
import { formatUsd, formatUtcShort } from "../../types"

export function AdminMetrics({
  dashboard,
}: {
  dashboard: AdminDashboardSummary
}) {
  return (
    <section
      aria-label="Store metrics"
      className="screen-line-bottom grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0"
    >
      <div className="p-4 sm:px-5">
        <div className="text-xs text-muted-foreground">Today net sales</div>
        <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
          {formatUsd(Number(dashboard.todaySales.netReceipts))}
        </div>
      </div>

      <div className="p-4 sm:px-5">
        <div className="text-xs text-muted-foreground">Completed today</div>
        <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
          {dashboard.todaySales.completedOrders}
        </div>
      </div>

      <div className="p-4 sm:px-5">
        <div className="text-xs text-muted-foreground">Available stock</div>
        <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
          {dashboard.availableStock}
        </div>
        {dashboard.expiringStock > 0 && (
          <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            {dashboard.expiringStock} expiring within 7d
          </div>
        )}
      </div>

      <div className="p-4 sm:px-5">
        <div className="text-xs text-muted-foreground">Pending payments</div>
        <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
          {dashboard.pendingPayments}
        </div>
      </div>

      <div className="p-4 sm:px-5">
        <div className="text-xs text-muted-foreground">Needs review</div>
        <div
          className={cn(
            "mt-1 text-xl font-medium tracking-tight tabular-nums",
            dashboard.ordersRequiringReview > 0
              ? "text-destructive"
              : "text-foreground"
          )}
        >
          {dashboard.ordersRequiringReview}
        </div>
      </div>

      <div className="p-4 sm:px-5">
        <div className="text-xs text-muted-foreground">Payment quota</div>
        <div className="mt-1 text-xl font-medium tracking-tight text-foreground tabular-nums">
          {dashboard.paymentQuota.usedCount}/
          {dashboard.paymentQuota.configuredLimit}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          Resets {formatUtcShort(dashboard.paymentQuota.windowEnd)}
        </div>
      </div>
    </section>
  )
}

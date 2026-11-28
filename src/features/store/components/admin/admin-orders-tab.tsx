"use client"

import { Fragment, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
  fetchAdminOrderDetail,
  retryAdminOrderFulfillment,
  triggerDevOrderSucceed,
  type AdminOrderDetail,
  type AdminOrderSummary,
  type PageMeta,
} from "../../admin-api"
import { StorefrontApiError } from "../../api"
import { formatUsd, formatUtcDate, formatUtcShort } from "../../types"
import {
  AdminPagination,
  formatStatusLabel,
  statusToneClass,
} from "./admin-permissions"

const IS_DEV = process.env.NODE_ENV !== "production"

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PENDING_PAYMENT", label: "Pending payment" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REQUIRES_REVIEW", label: "Requires review" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const

interface AdminOrdersTabProps {
  orders: AdminOrderSummary[]
  meta: PageMeta
  statusFilter: string
  canRetryFulfillment: boolean
  loading: boolean
  onStatusFilterChange: (status: string) => void
  onPageChange: (page: number) => void
  onNotify: (kind: "info" | "error", text: string) => void
  onReload: () => Promise<void>
}

export function AdminOrdersTab({
  orders,
  meta,
  statusFilter,
  canRetryFulfillment,
  loading,
  onStatusFilterChange,
  onPageChange,
  onNotify,
  onReload,
}: AdminOrdersTabProps) {
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [detailsById, setDetailsById] = useState<
    Record<string, AdminOrderDetail>
  >({})
  const [retryOrderId, setRetryOrderId] = useState<string | null>(null)
  const [retryReason, setRetryReason] = useState(
    "Manual fulfillment retry after review"
  )

  async function toggleDetail(orderId: string) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
      return
    }
    setExpandedOrderId(orderId)
    if (detailsById[orderId]) return

    setPendingKey(`detail-${orderId}`)
    try {
      const detail = await fetchAdminOrderDetail(orderId)
      setDetailsById((prev) => ({ ...prev, [orderId]: detail }))
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to load order details."
      )
      setExpandedOrderId(null)
    } finally {
      setPendingKey(null)
    }
  }

  async function handleRetrySubmit(
    e: React.FormEvent,
    order: AdminOrderSummary
  ) {
    e.preventDefault()
    if (pendingKey) return
    setPendingKey(`retry-${order.id}`)
    try {
      const res = await retryAdminOrderFulfillment(
        order.id,
        retryReason.trim() || "Manual fulfillment retry"
      )
      setRetryOrderId(null)
      onNotify(
        "info",
        `Order ${order.orderNumber} status: ${formatStatusLabel(res.status)}.`
      )
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to retry fulfillment."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleDevMarkPaid(order: AdminOrderSummary) {
    if (pendingKey) return
    setPendingKey(`dev-pay-${order.id}`)
    try {
      const res = await triggerDevOrderSucceed(order.orderNumber)
      onNotify(
        "info",
        `Order ${order.orderNumber} simulated paid (${formatStatusLabel(res.orderStatus)}).`
      )
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Dev payment simulation failed."
      )
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <section className="screen-line-bottom">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-5">
        <h2 className="text-base font-medium text-foreground tabular-nums">
          Orders ({meta.totalElements})
        </h2>

        <select
          aria-label="Filter orders by status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-5">Order</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-muted-foreground sm:px-5"
                >
                  No orders match this filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const detailBusy = pendingKey === `detail-${order.id}`
                const devPayBusy = pendingKey === `dev-pay-${order.id}`
                const retryBusy = pendingKey === `retry-${order.id}`
                const isExpanded = expandedOrderId === order.id
                const detail = detailsById[order.id]

                return (
                  <Fragment key={order.id}>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground tabular-nums sm:px-5">
                        <div>{order.orderNumber}</div>
                        {order.reviewReason && (
                          <div className="text-destructive">
                            {order.reviewReason}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.maskedEmail}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground tabular-nums">
                        {formatUsd(Number(order.totalAmount))}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 font-medium",
                          statusToneClass(order.status)
                        )}
                      >
                        {formatStatusLabel(order.status)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {formatUtcShort(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            disabled={detailBusy}
                            onClick={() => void toggleDetail(order.id)}
                            className="transition-transform duration-150 ease-out active:scale-[0.97]"
                          >
                            {detailBusy && (
                              <Spinner className="size-3" aria-hidden />
                            )}
                            <span>{isExpanded ? "Hide" : "Inspect"}</span>
                          </Button>

                          {IS_DEV && order.status === "PENDING_PAYMENT" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              disabled={pendingKey !== null}
                              onClick={() => void handleDevMarkPaid(order)}
                              className="transition-transform duration-150 ease-out active:scale-[0.97]"
                            >
                              {devPayBusy && (
                                <Spinner className="size-3" aria-hidden />
                              )}
                              <span>Mark paid (Dev)</span>
                            </Button>
                          )}

                          {canRetryFulfillment &&
                            (order.status === "REQUIRES_REVIEW" ||
                              order.status === "PROCESSING") && (
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                disabled={pendingKey !== null}
                                onClick={() =>
                                  setRetryOrderId((prev) =>
                                    prev === order.id ? null : order.id
                                  )
                                }
                                className="transition-transform duration-150 ease-out active:scale-[0.97]"
                              >
                                Retry fulfillment
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>

                    {retryOrderId === order.id && (
                      <tr className="bg-surface">
                        <td colSpan={6} className="px-4 py-3 sm:px-5">
                          <form
                            onSubmit={(e) => void handleRetrySubmit(e, order)}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <Input
                              required
                              value={retryReason}
                              onChange={(e) => setRetryReason(e.target.value)}
                              placeholder="Reason for retry"
                              className="h-9 max-w-md bg-background text-xs"
                            />
                            <Button
                              type="submit"
                              size="xs"
                              disabled={retryBusy}
                              className="transition-transform duration-150 ease-out active:scale-[0.97]"
                            >
                              {retryBusy && (
                                <Spinner className="size-3" aria-hidden />
                              )}
                              <span>Confirm retry</span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              disabled={retryBusy}
                              onClick={() => setRetryOrderId(null)}
                            >
                              Cancel
                            </Button>
                          </form>
                        </td>
                      </tr>
                    )}

                    {isExpanded && (
                      <tr className="bg-surface">
                        <td colSpan={6} className="p-4 sm:px-5">
                          {!detail ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Spinner className="size-3.5" aria-hidden />
                              <span>Loading order details...</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div>
                                <div className="font-medium text-foreground">
                                  Line items ({detail.items.length})
                                </div>
                                <ul className="mt-2 divide-y divide-line border-t border-line">
                                  {detail.items.map((item) => (
                                    <li
                                      key={item.id}
                                      className="flex items-center justify-between gap-3 py-2"
                                    >
                                      <div>
                                        <div className="font-medium text-foreground">
                                          {item.productName}
                                        </div>
                                        <div className="text-muted-foreground tabular-nums">
                                          Offer {item.offerId.slice(0, 8)} ·
                                          Valid until{" "}
                                          {formatUtcDate(
                                            item.subscriptionExpiresAt
                                          )}
                                        </div>
                                      </div>
                                      <div className="font-medium text-foreground tabular-nums">
                                        {item.quantity} ×{" "}
                                        {formatUsd(Number(item.unitPrice))}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <div className="font-medium text-foreground">
                                  Payment attempts ({detail.payments.length})
                                </div>
                                {detail.payments.length === 0 ? (
                                  <p className="mt-2 text-muted-foreground">
                                    No payment attempts created for this order.
                                  </p>
                                ) : (
                                  <ul className="mt-2 divide-y divide-line border-t border-line">
                                    {detail.payments.map((p) => (
                                      <li
                                        key={p.id}
                                        className="flex items-center justify-between gap-3 py-2"
                                      >
                                        <div>
                                          <div className="font-medium text-foreground tabular-nums">
                                            {p.merchantTransactionId}
                                          </div>
                                          <div className="text-muted-foreground tabular-nums">
                                            {p.provider}
                                            {p.bankReference
                                              ? ` · Ref ${p.bankReference}`
                                              : ""}
                                          </div>
                                        </div>
                                        <div className="text-right tabular-nums">
                                          <div
                                            className={cn(
                                              "font-medium",
                                              statusToneClass(p.status)
                                            )}
                                          >
                                            {formatStatusLabel(p.status)}
                                          </div>
                                          <div className="text-muted-foreground">
                                            {formatUsd(Number(p.amount))}
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        meta={meta}
        disabled={loading}
        onPageChange={onPageChange}
      />
    </section>
  )
}

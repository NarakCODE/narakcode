"use client"

import { Fragment, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
  reconcileAdminPayment,
  refundAdminPayment,
  type AdminPaymentSummary,
  type PageMeta,
} from "../../admin-api"
import { StorefrontApiError } from "../../api"
import { formatUsd, formatUtcShort } from "../../types"
import {
  AdminPagination,
  formatStatusLabel,
  statusToneClass,
} from "./admin-permissions"

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "CREATED", label: "Created" },
  { value: "PENDING", label: "Pending" },
  { value: "VERIFYING", label: "Verifying" },
  { value: "PAID", label: "Paid" },
  { value: "EXPIRED", label: "Expired" },
  { value: "FAILED", label: "Failed" },
  { value: "PARTIALLY_REFUNDED", label: "Partially refunded" },
  { value: "REFUNDED", label: "Refunded" },
] as const

interface AdminPaymentsTabProps {
  payments: AdminPaymentSummary[]
  meta: PageMeta
  statusFilter: string
  canRefund: boolean
  loading: boolean
  onStatusFilterChange: (status: string) => void
  onPageChange: (page: number) => void
  onNotify: (kind: "info" | "error", text: string) => void
  onReload: () => Promise<void>
}

export function AdminPaymentsTab({
  payments,
  meta,
  statusFilter,
  canRefund,
  loading,
  onStatusFilterChange,
  onPageChange,
  onNotify,
  onReload,
}: AdminPaymentsTabProps) {
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [refundPaymentId, setRefundPaymentId] = useState<string | null>(null)
  const [refundAmount, setRefundAmount] = useState("")
  const [refundReason, setRefundReason] = useState("")

  async function handleReconcile(payment: AdminPaymentSummary) {
    if (pendingKey) return
    setPendingKey(`reconcile-${payment.id}`)
    try {
      await reconcileAdminPayment(
        payment.id,
        "Manual reconciliation from admin dashboard"
      )
      onNotify(
        "info",
        `Reconciliation queued for ${payment.merchantTransactionId}.`
      )
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to queue reconciliation."
      )
    } finally {
      setPendingKey(null)
    }
  }

  function openRefundForm(payment: AdminPaymentSummary) {
    if (refundPaymentId === payment.id) {
      setRefundPaymentId(null)
      return
    }
    setRefundPaymentId(payment.id)
    setRefundAmount(payment.receivedAmount ?? payment.amount)
    setRefundReason("")
  }

  async function handleRefundSubmit(
    e: React.FormEvent,
    payment: AdminPaymentSummary
  ) {
    e.preventDefault()
    if (pendingKey) return
    setPendingKey(`refund-${payment.id}`)
    try {
      const refund = await refundAdminPayment(payment.id, {
        amount: refundAmount.trim(),
        reason: refundReason.trim(),
      })
      setRefundPaymentId(null)
      onNotify(
        "info",
        `Refund ${refund.merchantRefundId} recorded (${formatStatusLabel(refund.status)}).`
      )
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to initiate refund."
      )
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <section className="screen-line-bottom">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-5">
        <h2 className="text-base font-medium text-foreground tabular-nums">
          Payments ({meta.totalElements})
        </h2>

        <select
          aria-label="Filter payments by status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
        >
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
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
              <th className="px-4 py-3 font-medium sm:px-5">Transaction</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-muted-foreground sm:px-5"
                >
                  No payments match this filter.
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const reconcileBusy = pendingKey === `reconcile-${payment.id}`
                const refundBusy = pendingKey === `refund-${payment.id}`
                const isRefundable =
                  canRefund &&
                  (payment.status === "PAID" ||
                    payment.status === "PARTIALLY_REFUNDED")

                return (
                  <Fragment key={payment.id}>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground tabular-nums sm:px-5">
                        <div>{payment.merchantTransactionId}</div>
                        {payment.bankReference && (
                          <div className="text-muted-foreground">
                            Ref {payment.bankReference}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {payment.provider}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground tabular-nums">
                        {formatUsd(Number(payment.amount))}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 font-medium",
                          statusToneClass(payment.status)
                        )}
                      >
                        {formatStatusLabel(payment.status)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {formatUtcShort(payment.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            disabled={pendingKey !== null}
                            onClick={() => void handleReconcile(payment)}
                            className="transition-transform duration-150 ease-out active:scale-[0.97]"
                          >
                            {reconcileBusy && (
                              <Spinner className="size-3" aria-hidden />
                            )}
                            <span>Reconcile</span>
                          </Button>

                          {isRefundable && (
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              disabled={pendingKey !== null}
                              onClick={() => openRefundForm(payment)}
                              className="text-destructive transition-transform duration-150 ease-out active:scale-[0.97]"
                            >
                              {refundPaymentId === payment.id
                                ? "Close"
                                : "Refund"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {refundPaymentId === payment.id && (
                      <tr className="bg-surface">
                        <td colSpan={6} className="px-4 py-3 sm:px-5">
                          <form
                            onSubmit={(e) =>
                              void handleRefundSubmit(e, payment)
                            }
                            className="flex flex-wrap items-end gap-3"
                          >
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Refund amount ({payment.currency})
                              </span>
                              <Input
                                required
                                value={refundAmount}
                                onChange={(e) =>
                                  setRefundAmount(e.target.value)
                                }
                                className="h-9 w-36 bg-background tabular-nums"
                              />
                            </label>
                            <label className="flex flex-1 flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Reason
                              </span>
                              <Input
                                required
                                value={refundReason}
                                onChange={(e) =>
                                  setRefundReason(e.target.value)
                                }
                                placeholder="Customer requested refund"
                                className="h-9 min-w-52 bg-background"
                              />
                            </label>
                            <Button
                              type="submit"
                              variant="destructive"
                              size="xs"
                              disabled={refundBusy}
                              className="h-9 transition-transform duration-150 ease-out active:scale-[0.97]"
                            >
                              {refundBusy && (
                                <Spinner className="size-3" aria-hidden />
                              )}
                              <span>
                                {refundBusy
                                  ? "Processing..."
                                  : "Confirm refund"}
                              </span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              disabled={refundBusy}
                              onClick={() => setRefundPaymentId(null)}
                              className="h-9"
                            >
                              Cancel
                            </Button>
                          </form>
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

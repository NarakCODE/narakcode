"use client"

import { cn } from "@/lib/utils"

import type { AdminRefund, PageMeta } from "../../admin-api"
import { formatUsd, formatUtcShort } from "../../types"
import {
  AdminPagination,
  formatStatusLabel,
  statusToneClass,
} from "./admin-permissions"

interface AdminRefundsTabProps {
  refunds: AdminRefund[]
  meta: PageMeta
  loading: boolean
  onPageChange: (page: number) => void
}

export function AdminRefundsTab({
  refunds,
  meta,
  loading,
  onPageChange,
}: AdminRefundsTabProps) {
  return (
    <section className="screen-line-bottom">
      <div className="border-b border-line p-4 sm:px-5">
        <h2 className="text-base font-medium text-foreground tabular-nums">
          Refunds ({meta.totalElements})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-5">Refund ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium sm:px-5">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {refunds.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-muted-foreground sm:px-5"
                >
                  No refunds recorded.
                </td>
              </tr>
            ) : (
              refunds.map((refund) => (
                <tr key={refund.id}>
                  <td className="px-4 py-3 font-medium text-foreground tabular-nums sm:px-5">
                    <div>{refund.merchantRefundId}</div>
                    {refund.providerReference && (
                      <div className="text-muted-foreground">
                        Ref {refund.providerReference}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground tabular-nums">
                    {formatUsd(Number(refund.amount))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {refund.reason}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 font-medium",
                      statusToneClass(refund.status)
                    )}
                  >
                    {formatStatusLabel(refund.status)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums sm:px-5">
                    {formatUtcShort(refund.createdAt)}
                  </td>
                </tr>
              ))
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

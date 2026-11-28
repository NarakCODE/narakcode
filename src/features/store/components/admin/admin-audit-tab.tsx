"use client"

import { Fragment, useState } from "react"

import { Button } from "@/components/ui/button"

import type { AdminAuditLog, PageMeta } from "../../admin-api"
import { formatUtcShort } from "../../types"
import { AdminPagination, formatStatusLabel } from "./admin-permissions"

interface AdminAuditTabProps {
  logs: AdminAuditLog[]
  meta: PageMeta
  loading: boolean
  onPageChange: (page: number) => void
}

export function AdminAuditTab({
  logs,
  meta,
  loading,
  onPageChange,
}: AdminAuditTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section className="screen-line-bottom">
      <div className="border-b border-line p-4 sm:px-5">
        <h2 className="text-base font-medium text-foreground tabular-nums">
          Audit logs ({meta.totalElements})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-5">Action</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Entity</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 text-right font-medium sm:px-5">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-muted-foreground sm:px-5"
                >
                  No audit events recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const hasMeta =
                  log.metadataRedacted !== null &&
                  Object.keys(log.metadataRedacted).length > 0
                const isExpanded = expandedId === log.id

                return (
                  <Fragment key={log.id}>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground sm:px-5">
                        {formatStatusLabel(log.action)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatStatusLabel(log.actorType)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {formatStatusLabel(log.entityType)}
                        {log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ""}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {formatUtcShort(log.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        {hasMeta ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() =>
                              setExpandedId((prev) =>
                                prev === log.id ? null : log.id
                              )
                            }
                            className="transition-transform duration-150 ease-out active:scale-[0.97]"
                          >
                            {isExpanded ? "Hide" : "Metadata"}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>

                    {isExpanded && log.metadataRedacted && (
                      <tr className="bg-surface">
                        <td colSpan={5} className="px-4 py-3 sm:px-5">
                          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
                            {Object.entries(log.metadataRedacted).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <dt className="text-muted-foreground">
                                    {key}
                                  </dt>
                                  <dd className="font-medium break-all text-foreground tabular-nums">
                                    {typeof value === "string"
                                      ? value
                                      : JSON.stringify(value)}
                                  </dd>
                                </div>
                              )
                            )}
                          </dl>
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

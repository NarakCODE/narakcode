import { Button } from "@/components/ui/button"

import type { PageMeta } from "../../admin-api"

export type AdminTab =
  | "inventory"
  | "orders"
  | "payments"
  | "refunds"
  | "catalog"
  | "analytics"
  | "audit"

export interface AdminPermissions {
  canReadInventory: boolean
  canWriteCatalogInventory: boolean
  canReadOrders: boolean
  canRetryFulfillment: boolean
  canReadPayments: boolean
  canRefundPayments: boolean
  canReadRefunds: boolean
  canReadAnalytics: boolean
  canReadAuditLogs: boolean
}

export function getAdminPermissions(role: string): AdminPermissions {
  const r = role.toUpperCase()
  return {
    canReadInventory:
      r === "OWNER" || r === "INVENTORY_MANAGER" || r === "SUPPORT",
    canWriteCatalogInventory: r === "OWNER" || r === "INVENTORY_MANAGER",
    canReadOrders: r === "OWNER" || r === "SUPPORT" || r === "FINANCE",
    canRetryFulfillment: r === "OWNER" || r === "SUPPORT",
    canReadPayments: r === "OWNER" || r === "FINANCE" || r === "SUPPORT",
    canRefundPayments: r === "OWNER" || r === "FINANCE",
    canReadRefunds: r === "OWNER" || r === "FINANCE",
    canReadAnalytics: r === "OWNER" || r === "FINANCE" || r === "VIEWER",
    canReadAuditLogs: r === "OWNER" || r === "FINANCE" || r === "SUPPORT",
  }
}

export function getVisibleAdminTabs(
  perms: AdminPermissions
): ReadonlyArray<{ id: AdminTab; label: string }> {
  const tabs: Array<{ id: AdminTab; label: string }> = []
  if (perms.canReadInventory) tabs.push({ id: "inventory", label: "Inventory" })
  if (perms.canReadOrders) tabs.push({ id: "orders", label: "Orders" })
  if (perms.canReadPayments) tabs.push({ id: "payments", label: "Payments" })
  if (perms.canReadRefunds) tabs.push({ id: "refunds", label: "Refunds" })
  tabs.push({ id: "catalog", label: "Catalog" })
  if (perms.canReadAnalytics) tabs.push({ id: "analytics", label: "Analytics" })
  if (perms.canReadAuditLogs) tabs.push({ id: "audit", label: "Audit logs" })
  return tabs
}

export function formatStatusLabel(raw: string): string {
  const lower = raw.toLowerCase().replaceAll("_", " ")
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export function statusToneClass(status: string): string {
  switch (status) {
    case "AVAILABLE":
    case "COMPLETED":
    case "PAID":
    case "ACTIVE":
    case "CONFIRMED":
      return "text-success"
    case "REQUIRES_REVIEW":
    case "FAILED":
    case "EXPIRED":
    case "CANCELLED":
    case "DISABLED":
    case "ARCHIVED":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}

export function AdminPagination({
  meta,
  disabled,
  onPageChange,
}: {
  meta: PageMeta
  disabled?: boolean
  onPageChange: (nextPage: number) => void
}) {
  if (meta.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs sm:px-5">
      <span className="text-muted-foreground tabular-nums">
        Page {meta.page + 1} of {meta.totalPages} ({meta.totalElements} total)
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={disabled || meta.page <= 0}
          onClick={() => onPageChange(meta.page - 1)}
          className="transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={disabled || meta.page + 1 >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

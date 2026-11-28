"use client"

import { Fragment, useMemo, useState } from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
  createAdminInventory,
  deleteAdminInventory,
  updateAdminInventory,
  type AdminDeliveryType,
  type AdminInventoryUnit,
  type AdminProduct,
  type PageMeta,
} from "../../admin-api"
import { StorefrontApiError } from "../../api"
import { formatUsd, formatUtcDate } from "../../types"
import {
  AdminPagination,
  formatStatusLabel,
  statusToneClass,
} from "./admin-permissions"

interface AdminInventoryTabProps {
  units: AdminInventoryUnit[]
  meta: PageMeta
  products: AdminProduct[]
  statusFilter: string
  canWrite: boolean
  loading: boolean
  onStatusFilterChange: (status: string) => void
  onPageChange: (page: number) => void
  onNotify: (kind: "info" | "error", text: string) => void
  onReload: () => Promise<void>
}

const INVENTORY_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
  { value: "DISABLED", label: "Disabled" },
  { value: "EXPIRED", label: "Expired" },
] as const

export function AdminInventoryTab({
  units,
  meta,
  products,
  statusFilter,
  canWrite,
  loading,
  onStatusFilterChange,
  onPageChange,
  onNotify,
  onReload,
}: AdminInventoryTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Add form state
  const [productId, setProductId] = useState(() => products[0]?.id ?? "")
  const [deliveryType, setDeliveryType] =
    useState<AdminDeliveryType>("ACTIVATION_CODE")
  const [code, setCode] = useState("")
  const [redeemUrl, setRedeemUrl] = useState("https://example.com/redeem")
  const [accountEmail, setAccountEmail] = useState("")
  const [accountPassword, setAccountPassword] = useState("")
  const [loginUrl, setLoginUrl] = useState("https://accounts.google.com")
  const [costPrice, setCostPrice] = useState("10.00")
  const [sellingPrice, setSellingPrice] = useState("15.00")
  const [validityDays, setValidityDays] = useState("30")
  const [authRef, setAuthRef] = useState("ADMIN-PORTAL")

  // Inline edit state
  const [editCostPrice, setEditCostPrice] = useState("")
  const [editSellingPrice, setEditSellingPrice] = useState("")
  const [editExpiresDate, setEditExpiresDate] = useState("")
  const [editAuthRef, setEditAuthRef] = useState("")
  const [editStatus, setEditStatus] = useState<"AVAILABLE" | "DISABLED">(
    "AVAILABLE"
  )
  const [editReason, setEditReason] = useState("")

  const effectiveProductId = productId || products[0]?.id || ""

  const productNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of products) {
      map.set(p.id, p.name)
    }
    return map
  }, [products])

  function startEdit(unit: AdminInventoryUnit) {
    setConfirmDeleteId(null)
    if (editingId === unit.id) {
      setEditingId(null)
      return
    }
    setEditingId(unit.id)
    setEditCostPrice(unit.costPrice)
    setEditSellingPrice(unit.sellingPrice)
    setEditExpiresDate(formatUtcDate(unit.expiresAt))
    setEditAuthRef(unit.authorizationReference ?? "")
    setEditStatus(unit.status === "DISABLED" ? "DISABLED" : "AVAILABLE")
    setEditReason("")
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (pendingKey || !effectiveProductId) return
    setPendingKey("create")
    try {
      const days = Math.max(1, Number.parseInt(validityDays, 10) || 30)
      const now = new Date()
      const expiresAt = new Date(
        now.getTime() + days * 24 * 60 * 60 * 1000
      ).toISOString()

      const secretPayload: Record<string, string> =
        deliveryType === "ACTIVATION_CODE"
          ? { activationCode: code.trim(), redeemUrl: redeemUrl.trim() }
          : deliveryType === "AUTHORIZED_ACCOUNT"
            ? {
                accountEmail: accountEmail.trim(),
                password: accountPassword,
                loginUrl: loginUrl.trim(),
              }
            : { inviteUrl: redeemUrl.trim(), activationCode: code.trim() }

      await createAdminInventory({
        productId: effectiveProductId,
        deliveryType,
        deliverySecretPayload: secretPayload,
        costPrice: costPrice.trim(),
        sellingPrice: sellingPrice.trim(),
        currency: "USD",
        activatedAt: now.toISOString(),
        expiresAt,
        authorizationReference: authRef.trim() || undefined,
      })

      setCode("")
      setAccountEmail("")
      setAccountPassword("")
      setShowAddForm(false)
      onNotify("info", "Inventory unit encrypted and added.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Could not create inventory unit."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleSaveEdit(e: React.FormEvent, unitId: string) {
    e.preventDefault()
    if (pendingKey) return
    setPendingKey(`edit-${unitId}`)
    try {
      const expiresAt = editExpiresDate
        ? `${editExpiresDate}T23:59:59.000Z`
        : undefined
      await updateAdminInventory(unitId, {
        costPrice: editCostPrice.trim(),
        sellingPrice: editSellingPrice.trim(),
        expiresAt,
        authorizationReference: editAuthRef.trim() || undefined,
        status: editStatus,
        reason: editReason.trim() || "Admin inline edit",
      })
      setEditingId(null)
      onNotify("info", "Inventory unit updated.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to update inventory unit."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleDelete(unitId: string) {
    if (pendingKey) return
    setPendingKey(`delete-${unitId}`)
    try {
      await deleteAdminInventory(unitId)
      setConfirmDeleteId(null)
      if (editingId === unitId) setEditingId(null)
      onNotify("info", "Inventory unit deleted.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Unable to delete inventory unit."
      )
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <section className="screen-line-bottom">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-5">
        <div>
          <h2 className="text-base font-medium text-foreground tabular-nums">
            Encrypted inventory ({meta.totalElements})
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Secrets are encrypted with AES-256-GCM on save and never returned in
            list responses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter inventory by status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
          >
            {INVENTORY_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {canWrite && (
            <Button
              type="button"
              size="sm"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <PlusIcon className="size-3.5" aria-hidden />
              <span>{showAddForm ? "Close form" : "Add inventory"}</span>
            </Button>
          )}
        </div>
      </div>

      {showAddForm && canWrite && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 border-b border-line bg-surface px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-3"
        >
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">Product</span>
            <select
              value={effectiveProductId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">Delivery type</span>
            <select
              value={deliveryType}
              onChange={(e) =>
                setDeliveryType(e.target.value as AdminDeliveryType)
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="ACTIVATION_CODE">Activation code</option>
              <option value="AUTHORIZED_ACCOUNT">Authorized account</option>
              <option value="PROVIDER_INVITE">Provider invite</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">Validity (days)</span>
            <Input
              type="number"
              min={2}
              max={365}
              required
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              className="h-10 tabular-nums"
            />
          </label>

          {deliveryType === "AUTHORIZED_ACCOUNT" ? (
            <>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">
                  Account email
                </span>
                <Input
                  type="email"
                  required
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="account@gmail.com"
                  className="h-10"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">
                  Account password
                </span>
                <Input
                  type="text"
                  required
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="Secret password"
                  className="h-10"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">Login URL</span>
                <Input
                  type="url"
                  required
                  value={loginUrl}
                  onChange={(e) => setLoginUrl(e.target.value)}
                  className="h-10"
                />
              </label>
            </>
          ) : (
            <>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">
                  Activation code
                </span>
                <Input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="CODE-XXXX-XXXX"
                  className="h-10 tabular-nums"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs sm:col-span-2">
                <span className="font-medium text-foreground">Redeem URL</span>
                <Input
                  type="url"
                  required
                  value={redeemUrl}
                  onChange={(e) => setRedeemUrl(e.target.value)}
                  className="h-10"
                />
              </label>
            </>
          )}

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">
              Cost price (USD)
            </span>
            <Input
              type="text"
              required
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="h-10 tabular-nums"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">
              Selling price (USD)
            </span>
            <Input
              type="text"
              required
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="h-10 tabular-nums"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">
              Authorization reference
            </span>
            <Input
              type="text"
              value={authRef}
              onChange={(e) => setAuthRef(e.target.value)}
              className="h-10"
            />
          </label>

          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button
              type="submit"
              size="sm"
              disabled={pendingKey === "create"}
              className="transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              {pendingKey === "create" && (
                <Spinner className="size-3.5" aria-hidden />
              )}
              <span>
                {pendingKey === "create"
                  ? "Encrypting & saving..."
                  : "Save inventory unit"}
              </span>
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-5">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price / Cost</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {units.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-muted-foreground sm:px-5"
                >
                  No inventory units match this filter.
                </td>
              </tr>
            ) : (
              units.map((unit) => {
                const isMutable =
                  canWrite &&
                  unit.status !== "SOLD" &&
                  unit.status !== "RESERVED"
                const isEditing = editingId === unit.id
                const isConfirmingDelete = confirmDeleteId === unit.id
                const deleteBusy = pendingKey === `delete-${unit.id}`
                const saveBusy = pendingKey === `edit-${unit.id}`

                return (
                  <Fragment key={unit.id}>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground sm:px-5">
                        <div>
                          {productNameById.get(unit.productId) ??
                            unit.productId.slice(0, 8)}
                        </div>
                        <div className="text-muted-foreground tabular-nums">
                          Offer {unit.publicOfferId.slice(0, 8)}
                          {unit.authorizationReference
                            ? ` · ${unit.authorizationReference}`
                            : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatStatusLabel(unit.deliveryType)}
                      </td>
                      <td className="px-4 py-3 text-foreground tabular-nums">
                        {formatUsd(Number(unit.sellingPrice))}{" "}
                        <span className="text-muted-foreground">
                          / {formatUsd(Number(unit.costPrice))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {formatUtcDate(unit.expiresAt)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 font-medium",
                          statusToneClass(unit.status)
                        )}
                      >
                        {formatStatusLabel(unit.status)}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        {isMutable ? (
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {isConfirmingDelete ? (
                              <>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="xs"
                                  disabled={pendingKey !== null}
                                  onClick={() => void handleDelete(unit.id)}
                                  className="transition-transform duration-150 ease-out active:scale-[0.97]"
                                >
                                  {deleteBusy && (
                                    <Spinner className="size-3" aria-hidden />
                                  )}
                                  <span>
                                    {deleteBusy
                                      ? "Deleting..."
                                      : "Confirm delete"}
                                  </span>
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="xs"
                                  disabled={pendingKey !== null}
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="transition-transform duration-150 ease-out active:scale-[0.97]"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="xs"
                                  disabled={pendingKey !== null}
                                  onClick={() => startEdit(unit)}
                                  className="transition-transform duration-150 ease-out active:scale-[0.97]"
                                >
                                  {isEditing ? "Close" : "Edit"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="xs"
                                  disabled={pendingKey !== null}
                                  onClick={() => {
                                    setEditingId(null)
                                    setConfirmDeleteId(unit.id)
                                  }}
                                  className="text-destructive transition-transform duration-150 ease-out active:scale-[0.97]"
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>

                    {isEditing && (
                      <tr className="bg-surface">
                        <td colSpan={6} className="p-4 sm:px-5">
                          <form
                            onSubmit={(e) => void handleSaveEdit(e, unit.id)}
                            className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6"
                          >
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Selling price
                              </span>
                              <Input
                                required
                                value={editSellingPrice}
                                onChange={(e) =>
                                  setEditSellingPrice(e.target.value)
                                }
                                className="h-9 bg-background tabular-nums"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Cost price
                              </span>
                              <Input
                                required
                                value={editCostPrice}
                                onChange={(e) =>
                                  setEditCostPrice(e.target.value)
                                }
                                className="h-9 bg-background tabular-nums"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Expires (UTC)
                              </span>
                              <Input
                                type="date"
                                required
                                value={editExpiresDate}
                                onChange={(e) =>
                                  setEditExpiresDate(e.target.value)
                                }
                                className="h-9 bg-background tabular-nums"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Status
                              </span>
                              <select
                                value={editStatus}
                                onChange={(e) =>
                                  setEditStatus(
                                    e.target.value as "AVAILABLE" | "DISABLED"
                                  )
                                }
                                className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                              >
                                <option value="AVAILABLE">Available</option>
                                <option value="DISABLED">Disabled</option>
                              </select>
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Auth reference
                              </span>
                              <Input
                                value={editAuthRef}
                                onChange={(e) => setEditAuthRef(e.target.value)}
                                className="h-9 bg-background"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                              <span className="font-medium text-foreground">
                                Reason
                              </span>
                              <Input
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                placeholder="Optional audit note"
                                className="h-9 bg-background"
                              />
                            </label>
                            <div className="flex items-center gap-2 sm:col-span-3 lg:col-span-6">
                              <Button
                                type="submit"
                                size="xs"
                                disabled={saveBusy}
                                className="transition-transform duration-150 ease-out active:scale-[0.97]"
                              >
                                {saveBusy && (
                                  <Spinner className="size-3" aria-hidden />
                                )}
                                <span>
                                  {saveBusy ? "Saving..." : "Save changes"}
                                </span>
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                disabled={saveBusy}
                                onClick={() => setEditingId(null)}
                                className="transition-transform duration-150 ease-out active:scale-[0.97]"
                              >
                                Cancel
                              </Button>
                            </div>
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

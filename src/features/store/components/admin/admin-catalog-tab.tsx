"use client"

import { Fragment, useState } from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
  archiveAdminProduct,
  createAdminCategory,
  createAdminProduct,
  updateAdminCategory,
  updateAdminProduct,
  type AdminCategory,
  type AdminProduct,
  type AdminProductStatus,
  type PageMeta,
} from "../../admin-api"
import { StorefrontApiError } from "../../api"
import { formatUsd } from "../../types"
import {
  AdminPagination,
  formatStatusLabel,
  statusToneClass,
} from "./admin-permissions"

interface AdminCatalogTabProps {
  categories: AdminCategory[]
  products: AdminProduct[]
  productsMeta: PageMeta
  canWrite: boolean
  loading: boolean
  onProductsPageChange: (page: number) => void
  onNotify: (kind: "info" | "error", text: string) => void
  onReload: () => Promise<void>
}

export function AdminCatalogTab({
  categories,
  products,
  productsMeta,
  canWrite,
  loading,
  onProductsPageChange,
  onNotify,
  onReload,
}: AdminCatalogTabProps) {
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)

  // New category form
  const [catName, setCatName] = useState("")
  const [catSlug, setCatSlug] = useState("")
  const [catDescription, setCatDescription] = useState("")

  // Edit category inline
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editCatName, setEditCatName] = useState("")
  const [editCatSlug, setEditCatSlug] = useState("")
  const [editCatDesc, setEditCatDesc] = useState("")
  const [editCatActive, setEditCatActive] = useState(true)

  // New product form
  const [prodCategoryId, setProdCategoryId] = useState(
    () => categories[0]?.id ?? ""
  )
  const [prodName, setProdName] = useState("")
  const [prodSlug, setProdSlug] = useState("")
  const [prodDescription, setProdDescription] = useState("")
  const [prodBasePrice, setProdBasePrice] = useState("15.00")
  const [prodStatus, setProdStatus] = useState<AdminProductStatus>("ACTIVE")

  // Edit product inline
  const [editingProdId, setEditingProdId] = useState<string | null>(null)
  const [editProdCategoryId, setEditProdCategoryId] = useState("")
  const [editProdName, setEditProdName] = useState("")
  const [editProdSlug, setEditProdSlug] = useState("")
  const [editProdDesc, setEditProdDesc] = useState("")
  const [editProdPrice, setEditProdPrice] = useState("")
  const [editProdStatus, setEditProdStatus] =
    useState<AdminProductStatus>("ACTIVE")
  const [confirmArchiveProdId, setConfirmArchiveProdId] = useState<
    string | null
  >(null)

  const effectiveProdCatId = prodCategoryId || categories[0]?.id || ""

  function startEditCategory(cat: AdminCategory) {
    if (editingCatId === cat.id) {
      setEditingCatId(null)
      return
    }
    setEditingCatId(cat.id)
    setEditCatName(cat.name)
    setEditCatSlug(cat.slug)
    setEditCatDesc(cat.description ?? "")
    setEditCatActive(cat.active)
  }

  function startEditProduct(prod: AdminProduct) {
    setConfirmArchiveProdId(null)
    if (editingProdId === prod.id) {
      setEditingProdId(null)
      return
    }
    setEditingProdId(prod.id)
    setEditProdCategoryId(prod.categoryId)
    setEditProdName(prod.name)
    setEditProdSlug(prod.slug)
    setEditProdDesc(prod.description)
    setEditProdPrice(prod.basePrice ?? "")
    setEditProdStatus(prod.status)
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    if (pendingKey) return
    setPendingKey("create-category")
    try {
      await createAdminCategory({
        name: catName.trim(),
        slug: catSlug.trim(),
        description: catDescription.trim() || undefined,
        active: true,
      })
      setCatName("")
      setCatSlug("")
      setCatDescription("")
      setShowAddCategory(false)
      onNotify("info", "Category created.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Could not create category."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleSaveCategory(e: React.FormEvent, id: string) {
    e.preventDefault()
    if (pendingKey) return
    setPendingKey(`edit-cat-${id}`)
    try {
      await updateAdminCategory(id, {
        name: editCatName.trim(),
        slug: editCatSlug.trim(),
        description: editCatDesc.trim() || undefined,
        active: editCatActive,
      })
      setEditingCatId(null)
      onNotify("info", "Category updated.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Could not update category."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (pendingKey || !effectiveProdCatId) return
    setPendingKey("create-product")
    try {
      await createAdminProduct({
        categoryId: effectiveProdCatId,
        name: prodName.trim(),
        slug: prodSlug.trim(),
        description: prodDescription.trim(),
        status: prodStatus,
        currency: "USD",
        basePrice: prodBasePrice.trim() || undefined,
      })
      setProdName("")
      setProdSlug("")
      setProdDescription("")
      setShowAddProduct(false)
      onNotify("info", "Product created.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Could not create product."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleSaveProduct(e: React.FormEvent, id: string) {
    e.preventDefault()
    if (pendingKey) return
    setPendingKey(`edit-prod-${id}`)
    try {
      await updateAdminProduct(id, {
        categoryId: editProdCategoryId,
        name: editProdName.trim(),
        slug: editProdSlug.trim(),
        description: editProdDesc.trim(),
        status: editProdStatus,
        basePrice: editProdPrice.trim() || undefined,
      })
      setEditingProdId(null)
      onNotify("info", "Product updated.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Could not update product."
      )
    } finally {
      setPendingKey(null)
    }
  }

  async function handleArchiveProduct(id: string) {
    if (pendingKey) return
    setPendingKey(`archive-prod-${id}`)
    try {
      await archiveAdminProduct(id)
      setConfirmArchiveProdId(null)
      if (editingProdId === id) setEditingProdId(null)
      onNotify("info", "Product archived.")
      await onReload()
    } catch (err) {
      onNotify(
        "error",
        err instanceof StorefrontApiError
          ? err.message
          : "Could not archive product."
      )
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <section className="screen-line-bottom divide-y divide-line">
      {/* Categories */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-5">
          <h2 className="text-base font-medium text-foreground tabular-nums">
            Categories ({categories.length})
          </h2>
          {canWrite && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddCategory((prev) => !prev)}
              className="transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <PlusIcon className="size-3.5" aria-hidden />
              <span>{showAddCategory ? "Close form" : "New category"}</span>
            </Button>
          )}
        </div>

        {showAddCategory && canWrite && (
          <form
            onSubmit={handleCreateCategory}
            className="grid grid-cols-1 gap-4 border-b border-line bg-surface px-4 py-5 sm:grid-cols-3 sm:px-5"
          >
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Name</span>
              <Input
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="AI subscriptions"
                className="h-10 bg-background"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Slug</span>
              <Input
                required
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                placeholder="ai-subscriptions"
                className="h-10 bg-background"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Description</span>
              <Input
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="Optional summary"
                className="h-10 bg-background"
              />
            </label>
            <div className="sm:col-span-3">
              <Button
                type="submit"
                size="sm"
                disabled={pendingKey === "create-category"}
                className="transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                {pendingKey === "create-category" && (
                  <Spinner className="size-3.5" aria-hidden />
                )}
                <span>Save category</span>
              </Button>
            </div>
          </form>
        )}

        <ul className="divide-y divide-line text-xs">
          {categories.map((cat) => {
            const isEditing = editingCatId === cat.id
            const saveBusy = pendingKey === `edit-cat-${cat.id}`

            return (
              <li key={cat.id}>
                <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                  <div>
                    <div className="font-medium text-foreground">
                      {cat.name}
                    </div>
                    <div className="text-muted-foreground">
                      {cat.slug}
                      {cat.description ? ` · ${cat.description}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-medium",
                        cat.active ? "text-success" : "text-muted-foreground"
                      )}
                    >
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                    {canWrite && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={pendingKey !== null}
                        onClick={() => startEditCategory(cat)}
                        className="transition-transform duration-150 ease-out active:scale-[0.97]"
                      >
                        {isEditing ? "Close" : "Edit"}
                      </Button>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <form
                    onSubmit={(e) => void handleSaveCategory(e, cat.id)}
                    className="grid grid-cols-1 gap-3 border-t border-line bg-surface p-4 sm:grid-cols-4 sm:px-5"
                  >
                    <label className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-foreground">Name</span>
                      <Input
                        required
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-foreground">Slug</span>
                      <Input
                        required
                        value={editCatSlug}
                        onChange={(e) => setEditCatSlug(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-foreground">
                        Description
                      </span>
                      <Input
                        value={editCatDesc}
                        onChange={(e) => setEditCatDesc(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-foreground">
                        Visibility
                      </span>
                      <select
                        value={editCatActive ? "active" : "inactive"}
                        onChange={(e) =>
                          setEditCatActive(e.target.value === "active")
                        }
                        className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                    <div className="flex items-center gap-2 sm:col-span-4">
                      <Button
                        type="submit"
                        size="xs"
                        disabled={saveBusy}
                        className="transition-transform duration-150 ease-out active:scale-[0.97]"
                      >
                        {saveBusy && <Spinner className="size-3" aria-hidden />}
                        <span>Save category</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={saveBusy}
                        onClick={() => setEditingCatId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Products */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-5">
          <h2 className="text-base font-medium text-foreground tabular-nums">
            Products ({productsMeta.totalElements})
          </h2>
          {canWrite && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddProduct((prev) => !prev)}
              className="transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <PlusIcon className="size-3.5" aria-hidden />
              <span>{showAddProduct ? "Close form" : "New product"}</span>
            </Button>
          )}
        </div>

        {showAddProduct && canWrite && (
          <form
            onSubmit={handleCreateProduct}
            className="grid grid-cols-1 gap-4 border-b border-line bg-surface px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-3"
          >
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Category</span>
              <select
                value={effectiveProdCatId}
                onChange={(e) => setProdCategoryId(e.target.value)}
                required
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Name</span>
              <Input
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Google AI Pro"
                className="h-10 bg-background"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Slug</span>
              <Input
                required
                value={prodSlug}
                onChange={(e) => setProdSlug(e.target.value)}
                placeholder="google-ai-pro"
                className="h-10 bg-background"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs sm:col-span-2">
              <span className="font-medium text-foreground">Description</span>
              <Input
                required
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                placeholder="Short product description"
                className="h-10 bg-background"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">
                  Base price (USD)
                </span>
                <Input
                  value={prodBasePrice}
                  onChange={(e) => setProdBasePrice(e.target.value)}
                  className="h-10 bg-background tabular-nums"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">Status</span>
                <select
                  value={prodStatus}
                  onChange={(e) =>
                    setProdStatus(e.target.value as AdminProductStatus)
                  }
                  className="h-10 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Button
                type="submit"
                size="sm"
                disabled={pendingKey === "create-product"}
                className="transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                {pendingKey === "create-product" && (
                  <Spinner className="size-3.5" aria-hidden />
                )}
                <span>Save product</span>
              </Button>
            </div>
          </form>
        )}

        <ul className="divide-y divide-line text-xs">
          {products.map((prod) => {
            const isEditing = editingProdId === prod.id
            const isConfirmArchive = confirmArchiveProdId === prod.id
            const saveBusy = pendingKey === `edit-prod-${prod.id}`
            const archiveBusy = pendingKey === `archive-prod-${prod.id}`

            return (
              <Fragment key={prod.id}>
                <li className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5">
                  <div>
                    <div className="font-medium text-foreground">
                      {prod.name}
                    </div>
                    <div className="text-muted-foreground tabular-nums">
                      {prod.slug}
                      {prod.basePrice
                        ? ` · ${formatUsd(Number(prod.basePrice))}`
                        : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "mr-1 font-medium",
                        statusToneClass(prod.status)
                      )}
                    >
                      {formatStatusLabel(prod.status)}
                    </span>

                    {canWrite && (
                      <>
                        {isConfirmArchive ? (
                          <>
                            <Button
                              type="button"
                              variant="destructive"
                              size="xs"
                              disabled={pendingKey !== null}
                              onClick={() => void handleArchiveProduct(prod.id)}
                              className="transition-transform duration-150 ease-out active:scale-[0.97]"
                            >
                              {archiveBusy && (
                                <Spinner className="size-3" aria-hidden />
                              )}
                              <span>Confirm archive</span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              disabled={pendingKey !== null}
                              onClick={() => setConfirmArchiveProdId(null)}
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
                              onClick={() => startEditProduct(prod)}
                              className="transition-transform duration-150 ease-out active:scale-[0.97]"
                            >
                              {isEditing ? "Close" : "Edit"}
                            </Button>
                            {prod.status !== "ARCHIVED" && (
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                disabled={pendingKey !== null}
                                onClick={() => {
                                  setEditingProdId(null)
                                  setConfirmArchiveProdId(prod.id)
                                }}
                                className="text-destructive transition-transform duration-150 ease-out active:scale-[0.97]"
                              >
                                Archive
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </li>

                {isEditing && (
                  <li className="bg-surface p-4 sm:px-5">
                    <form
                      onSubmit={(e) => void handleSaveProduct(e, prod.id)}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="font-medium text-foreground">
                          Category
                        </span>
                        <select
                          value={editProdCategoryId}
                          onChange={(e) =>
                            setEditProdCategoryId(e.target.value)
                          }
                          className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="font-medium text-foreground">
                          Name
                        </span>
                        <Input
                          required
                          value={editProdName}
                          onChange={(e) => setEditProdName(e.target.value)}
                          className="h-9 bg-background"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="font-medium text-foreground">
                          Slug
                        </span>
                        <Input
                          required
                          value={editProdSlug}
                          onChange={(e) => setEditProdSlug(e.target.value)}
                          className="h-9 bg-background"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                        <span className="font-medium text-foreground">
                          Description
                        </span>
                        <Input
                          required
                          value={editProdDesc}
                          onChange={(e) => setEditProdDesc(e.target.value)}
                          className="h-9 bg-background"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1 text-xs">
                          <span className="font-medium text-foreground">
                            Base price
                          </span>
                          <Input
                            value={editProdPrice}
                            onChange={(e) => setEditProdPrice(e.target.value)}
                            className="h-9 bg-background tabular-nums"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs">
                          <span className="font-medium text-foreground">
                            Status
                          </span>
                          <select
                            value={editProdStatus}
                            onChange={(e) =>
                              setEditProdStatus(
                                e.target.value as AdminProductStatus
                              )
                            }
                            className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </label>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
                        <Button
                          type="submit"
                          size="xs"
                          disabled={saveBusy}
                          className="transition-transform duration-150 ease-out active:scale-[0.97]"
                        >
                          {saveBusy && (
                            <Spinner className="size-3" aria-hidden />
                          )}
                          <span>Save product</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          disabled={saveBusy}
                          onClick={() => setEditingProdId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </li>
                )}
              </Fragment>
            )
          })}
        </ul>

        <AdminPagination
          meta={productsMeta}
          disabled={loading}
          onPageChange={onProductsPageChange}
        />
      </div>
    </section>
  )
}

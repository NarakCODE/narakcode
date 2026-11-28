import { StorefrontApiError, type ApiProblemDetail } from "./api"

const API_BASE = "/api/storefront/admin"
const ADMIN_SESSION_KEY = "storefront:admin-session"

export type AdminRole =
  | "OWNER"
  | "INVENTORY_MANAGER"
  | "SUPPORT"
  | "FINANCE"
  | "VIEWER"

export interface AdminSession {
  accessToken: string
  refreshToken: string
  accessExpiresAt: string
  role: AdminRole | string
  email?: string
}

export interface PageMeta {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PagedResult<T> {
  data: T[]
  meta: PageMeta
}

export interface AdminSalesMetrics {
  currency: string
  periodStartUtc: string
  periodEndUtc: string
  grossReceived: string
  confirmedRefunds: string
  netReceipts: string
  completedOrders: number
  createdOrders: number
  checkoutConversionRate: string
}

export interface AdminQuotaSnapshot {
  provider: string
  windowStart: string
  windowEnd: string
  usedCount: number
  configuredLimit: number
  reservedForUrgent: number
}

export interface AdminDashboardSummary {
  reportTimeZone: string
  todaySales: AdminSalesMetrics
  pendingPayments: number
  ordersRequiringReview: number
  availableStock: number
  expiringStock: number
  paymentQuota: AdminQuotaSnapshot
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type AdminProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"

export interface AdminProduct {
  id: string
  categoryId: string
  name: string
  slug: string
  description: string
  thumbnailUrl: string | null
  status: AdminProductStatus
  currency: string
  basePrice: string | null
  createdAt: string
  updatedAt: string
}

export type AdminInventoryStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "SOLD"
  | "EXPIRED"
  | "DISABLED"

export type AdminDeliveryType =
  | "ACTIVATION_CODE"
  | "PROVIDER_INVITE"
  | "AUTHORIZED_ACCOUNT"

export interface AdminInventoryUnit {
  id: string
  productId: string
  publicOfferId: string
  deliveryType: AdminDeliveryType
  keyVersion: string
  costPrice: string
  sellingPrice: string
  currency: string
  activatedAt: string | null
  expiresAt: string
  status: AdminInventoryStatus
  authorizationReference: string | null
  createdAt: string
}

export interface AdminOrderSummary {
  id: string
  orderNumber: string
  maskedEmail: string
  status: string
  totalAmount: string
  currency: string
  reviewReason: string | null
  paidAt: string | null
  completedAt: string | null
  createdAt: string
}

export interface AdminOrderItem {
  id: string
  productId: string
  offerId: string
  productName: string
  unitPrice: string
  quantity: number
  totalPrice: string
  subscriptionExpiresAt: string
}

export interface AdminPaymentSummary {
  id: string
  orderId: string
  provider: string
  merchantTransactionId: string
  providerTransactionId: string | null
  bankReference: string | null
  status: string
  amount: string
  currency: string
  receivedAmount: string | null
  receivedCurrency: string | null
  paidAt: string | null
  createdAt: string
}

export interface AdminOrderDetail {
  order: AdminOrderSummary
  items: AdminOrderItem[]
  payments: AdminPaymentSummary[]
}

export interface AdminRefund {
  id: string
  paymentId: string
  merchantRefundId: string
  amount: string
  currency: string
  reason: string
  providerReference: string | null
  status: string
  requestedBy: string | null
  confirmedAt: string | null
  createdAt: string
}

export interface AdminAuditLog {
  id: string
  actorType: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string | null
  metadataRedacted: Record<string, unknown> | null
  requestId: string | null
  createdAt: string
}

export function loadAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export function saveAdminSession(session: AdminSession) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
  } catch {
    // Ignore storage errors
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY)
  } catch {
    // Ignore storage errors
  }
}

async function parseError(response: Response): Promise<StorefrontApiError> {
  let problem: ApiProblemDetail = {}
  try {
    problem = (await response.json()) as ApiProblemDetail
  } catch {
    // Ignore non-JSON body
  }
  const retryAfter = response.headers.get("Retry-After") ?? undefined
  return new StorefrontApiError(
    response.status,
    problem.code ?? "REQUEST_FAILED",
    problem.detail ?? problem.title ?? `Request failed (${response.status})`,
    problem.requestId,
    retryAfter
  )
}

async function refreshAccessToken(
  session: AdminSession
): Promise<AdminSession | null> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
    cache: "no-store",
  })
  if (!res.ok) {
    clearAdminSession()
    return null
  }
  const json = (await res.json()) as {
    data: Omit<AdminSession, "email">
  }
  const next: AdminSession = {
    ...json.data,
    email: session.email,
  }
  saveAdminSession(next)
  return next
}

async function adminFetchRaw(
  path: string,
  init: RequestInit = {},
  allowRetry = true
): Promise<Response> {
  const session = loadAdminSession()
  const headers = new Headers(init.headers)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  })

  if (response.status === 401 && allowRetry && session?.refreshToken) {
    const refreshed = await refreshAccessToken(session)
    if (refreshed) {
      return adminFetchRaw(path, init, false)
    }
  }

  if (!response.ok) {
    throw await parseError(response)
  }

  return response
}

async function adminRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await adminFetchRaw(path, init)
  const json = (await response.json()) as { data: T }
  return json.data
}

async function adminVoidRequest(
  path: string,
  init: RequestInit = {}
): Promise<void> {
  await adminFetchRaw(path, init)
}

async function adminPagedRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<PagedResult<T>> {
  const response = await adminFetchRaw(path, init)
  return (await response.json()) as PagedResult<T>
}

export async function adminLogin(params: {
  email: string
  password: string
  totpCode?: string
}): Promise<AdminSession> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: params.email.trim(),
      password: params.password,
      ...(params.totpCode?.trim() ? { totpCode: params.totpCode.trim() } : {}),
    }),
    cache: "no-store",
  })
  if (!res.ok) {
    throw await parseError(res)
  }
  const json = (await res.json()) as { data: Omit<AdminSession, "email"> }
  const session: AdminSession = {
    ...json.data,
    email: params.email.trim(),
  }
  saveAdminSession(session)
  return session
}

export async function adminLogout(): Promise<void> {
  try {
    await adminFetchRaw("/auth/logout", { method: "POST" }, false)
  } catch {
    // Ignore logout transport errors
  } finally {
    clearAdminSession()
  }
}

export function fetchAdminMe(): Promise<{
  adminId: string
  email: string
  role: AdminRole
}> {
  return adminRequest("/auth/me")
}

export function fetchAdminDashboard(
  expiringWithinDays = 7
): Promise<AdminDashboardSummary> {
  return adminRequest(`/dashboard?expiringWithinDays=${expiringWithinDays}`)
}

export function fetchAdminSalesAnalytics(params: {
  from?: string
  to?: string
  currency?: string
}): Promise<AdminSalesMetrics> {
  const qs = new URLSearchParams()
  if (params.from) qs.set("from", params.from)
  if (params.to) qs.set("to", params.to)
  if (params.currency) qs.set("currency", params.currency)
  const suffix = qs.toString() ? `?${qs.toString()}` : ""
  return adminRequest(`/analytics/sales${suffix}`)
}

export function fetchAdminCategories(): Promise<AdminCategory[]> {
  return adminRequest("/categories")
}

export function createAdminCategory(body: {
  name: string
  slug: string
  description?: string
  active?: boolean
}): Promise<AdminCategory> {
  return adminRequest("/categories", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateAdminCategory(
  id: string,
  body: {
    name?: string
    slug?: string
    description?: string
    active?: boolean
  }
): Promise<AdminCategory> {
  return adminRequest(`/categories/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function fetchAdminProducts(
  page = 0,
  size = 20
): Promise<PagedResult<AdminProduct>> {
  return adminPagedRequest(`/products?page=${page}&size=${size}`)
}

export function createAdminProduct(body: {
  categoryId: string
  name: string
  slug: string
  description: string
  status: AdminProductStatus
  currency: string
  basePrice?: string
}): Promise<AdminProduct> {
  return adminRequest("/products", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateAdminProduct(
  id: string,
  body: {
    categoryId?: string
    name?: string
    slug?: string
    description?: string
    status?: AdminProductStatus
    currency?: string
    basePrice?: string
  }
): Promise<AdminProduct> {
  return adminRequest(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function archiveAdminProduct(id: string): Promise<void> {
  return adminVoidRequest(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export function fetchAdminInventory(
  status?: string,
  page = 0,
  size = 20
): Promise<PagedResult<AdminInventoryUnit>> {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...(status ? { status } : {}),
  })
  return adminPagedRequest(`/inventory?${qs.toString()}`)
}

export function createAdminInventory(body: {
  productId: string
  deliveryType: AdminDeliveryType
  deliverySecretPayload: Record<string, string>
  costPrice: string
  sellingPrice: string
  currency: string
  activatedAt?: string
  expiresAt: string
  authorizationReference?: string
}): Promise<AdminInventoryUnit> {
  return adminRequest("/inventory", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateAdminInventory(
  id: string,
  body: {
    costPrice?: string
    sellingPrice?: string
    expiresAt?: string
    authorizationReference?: string
    status?: "AVAILABLE" | "DISABLED"
    reason?: string
  }
): Promise<AdminInventoryUnit> {
  return adminRequest(`/inventory/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function deleteAdminInventory(id: string): Promise<void> {
  return adminVoidRequest(`/inventory/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export function fetchAdminOrders(
  status?: string,
  page = 0,
  size = 20
): Promise<PagedResult<AdminOrderSummary>> {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...(status ? { status } : {}),
  })
  return adminPagedRequest(`/orders?${qs.toString()}`)
}

export function fetchAdminOrderDetail(id: string): Promise<AdminOrderDetail> {
  return adminRequest(`/orders/${encodeURIComponent(id)}`)
}

export function retryAdminOrderFulfillment(
  orderId: string,
  reason: string
): Promise<{ status: string }> {
  return adminRequest(
    `/orders/${encodeURIComponent(orderId)}/retry-fulfillment`,
    {
      method: "POST",
      body: JSON.stringify({ reason }),
    }
  )
}

export function fetchAdminPayments(
  status?: string,
  page = 0,
  size = 20
): Promise<PagedResult<AdminPaymentSummary>> {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...(status ? { status } : {}),
  })
  return adminPagedRequest(`/payments?${qs.toString()}`)
}

export function reconcileAdminPayment(
  paymentId: string,
  reason: string
): Promise<{ status: string }> {
  return adminRequest(`/payments/${encodeURIComponent(paymentId)}/reconcile`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

export function refundAdminPayment(
  paymentId: string,
  body: { amount: string; reason: string }
): Promise<AdminRefund> {
  return adminRequest(`/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function fetchAdminRefunds(
  page = 0,
  size = 20
): Promise<PagedResult<AdminRefund>> {
  return adminPagedRequest(`/refunds?page=${page}&size=${size}`)
}

export function fetchAdminAuditLogs(
  page = 0,
  size = 20
): Promise<PagedResult<AdminAuditLog>> {
  return adminPagedRequest(`/audit-logs?page=${page}&size=${size}`)
}

export async function triggerDevOrderSucceed(
  orderNumber: string
): Promise<{ orderStatus: string; paymentStatus: string }> {
  const res = await fetch(
    `/api/storefront/dev/mock-payments/orders/${encodeURIComponent(orderNumber)}/succeed`,
    { method: "POST", cache: "no-store" }
  )
  if (!res.ok) {
    throw await parseError(res)
  }
  const json = (await res.json()) as {
    data: { orderStatus: string; paymentStatus: string }
  }
  return json.data
}

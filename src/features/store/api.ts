const API_BASE = "/api/storefront"

export interface ApiProblemDetail {
  title?: string
  status?: number
  detail?: string
  code?: string
  requestId?: string
}

export class StorefrontApiError extends Error {
  readonly status: number
  readonly code: string
  readonly requestId?: string
  readonly retryAfter?: string

  constructor(
    status: number,
    code: string,
    message: string,
    requestId?: string,
    retryAfter?: string
  ) {
    super(message)
    this.name = "StorefrontApiError"
    this.status = status
    this.code = code
    this.requestId = requestId
    this.retryAfter = retryAfter
  }
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
}

export interface ApiProductSummary {
  id: string
  categoryId: string
  name: string
  slug: string
  description: string
  thumbnailUrl: string | null
  currency: string
  basePrice: string | null
  availableOffersCount: number
}

export interface ApiPublicOffer {
  offerId: string
  price: string
  subscriptionExpiresAt: string
  remainingDays: number
  available: boolean
}

export interface ApiProductDetail {
  id: string
  categoryId: string
  name: string
  slug: string
  description: string
  thumbnailUrl: string | null
  currency: string
  basePrice: string | null
  offers: ApiPublicOffer[]
}

export interface ApiGuestSession {
  csrfToken: string
  expiresAt: string
}

export interface ApiEmailVerifyResponse {
  emailVerified: boolean
  csrfToken: string
  expiresAt: string
}

export interface ApiOrderCreated {
  orderId: string
  orderNumber: string
  status: string
  total: string
  currency: string
  expiresAt: string
}

export interface ApiKhqrPayment {
  paymentId: string
  provider: string
  status: string
  amount: string
  currency: string
  qrPayload: string | null
  expiresAt: string | null
}

export interface ApiOrderDetail {
  orderId: string
  orderNumber: string
  status: string
  maskedEmail: string
  subtotal: string
  discount: string
  total: string
  currency: string
  expiresAt: string | null
  paidAt: string | null
  completedAt: string | null
  items: Array<{
    orderItemId: string
    productId: string
    offerId: string
    productName: string
    unitPrice: string
    quantity: number
    totalPrice: string
    subscriptionExpiresAt: string
  }>
}

export interface ApiOrderStatus {
  orderStatus:
    | "PENDING_PAYMENT"
    | "PROCESSING"
    | "COMPLETED"
    | "EXPIRED"
    | "CANCELLED"
    | "REQUIRES_REVIEW"
    | "REFUNDED"
  paymentStatus: string
  fulfillmentStatus: string
  credentialsAvailable: boolean
  receiptStatus: string
}

export interface ApiRevealedDelivery {
  deliveryType: "ACTIVATION_CODE" | "PROVIDER_INVITE" | "AUTHORIZED_ACCOUNT"
  productName: string
  subscriptionExpiresAt: string
  activationCode?: string
  redeemUrl?: string
  accountEmail?: string
  email?: string
  password?: string
  loginUrl?: string
  [key: string]: unknown
}

async function requestJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  })

  if (!response.ok) {
    let problem: ApiProblemDetail = {}
    try {
      problem = (await response.json()) as ApiProblemDetail
    } catch {
      // ignore non-JSON error body
    }
    throw new StorefrontApiError(
      response.status,
      problem.code ?? "REQUEST_FAILED",
      problem.detail ?? problem.title ?? `Request failed (${response.status})`,
      problem.requestId,
      response.headers.get("Retry-After") ?? undefined
    )
  }

  const json = (await response.json()) as { data: T }
  return json.data
}

export function generateIdempotencyKey(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function fetchCatalogCategories(): Promise<ApiCategory[]> {
  return requestJson<ApiCategory[]>("/categories")
}

export function fetchCatalogProducts(
  categoryId?: string
): Promise<ApiProductSummary[]> {
  const qs = new URLSearchParams({ page: "0", size: "50" })
  if (categoryId) qs.set("categoryId", categoryId)
  return requestJson<ApiProductSummary[]>(`/products?${qs.toString()}`)
}

export function fetchCatalogProduct(slug: string): Promise<ApiProductDetail> {
  return requestJson<ApiProductDetail>(`/products/${encodeURIComponent(slug)}`)
}

export function createGuestSession(): Promise<ApiGuestSession> {
  return requestJson<ApiGuestSession>("/checkout/session", {
    method: "POST",
  })
}

export function requestEmailVerification(
  email: string,
  csrfToken: string
): Promise<{ status: string }> {
  return requestJson<{ status: string }>("/checkout/email/request", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken },
    body: JSON.stringify({ email }),
  })
}

export function verifyEmailCode(
  email: string,
  code: string,
  csrfToken: string
): Promise<ApiEmailVerifyResponse> {
  return requestJson<ApiEmailVerifyResponse>("/checkout/email/verify", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken },
    body: JSON.stringify({ email, code }),
  })
}

export function createOrder(params: {
  offerId: string
  expectedPrice: string
  currency?: string
  csrfToken: string
  idempotencyKey?: string
  turnstileToken?: string
}): Promise<ApiOrderCreated> {
  return requestJson<ApiOrderCreated>("/orders", {
    method: "POST",
    headers: {
      "X-CSRF-Token": params.csrfToken,
      "Idempotency-Key": params.idempotencyKey ?? generateIdempotencyKey(),
    },
    body: JSON.stringify({
      items: [
        {
          offerId: params.offerId,
          quantity: 1,
          expectedPrice: params.expectedPrice,
        },
      ],
      currency: params.currency ?? "USD",
      termsAccepted: true,
      ...(params.turnstileToken
        ? { turnstileToken: params.turnstileToken }
        : {}),
    }),
  })
}

export function createKhqrPayment(params: {
  orderId: string
  csrfToken: string
  idempotencyKey?: string
}): Promise<ApiKhqrPayment> {
  return requestJson<ApiKhqrPayment>(
    `/orders/${encodeURIComponent(params.orderId)}/payments/khqr`,
    {
      method: "POST",
      headers: {
        "X-CSRF-Token": params.csrfToken,
        "Idempotency-Key": params.idempotencyKey ?? generateIdempotencyKey(),
      },
    }
  )
}

export function getOrderDetail(orderId: string): Promise<ApiOrderDetail> {
  return requestJson<ApiOrderDetail>(`/orders/${encodeURIComponent(orderId)}`)
}

export function getOrderStatus(orderId: string): Promise<ApiOrderStatus> {
  return requestJson<ApiOrderStatus>(
    `/orders/${encodeURIComponent(orderId)}/status`
  )
}

export function triggerManualPaymentVerify(
  paymentId: string,
  csrfToken: string
): Promise<{ queued: boolean; currentStatus: string }> {
  return requestJson<{ queued: boolean; currentStatus: string }>(
    `/payments/${encodeURIComponent(paymentId)}/verify`,
    {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
    }
  )
}

export function revealOrderCredentials(
  orderId: string,
  csrfToken: string
): Promise<ApiRevealedDelivery> {
  return requestJson<ApiRevealedDelivery>(
    `/orders/${encodeURIComponent(orderId)}/credentials/reveal`,
    {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
    }
  )
}

export function cancelOrder(
  orderId: string,
  csrfToken: string
): Promise<{ status: string }> {
  return requestJson<{ status: string }>(
    `/orders/${encodeURIComponent(orderId)}/cancel`,
    {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
    }
  )
}

export function resendOrderReceipt(
  orderId: string,
  csrfToken: string
): Promise<{ status: string }> {
  return requestJson<{ status: string }>(
    `/orders/${encodeURIComponent(orderId)}/receipt/resend`,
    {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
    }
  )
}

export function requestOrderRecovery(
  email: string,
  orderNumber?: string
): Promise<{ status: string; message: string }> {
  return requestJson<{ status: string; message: string }>(
    "/orders/access/request",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        ...(orderNumber ? { orderNumber } : {}),
      }),
    }
  )
}

export function verifyOrderRecovery(
  token: string
): Promise<{ orderId: string; csrfToken: string; expiresAt: string }> {
  return requestJson<{ orderId: string; csrfToken: string; expiresAt: string }>(
    "/orders/access/verify",
    {
      method: "POST",
      body: JSON.stringify({ token }),
    }
  )
}

export function simulateDevPayment(
  paymentId: string,
  scenario: "PAID" | "EXPIRED" | "AMOUNT_MISMATCH" = "PAID"
): Promise<{ paymentId: string; paymentStatus: string }> {
  return requestJson<{ paymentId: string; paymentStatus: string }>(
    `/dev/mock-payments/${encodeURIComponent(paymentId)}/simulate`,
    {
      method: "POST",
      body: JSON.stringify({ scenario }),
    }
  )
}

const ACTIVE_CHECKOUT_STORAGE_KEY = "storefront:active-checkout"

export interface PersistedCheckoutState {
  offerId: string
  buyerEmail: string
  csrfToken: string
  order: ApiOrderCreated
  payment: ApiKhqrPayment
}

export function loadAnyPersistedCheckout(): PersistedCheckoutState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_CHECKOUT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedCheckoutState
    if (new Date(parsed.order.expiresAt).getTime() <= Date.now()) {
      window.sessionStorage.removeItem(ACTIVE_CHECKOUT_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function loadPersistedCheckoutForOffer(
  offerId?: string
): PersistedCheckoutState | null {
  if (!offerId) return null
  const active = loadAnyPersistedCheckout()
  return active && active.offerId === offerId ? active : null
}

export function savePersistedCheckout(state: PersistedCheckoutState) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(
      ACTIVE_CHECKOUT_STORAGE_KEY,
      JSON.stringify(state)
    )
  } catch {
    // Ignore storage quota / private mode errors
  }
}

export function clearPersistedCheckout() {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(ACTIVE_CHECKOUT_STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

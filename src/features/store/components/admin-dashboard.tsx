"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  BarChart3Icon,
  CreditCardIcon,
  LayersIcon,
  LogOutIcon,
  PackageIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  ScrollTextIcon,
  ShoppingBagIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from "@/components/page-heading"

import {
  adminLogin,
  adminLogout,
  fetchAdminAuditLogs,
  fetchAdminCategories,
  fetchAdminDashboard,
  fetchAdminInventory,
  fetchAdminMe,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminProducts,
  fetchAdminRefunds,
  fetchAdminSalesAnalytics,
  loadAdminSession,
  type AdminAuditLog,
  type AdminCategory,
  type AdminDashboardSummary,
  type AdminInventoryUnit,
  type AdminOrderSummary,
  type AdminPaymentSummary,
  type AdminProduct,
  type AdminRefund,
  type AdminSalesMetrics,
  type AdminSession,
  type PageMeta,
} from "../admin-api"
import { StorefrontApiError } from "../api"
import { AdminAnalyticsTab } from "./admin/admin-analytics-tab"
import { AdminAuditTab } from "./admin/admin-audit-tab"
import { AdminCatalogTab } from "./admin/admin-catalog-tab"
import { AdminInventoryTab } from "./admin/admin-inventory-tab"
import { AdminLogin } from "./admin/admin-login"
import { AdminMetrics } from "./admin/admin-metrics"
import { AdminOrdersTab } from "./admin/admin-orders-tab"
import { AdminPaymentsTab } from "./admin/admin-payments-tab"
import {
  formatStatusLabel,
  getAdminPermissions,
  getVisibleAdminTabs,
  type AdminTab,
} from "./admin/admin-permissions"
import { AdminRefundsTab } from "./admin/admin-refunds-tab"

const IS_DEV = process.env.NODE_ENV !== "production"

const EMPTY_META: PageMeta = {
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
}

function AdminTabIcon({ tab }: { tab: AdminTab }) {
  const cls = "size-3.5 shrink-0"
  switch (tab) {
    case "inventory":
      return <PackageIcon className={cls} aria-hidden />
    case "orders":
      return <ShoppingBagIcon className={cls} aria-hidden />
    case "payments":
      return <CreditCardIcon className={cls} aria-hidden />
    case "refunds":
      return <RotateCcwIcon className={cls} aria-hidden />
    case "catalog":
      return <LayersIcon className={cls} aria-hidden />
    case "analytics":
      return <BarChart3Icon className={cls} aria-hidden />
    case "audit":
      return <ScrollTextIcon className={cls} aria-hidden />
  }
}

export function AdminDashboard() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [sessionHydrated, setSessionHydrated] = useState(false)
  const [adminEmail, setAdminEmail] = useState(
    IS_DEV ? "admin@storefront.local" : ""
  )
  const [password, setPassword] = useState(IS_DEV ? "ChangeMeNow!12345" : "")
  const [totpCode, setTotpCode] = useState("")
  const [loginBusy, setLoginBusy] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (!active) return
      const stored = loadAdminSession()
      if (stored) {
        setSession(stored)
        if (stored.email) setAdminEmail(stored.email)
      }
      setSessionHydrated(true)
    })
    return () => {
      active = false
    }
  }, [])

  const [activeTab, setActiveTab] = useState<AdminTab>("inventory")
  const [refreshing, setRefreshing] = useState(false)
  const [logoutBusy, setLogoutBusy] = useState(false)
  const [banner, setBanner] = useState<{
    kind: "info" | "error"
    text: string
  } | null>(null)

  // Dashboard & catalog state
  const [dashboard, setDashboard] = useState<AdminDashboardSummary | null>(null)
  const [salesMetrics, setSalesMetrics] = useState<AdminSalesMetrics | null>(
    null
  )
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [productsMeta, setProductsMeta] = useState<PageMeta>(EMPTY_META)
  const [productsPage, setProductsPage] = useState(0)

  // Inventory state
  const [inventory, setInventory] = useState<AdminInventoryUnit[]>([])
  const [inventoryMeta, setInventoryMeta] = useState<PageMeta>(EMPTY_META)
  const [inventoryStatus, setInventoryStatus] = useState("")
  const [inventoryPage, setInventoryPage] = useState(0)

  // Orders state
  const [orders, setOrders] = useState<AdminOrderSummary[]>([])
  const [ordersMeta, setOrdersMeta] = useState<PageMeta>(EMPTY_META)
  const [ordersStatus, setOrdersStatus] = useState("")
  const [ordersPage, setOrdersPage] = useState(0)

  // Payments state
  const [payments, setPayments] = useState<AdminPaymentSummary[]>([])
  const [paymentsMeta, setPaymentsMeta] = useState<PageMeta>(EMPTY_META)
  const [paymentsStatus, setPaymentsStatus] = useState("")
  const [paymentsPage, setPaymentsPage] = useState(0)

  // Refunds & Audit state
  const [refunds, setRefunds] = useState<AdminRefund[]>([])
  const [refundsMeta, setRefundsMeta] = useState<PageMeta>(EMPTY_META)
  const [refundsPage, setRefundsPage] = useState(0)
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([])
  const [auditMeta, setAuditMeta] = useState<PageMeta>(EMPTY_META)
  const [auditPage, setAuditPage] = useState(0)

  const perms = useMemo(
    () => getAdminPermissions(session?.role ?? ""),
    [session?.role]
  )
  const visibleTabs = useMemo(() => getVisibleAdminTabs(perms), [perms])

  const effectiveTab: AdminTab = visibleTabs.some((t) => t.id === activeTab)
    ? activeTab
    : (visibleTabs[0]?.id ?? "catalog")

  const notify = useCallback((kind: "info" | "error", text: string) => {
    setBanner({ kind, text })
  }, [])

  const fetchDashboardBundle = useCallback(
    async (opts?: {
      invStatus?: string
      invPage?: number
      ordStatus?: string
      ordPage?: number
      payStatus?: string
      payPage?: number
      prodPage?: number
      refPage?: number
      audPage?: number
    }) => {
      const me = await fetchAdminMe()
      const rolePerms = getAdminPermissions(me.role)

      const [dash, cats, prods, inv, ords, pays, refs, sales, logs] =
        await Promise.all([
          fetchAdminDashboard(7),
          fetchAdminCategories(),
          fetchAdminProducts(opts?.prodPage ?? productsPage, 20),
          rolePerms.canReadInventory
            ? fetchAdminInventory(
                (opts?.invStatus ?? inventoryStatus) || undefined,
                opts?.invPage ?? inventoryPage,
                20
              )
            : Promise.resolve(null),
          rolePerms.canReadOrders
            ? fetchAdminOrders(
                (opts?.ordStatus ?? ordersStatus) || undefined,
                opts?.ordPage ?? ordersPage,
                20
              )
            : Promise.resolve(null),
          rolePerms.canReadPayments
            ? fetchAdminPayments(
                (opts?.payStatus ?? paymentsStatus) || undefined,
                opts?.payPage ?? paymentsPage,
                20
              )
            : Promise.resolve(null),
          rolePerms.canReadRefunds
            ? fetchAdminRefunds(opts?.refPage ?? refundsPage, 20)
            : Promise.resolve(null),
          rolePerms.canReadAnalytics
            ? fetchAdminSalesAnalytics({})
            : Promise.resolve(null),
          rolePerms.canReadAuditLogs
            ? fetchAdminAuditLogs(opts?.audPage ?? auditPage, 20)
            : Promise.resolve(null),
        ])

      return { me, dash, cats, prods, inv, ords, pays, refs, sales, logs }
    },
    [
      productsPage,
      inventoryStatus,
      inventoryPage,
      ordersStatus,
      ordersPage,
      paymentsStatus,
      paymentsPage,
      refundsPage,
      auditPage,
    ]
  )

  const applyBundle = useCallback(
    (bundle: Awaited<ReturnType<typeof fetchDashboardBundle>>) => {
      setSession((prev) =>
        prev ? { ...prev, email: bundle.me.email, role: bundle.me.role } : prev
      )
      setDashboard(bundle.dash)
      setCategories(bundle.cats)
      setProducts(bundle.prods.data)
      setProductsMeta(bundle.prods.meta)
      if (bundle.inv) {
        setInventory(bundle.inv.data)
        setInventoryMeta(bundle.inv.meta)
      }
      if (bundle.ords) {
        setOrders(bundle.ords.data)
        setOrdersMeta(bundle.ords.meta)
      }
      if (bundle.pays) {
        setPayments(bundle.pays.data)
        setPaymentsMeta(bundle.pays.meta)
      }
      if (bundle.refs) {
        setRefunds(bundle.refs.data)
        setRefundsMeta(bundle.refs.meta)
      }
      if (bundle.sales) {
        setSalesMetrics(bundle.sales)
      }
      if (bundle.logs) {
        setAuditLogs(bundle.logs.data)
        setAuditMeta(bundle.logs.meta)
      }
    },
    []
  )

  const reloadAll = useCallback(
    async (opts?: Parameters<typeof fetchDashboardBundle>[0]) => {
      setRefreshing(true)
      try {
        const bundle = await fetchDashboardBundle(opts)
        applyBundle(bundle)
      } catch (err) {
        if (err instanceof StorefrontApiError && err.status === 401) {
          await adminLogout()
          setSession(null)
          setLoginError("Session expired. Sign in again.")
          return
        }
        notify(
          "error",
          err instanceof StorefrontApiError
            ? err.message
            : "Unable to load admin data. Is storefront-api running?"
        )
      } finally {
        setRefreshing(false)
      }
    },
    [fetchDashboardBundle, applyBundle, notify]
  )

  useEffect(() => {
    const token = session?.accessToken
    if (!token) return
    let cancelled = false

    fetchDashboardBundle()
      .then((bundle) => {
        if (!cancelled) applyBundle(bundle)
      })
      .catch(async (err: unknown) => {
        if (cancelled) return
        if (err instanceof StorefrontApiError && err.status === 401) {
          await adminLogout()
          setSession(null)
          setLoginError("Session expired. Sign in again.")
          return
        }
        setBanner({
          kind: "error",
          text:
            err instanceof StorefrontApiError
              ? err.message
              : "Unable to load admin data. Is storefront-api running?",
        })
      })

    return () => {
      cancelled = true
    }
  }, [session?.accessToken, fetchDashboardBundle, applyBundle])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loginBusy) return
    setLoginBusy(true)
    setLoginError(null)
    try {
      const nextSession = await adminLogin({
        email: adminEmail,
        password,
        totpCode: totpCode || undefined,
      })
      setSession(nextSession)
      setTotpCode("")
    } catch (err) {
      setLoginError(
        err instanceof StorefrontApiError
          ? err.message
          : "Sign in failed. Check your credentials and backend connection."
      )
    } finally {
      setLoginBusy(false)
    }
  }

  async function handleLogout() {
    setLogoutBusy(true)
    try {
      await adminLogout()
      setSession(null)
      setDashboard(null)
      setBanner(null)
    } finally {
      setLogoutBusy(false)
    }
  }

  if (!sessionHydrated) {
    return (
      <div className="mx-auto min-h-[70vh] max-w-3xl border-x border-x-line pt-12">
        <div className="px-4 py-12 text-xs text-muted-foreground">
          Loading admin session...
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <AdminLogin
        email={adminEmail}
        password={password}
        totpCode={totpCode}
        busy={loginBusy}
        error={loginError}
        onEmailChange={setAdminEmail}
        onPasswordChange={setPassword}
        onTotpChange={setTotpCode}
        onSubmit={handleLogin}
      />
    )
  }

  return (
    <div className="min-h-[75vh] pt-12">
      {/* Top utility bar */}
      <div className="screen-line-bottom flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link
          href="/stores"
          className="inline-flex min-h-9 touch-manipulation items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden />
          <span>Back to store</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">
            {session.email ?? "Admin"} ·{" "}
            <span className="font-medium text-foreground">
              {formatStatusLabel(session.role)}
            </span>
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={refreshing}
            onClick={() => void reloadAll()}
            className="transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {refreshing ? (
              <Spinner className="size-3.5" aria-hidden />
            ) : (
              <RefreshCwIcon className="size-3.5" aria-hidden />
            )}
            <span>Refresh</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={logoutBusy}
            onClick={() => void handleLogout()}
            className="transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {logoutBusy ? (
              <Spinner className="size-3.5" aria-hidden />
            ) : (
              <LogOutIcon className="size-3.5" aria-hidden />
            )}
            <span>Sign out</span>
          </Button>
        </div>
      </div>

      <PageHeading>
        <PageHeadingTitle>Store admin</PageHeadingTitle>
        <PageHeadingDescription>
          Manage encrypted inventory, live orders, payments, refunds, and
          catalog items.
        </PageHeadingDescription>
      </PageHeading>

      {dashboard && <AdminMetrics dashboard={dashboard} />}

      {banner && (
        <div
          role={banner.kind === "error" ? "alert" : "status"}
          className={cn(
            "screen-line-bottom flex items-center justify-between gap-3 bg-surface px-4 py-3 text-xs sm:px-5",
            banner.kind === "error" ? "text-destructive" : "text-foreground"
          )}
        >
          <span>{banner.text}</span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="shrink-0 text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Role-scoped tab bar (0ms instant switch) */}
      <nav
        aria-label="Admin sections"
        className="screen-line-bottom flex overflow-x-auto px-4 sm:px-5"
      >
        {visibleTabs.map((tab) => {
          const active = effectiveTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative inline-flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-3.5 py-3 text-xs font-medium",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              )}
            >
              <AdminTabIcon tab={tab.id} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {effectiveTab === "inventory" && perms.canReadInventory && (
        <AdminInventoryTab
          units={inventory}
          meta={inventoryMeta}
          products={products}
          statusFilter={inventoryStatus}
          canWrite={perms.canWriteCatalogInventory}
          loading={refreshing}
          onStatusFilterChange={(next) => {
            setInventoryStatus(next)
            setInventoryPage(0)
            void reloadAll({ invStatus: next, invPage: 0 })
          }}
          onPageChange={(page) => {
            setInventoryPage(page)
            void reloadAll({ invPage: page })
          }}
          onNotify={notify}
          onReload={() => reloadAll()}
        />
      )}

      {effectiveTab === "orders" && perms.canReadOrders && (
        <AdminOrdersTab
          orders={orders}
          meta={ordersMeta}
          statusFilter={ordersStatus}
          canRetryFulfillment={perms.canRetryFulfillment}
          loading={refreshing}
          onStatusFilterChange={(next) => {
            setOrdersStatus(next)
            setOrdersPage(0)
            void reloadAll({ ordStatus: next, ordPage: 0 })
          }}
          onPageChange={(page) => {
            setOrdersPage(page)
            void reloadAll({ ordPage: page })
          }}
          onNotify={notify}
          onReload={() => reloadAll()}
        />
      )}

      {effectiveTab === "payments" && perms.canReadPayments && (
        <AdminPaymentsTab
          payments={payments}
          meta={paymentsMeta}
          statusFilter={paymentsStatus}
          canRefund={perms.canRefundPayments}
          loading={refreshing}
          onStatusFilterChange={(next) => {
            setPaymentsStatus(next)
            setPaymentsPage(0)
            void reloadAll({ payStatus: next, payPage: 0 })
          }}
          onPageChange={(page) => {
            setPaymentsPage(page)
            void reloadAll({ payPage: page })
          }}
          onNotify={notify}
          onReload={() => reloadAll()}
        />
      )}

      {effectiveTab === "refunds" && perms.canReadRefunds && (
        <AdminRefundsTab
          refunds={refunds}
          meta={refundsMeta}
          loading={refreshing}
          onPageChange={(page) => {
            setRefundsPage(page)
            void reloadAll({ refPage: page })
          }}
        />
      )}

      {effectiveTab === "catalog" && (
        <AdminCatalogTab
          categories={categories}
          products={products}
          productsMeta={productsMeta}
          canWrite={perms.canWriteCatalogInventory}
          loading={refreshing}
          onProductsPageChange={(page) => {
            setProductsPage(page)
            void reloadAll({ prodPage: page })
          }}
          onNotify={notify}
          onReload={() => reloadAll()}
        />
      )}

      {effectiveTab === "analytics" && perms.canReadAnalytics && (
        <AdminAnalyticsTab initialMetrics={salesMetrics} onNotify={notify} />
      )}

      {effectiveTab === "audit" && perms.canReadAuditLogs && (
        <AdminAuditTab
          logs={auditLogs}
          meta={auditMeta}
          loading={refreshing}
          onPageChange={(page) => {
            setAuditPage(page)
            void reloadAll({ audPage: page })
          }}
        />
      )}
    </div>
  )
}

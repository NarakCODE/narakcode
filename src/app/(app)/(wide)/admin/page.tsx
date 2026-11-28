import type { Metadata } from "next"

import { AdminDashboard } from "@/features/store/components/admin-dashboard"

export const metadata: Metadata = {
  title: "Store admin",
  description:
    "Manage storefront catalog, encrypted inventory, orders, and payments.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminDashboard />
}

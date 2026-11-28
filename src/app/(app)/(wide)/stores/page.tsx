import type { Metadata } from "next"
import { notFound } from "next/navigation"

const title = "Store"
const description =
  "Ready-to-use 12-month Gemini Pro Google accounts (5 TB) starting at $5.00, with automatic weekly price drops for pre-activated accounts and instant handover."

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
}

export default function StoresPage() {
  notFound()
}

import type { Metadata } from "next"

import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { Storefront } from "@/features/store/components/storefront"

const title = "Store"
const description =
  "Ready-to-use 12-month Gemini Pro Google accounts (5 TB) starting at $5.00, with automatic weekly price drops for pre-activated accounts and instant handover."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/stores",
  },
  openGraph: {
    url: "/stores",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

export default function StoresPage() {
  const initialNowIso = new Date().toISOString()

  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Store",
            href: "/stores",
          },
        ])}
      />

      <Storefront initialNowIso={initialNowIso} />
    </>
  )
}

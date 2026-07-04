import { Suspense } from "react"
import type { Metadata } from "next"
import type { CollectionPage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { VaultList } from "@/features/vault/components/vault-list"
import { VaultListWithSearch } from "@/features/vault/components/vault-list-with-search"
import { VaultSearchInput } from "@/features/vault/components/vault-search-input"
import { getVaultBookmarks } from "@/features/vault/lib/bookmarks"

const title = "Vault"
const description = "A curated collection of resources, references, and links."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/vault",
  },
  openGraph: {
    url: "/vault",
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

function getVaultJsonLd(
  bookmarks: ReturnType<typeof getVaultBookmarks>
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/vault"),
    name: title,
    description,
    url: absoluteUrl("/vault"),
    isPartOf: { "@id": JSON_LD_ID.website },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: bookmarks.length,
      itemListElement: bookmarks.map((bookmark, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: bookmark.title,
        url: bookmark.url,
      })),
    },
  }
}

export default function Page() {
  const bookmarks = getVaultBookmarks()

  return (
    <>
      <JsonLdScript data={getVaultJsonLd(bookmarks)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Vault",
            href: "/vault",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Vault</PageHeadingTagline>
          <PageHeadingTitle>
            A curated collection of resources, references, and links.
          </PageHeadingTitle>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-top screen-line-bottom p-2">
          <Suspense
            fallback={
              <div className="flex h-9 w-full rounded-lg border border-input dark:bg-input/30" />
            }
          >
            <VaultSearchInput />
          </Suspense>
        </div>

        <Suspense fallback={<VaultList bookmarks={bookmarks} />}>
          <VaultListWithSearch bookmarks={bookmarks} />
        </Suspense>

        <div className="h-4" />
      </div>
    </>
  )
}

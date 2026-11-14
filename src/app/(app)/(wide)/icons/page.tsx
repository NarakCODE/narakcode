import { Suspense } from "react"
import type { Metadata } from "next"
import type { CollectionPage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from "@/components/page-heading"
import { IconsExplorer } from "@/features/icons/components/icons-explorer"
import { getIcons } from "@/features/icons/data"
import type { IconItem } from "@/features/icons/types"

const title = "Glassmorphic Icons"
const description =
  "An interactive directory of curated icon libraries, featuring 249 glassmorphic Nucleo vectors with live accent tinting, search, and instant React/SVG export."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/icons",
  },
  openGraph: {
    url: "/icons",
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

function getIconsJsonLd(icons: IconItem[]): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/icons"),
    name: title,
    description,
    url: absoluteUrl("/icons"),
    isPartOf: { "@id": JSON_LD_ID.website },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: icons.length,
      itemListElement: icons.slice(0, 50).map((icon, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: icon.title,
        url: absoluteUrl(icon.src),
      })),
    },
  }
}

export default function Page() {
  const icons = getIcons("nucleo")

  return (
    <>
      <JsonLdScript data={getIconsJsonLd(icons)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Icons",
            href: "/icons",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTitle>Glassmorphic icons</PageHeadingTitle>
          <PageHeadingDescription>{description}</PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />

        <Suspense
          fallback={
            <div className="screen-line-top screen-line-bottom p-8 text-center font-mono text-sm text-muted-foreground">
              Loading icon explorer...
            </div>
          }
        >
          <IconsExplorer icons={icons} />
        </Suspense>

        <div className="h-6" />
      </div>
    </>
  )
}

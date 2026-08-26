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
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { ToolsList } from "@/features/tools/components/tools-list"
import { ToolsListWithSearch } from "@/features/tools/components/tools-list-with-search"
import { ToolsSearchInput } from "@/features/tools/components/tools-search-input"
import { getTools } from "@/features/tools/data"
import type { Tool } from "@/features/tools/types"

const title = "Tools"
const description =
  "A minimalist, curated directory of design, development, AI, and creative tools."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    url: "/tools",
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

function getToolsJsonLd(tools: Tool[]): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/tools"),
    name: title,
    description,
    url: absoluteUrl("/tools"),
    isPartOf: { "@id": JSON_LD_ID.website },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: tool.url,
      })),
    },
  }
}

export default function Page() {
  const tools = getTools()

  return (
    <>
      <JsonLdScript data={getToolsJsonLd(tools)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Tools",
            href: "/tools",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Tools</PageHeadingTagline>
          <PageHeadingTitle>
            Curated directory of design & dev tools.
          </PageHeadingTitle>
          <PageHeadingDescription>{description}</PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-top screen-line-bottom p-3">
          <Suspense
            fallback={
              <div className="flex h-9 w-full rounded-lg border border-input dark:bg-input/30" />
            }
          >
            <ToolsSearchInput />
          </Suspense>
        </div>

        <div className="p-px">
          <Suspense fallback={<ToolsList tools={tools} />}>
            <ToolsListWithSearch tools={tools} />
          </Suspense>
        </div>

        <div className="screen-line-bottom h-px" />
        <div className="h-6" />
      </div>
    </>
  )
}

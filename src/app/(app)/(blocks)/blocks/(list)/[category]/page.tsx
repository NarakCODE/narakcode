import { Fragment } from "react"
import type { Metadata } from "next"
import type { CollectionPage, WithContext } from "schema-dts"

import { blockCategories } from "@/config/registry"
import { X_HANDLE } from "@/config/site"
import { getAllBlockIds } from "@/lib/blocks"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { BlockDisplay } from "@/app/(preview)/components/block-display"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return blockCategories.map((category) => ({
    category: category.name,
  }))
}

export async function generateMetadata({
  params,
}: PageProps<"/blocks/[category]">): Promise<Metadata> {
  const { category } = await params

  const item = blockCategories.find((item) => item.name === category)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  const categoryUrl = `/blocks/${item.name}`
  const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      url: categoryUrl,
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
}

function getCollectionPageJsonLd(
  category: { name: string; title: string; description: string },
  blockIds: string[]
): WithContext<CollectionPage> {
  const categoryUrl = `/blocks/${category.name}`

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(categoryUrl),
    name: category.title,
    description: category.description,
    url: absoluteUrl(categoryUrl),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: blockIds.length,
      itemListElement: blockIds.map((blockId, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blocks/${category.name}/${blockId}`),
      })),
    },
    isPartOf: {
      "@type": "CollectionPage",
      "@id": absoluteUrl("/blocks"),
      name: "Blocks",
      url: absoluteUrl("/blocks"),
    },
  }
}

export default async function BlocksPage({
  params,
}: PageProps<"/blocks/[category]">) {
  const { category } = await params

  const blockIds = await getAllBlockIds(["registry:block"], [category])

  const categoryItem = blockCategories.find((item) => item.name === category)

  return (
    <>
      {categoryItem && (
        <JsonLdScript data={getCollectionPageJsonLd(categoryItem, blockIds)} />
      )}

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Blocks",
            href: "/blocks",
          },
          {
            name: categoryItem?.title || category,
            href: `/blocks/${category}`,
          },
        ])}
      />

      {blockIds.map((blockId) => (
        <Fragment key={blockId}>
          <BlockDisplay name={blockId} />
          <Separator />
        </Fragment>
      ))}
    </>
  )
}

function Separator() {
  return (
    <div className="screen-line-top screen-line-bottom">
      <div className="stripe-divider" />
    </div>
  )
}

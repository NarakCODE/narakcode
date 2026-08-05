import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  BlogPostPage,
  getBlogPostMetadata,
} from "@/features/doc/components/blog-post-page"
import {
  getBlogPostBySlug,
  getBlogPosts,
  getBlogPostUrl,
} from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return getBlogPosts().map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const slug = (await params).slug
  const doc = getBlogPostBySlug(slug)

  if (!doc) {
    return notFound()
  }

  return getBlogPostMetadata(doc, getBlogPostUrl(slug, "en"))
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const slug = (await params).slug
  const doc = getBlogPostBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <BlogPostPage
      doc={doc}
      language="en"
      postUrl={getBlogPostUrl(slug, "en")}
    />
  )
}

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
import {
  BLOG_LANGUAGES,
  isBlogLanguage,
  type BlogLanguage,
} from "@/features/doc/types/document"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

type BlogLanguagePageProps = {
  params: Promise<{ language: string; slug: string }>
}

export async function generateStaticParams() {
  return BLOG_LANGUAGES.flatMap((language) =>
    getBlogPosts(language).map((doc) => ({
      language,
      slug: doc.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: BlogLanguagePageProps): Promise<Metadata> {
  const { language: rawLanguage, slug } = await params

  if (!isBlogLanguage(rawLanguage)) {
    return notFound()
  }

  const language: BlogLanguage = rawLanguage
  const doc = getBlogPostBySlug(slug, language)

  if (!doc) {
    return notFound()
  }

  return getBlogPostMetadata(doc, getBlogPostUrl(slug, language))
}

export default async function Page({ params }: BlogLanguagePageProps) {
  const { language: rawLanguage, slug } = await params

  if (!isBlogLanguage(rawLanguage)) {
    notFound()
  }

  const language: BlogLanguage = rawLanguage
  const doc = getBlogPostBySlug(slug, language)

  if (!doc) {
    notFound()
  }

  return (
    <BlogPostPage
      doc={doc}
      language={language}
      postUrl={getBlogPostUrl(slug, language)}
    />
  )
}

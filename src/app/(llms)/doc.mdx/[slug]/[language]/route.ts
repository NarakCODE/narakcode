import { notFound } from "next/navigation"

import { getBlogPostBySlug, getBlogPosts } from "@/features/doc/data/documents"
import { getLLMText } from "@/features/doc/lib/get-llm-text"
import { BLOG_LANGUAGES, isBlogLanguage } from "@/features/doc/types/document"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return BLOG_LANGUAGES.flatMap((language) =>
    getBlogPosts(language).map((doc) => ({
      language,
      slug: doc.slug,
    }))
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ language: string; slug: string }> }
) {
  const { language: rawLanguage, slug } = await params

  if (!isBlogLanguage(rawLanguage)) {
    notFound()
  }

  const post = getBlogPostBySlug(slug, rawLanguage)

  if (!post) {
    notFound()
  }

  return new Response(await getLLMText(post), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}

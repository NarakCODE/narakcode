import { notFound } from "next/navigation"

import { markdownResponse } from "@/lib/markdown-response"
import { getAllDocs, getDocBySlug } from "@/features/doc/data/documents"
import { getLLMText } from "@/features/doc/lib/get-llm-text"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const docs = getAllDocs().filter((doc) => doc.language !== "km")

  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const post = getDocBySlug(slug)

  if (!post) {
    notFound()
  }

  return markdownResponse(await getLLMText(post), { negotiated: true })
}

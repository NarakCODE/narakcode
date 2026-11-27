import { describe, expect, it } from "vitest"

import {
  findNeighbour,
  getAllDocs,
  getBlogPostBySlug,
  getBlogPostLanguages,
  getBlogPostUrl,
  getDocBySlug,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

const docs = [{ slug: "a" }, { slug: "b" }, { slug: "c" }] as unknown as Doc[]

describe("findNeighbour", () => {
  it("returns previous and next for a middle item", () => {
    const result = findNeighbour(docs, "b")
    expect(result.previous?.slug).toBe("a")
    expect(result.next?.slug).toBe("c")
  })

  it("returns null previous and a next for the first item", () => {
    const result = findNeighbour(docs, "a")
    expect(result.previous).toBeNull()
    expect(result.next?.slug).toBe("b")
  })

  it("returns a previous and null next for the last item", () => {
    const result = findNeighbour(docs, "c")
    expect(result.previous?.slug).toBe("b")
    expect(result.next).toBeNull()
  })

  it("returns both null for a single-element list", () => {
    const single = [{ slug: "only" }] as unknown as Doc[]
    const result = findNeighbour(single, "only")
    expect(result.previous).toBeNull()
    expect(result.next).toBeNull()
  })

  it("returns both null when the slug is missing", () => {
    const result = findNeighbour(docs, "missing")
    expect(result.previous).toBeNull()
    expect(result.next).toBeNull()
  })
})

describe("localized blog posts", () => {
  const slug = "openai-cuts-gpt-56-pricing-and-adds-fast-mode-to-the-api"

  it("loads the English and Khmer variants by language", () => {
    expect(getBlogPostBySlug(slug, "en")?.language).toBe("en")
    expect(getBlogPostBySlug(slug, "km")?.language).toBe("km")
    expect(getBlogPostLanguages(slug)).toEqual(["en", "km"])
  })

  it("keeps the English URL canonical and gives translations a language path", () => {
    expect(getBlogPostUrl(slug, "en")).toBe(`/blog/${slug}`)
    expect(getBlogPostUrl(slug, "km")).toBe(`/blog/${slug}/km`)
  })
})

describe("doc metadata and slug lookup", () => {
  it("normalizes createdAt and updatedAt to strings across all docs", () => {
    const allDocs = getAllDocs()
    expect(allDocs.length).toBeGreaterThan(0)

    for (const doc of allDocs) {
      expect(typeof doc.metadata.createdAt).toBe("string")
      expect(typeof doc.metadata.updatedAt).toBe("string")
      expect(doc.metadata.createdAt.length).toBeGreaterThan(0)
      expect(doc.metadata.updatedAt.length).toBeGreaterThan(0)
    }
  })

  it("scopes getDocBySlug when category is provided", () => {
    expect(getDocBySlug("testimonials-marquee", "en", "components")?.slug).toBe(
      "testimonials-marquee"
    )
    expect(getDocBySlug("testimonials-marquee", "en", "blog")).toBeUndefined()
  })
})

import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"

import {
  DEFAULT_BLOG_LANGUAGE,
  isBlogLanguage,
  type BlogLanguage,
  type Doc,
  type DocMetadata,
} from "@/features/doc/types/document"

export const BLOG_CATEGORY = "blog"
export const COMPONENTS_CATEGORY = "components"

function normalizeFrontmatterDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return typeof value === "string" ? value : String(value ?? "")
}

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)
  const data = file.data as Record<string, unknown>

  return {
    metadata: {
      ...data,
      createdAt: normalizeFrontmatterDate(data.createdAt),
      updatedAt: normalizeFrontmatterDate(data.updatedAt),
    } as DocMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function readDoc(filePath: string, category: string, language?: BlogLanguage) {
  const { metadata, content } = readMDXFile(filePath)
  const slug = path.basename(filePath, path.extname(filePath))

  return {
    metadata: { ...metadata, category },
    slug,
    ...(language ? { language } : {}),
    content,
  } satisfies Doc
}

/**
 * Reads MDX docs from `dir`, grouping them by their immediate subfolder.
 * Blog posts may have one additional language directory, such as
 * `content/blog/en/*.mdx` or `content/blog/km/*.mdx`.
 */
function getMDXData(dir: string) {
  const categoryDirs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())

  return categoryDirs.flatMap((categoryDir) => {
    const category = categoryDir.name
    const categoryPath = path.join(dir, category)
    const defaultLanguage =
      category === BLOG_CATEGORY ? DEFAULT_BLOG_LANGUAGE : undefined

    const directDocs = getMDXFiles(categoryPath).map((file) =>
      readDoc(path.join(categoryPath, file), category, defaultLanguage)
    )

    if (category !== BLOG_CATEGORY) {
      return directDocs
    }

    const localizedDocs = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && isBlogLanguage(entry.name))
      .flatMap((languageDir) => {
        const language = languageDir.name as BlogLanguage
        const languagePath = path.join(categoryPath, language)

        return getMDXFiles(languagePath).map((file) =>
          readDoc(path.join(languagePath, file), category, language)
        )
      })

    return [...directDocs, ...localizedDocs]
  })
}

export const getAllDocs = cache(() => {
  return getMDXData(path.join(process.cwd(), "src/features/doc/content")).sort(
    (a, b) => {
      if (a.metadata.pinned && !b.metadata.pinned) return -1
      if (!a.metadata.pinned && b.metadata.pinned) return 1

      return (
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
      )
    }
  )
})

export function getDocBySlug(
  slug: string,
  language: BlogLanguage = DEFAULT_BLOG_LANGUAGE,
  category?: string
) {
  return getAllDocs().find(
    (doc) =>
      doc.slug === slug &&
      (category === undefined || doc.metadata.category === category) &&
      (doc.metadata.category !== BLOG_CATEGORY ||
        (doc.language ?? DEFAULT_BLOG_LANGUAGE) === language)
  )
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata?.category === category)
}

/** Blog posts — docs under the `blog/` content folder. */
export function getBlogPosts(language: BlogLanguage = DEFAULT_BLOG_LANGUAGE) {
  return getDocsByCategory(BLOG_CATEGORY).filter(
    (doc) => (doc.language ?? DEFAULT_BLOG_LANGUAGE) === language
  )
}

export function getBlogPostBySlug(
  slug: string,
  language: BlogLanguage = DEFAULT_BLOG_LANGUAGE
) {
  return getBlogPosts(language).find((doc) => doc.slug === slug)
}

export function getBlogPostLanguages(slug: string) {
  return (["en", "km"] as BlogLanguage[]).filter((language) =>
    getBlogPostBySlug(slug, language)
  )
}

export function getBlogPostUrl(slug: string, language: BlogLanguage) {
  return language === DEFAULT_BLOG_LANGUAGE
    ? `/blog/${slug}`
    : `/blog/${slug}/${language}`
}

/** Component docs — docs under the `components/` content folder. */
export function getComponentDocs() {
  return getDocsByCategory(COMPONENTS_CATEGORY)
}

export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length

  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}

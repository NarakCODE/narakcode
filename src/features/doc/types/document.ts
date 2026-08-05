export const BLOG_LANGUAGES = ["en", "km"] as const

export type BlogLanguage = (typeof BLOG_LANGUAGES)[number]

export const DEFAULT_BLOG_LANGUAGE: BlogLanguage = "en"

export const isBlogLanguage = (
  value: string | undefined
): value is BlogLanguage => {
  return value !== undefined && BLOG_LANGUAGES.includes(value as BlogLanguage)
}

export type DocMetadata = {
  title: string
  description: string
  /**
   * Social/OG image URL for the post.
   * Use an absolute URL or a path under /public. Recommended size: 1200x630.
   */
  image?: string
  /**
   * Category identifier, derived from the doc's content subfolder
   * (e.g. `content/components/*` → "components"). Not declared in frontmatter;
   * injected when docs are read. Used for filtering (see getDocsByCategory).
   */
  category?: string
  /**
   * Flag to show a "New" badge/highlight in the UI.
   */
  new?: boolean
  updated?: boolean
  /**
   * Flag to pin the post to the top of the list.
   */
  pinned?: boolean
  /**
   * Post creation date as an ISO date string (e.g. YYYY-MM-DD). Used for sorting.
   */
  createdAt: string
  /**
   * Last updated date as an ISO date string (e.g. YYYY-MM-DD).
   */
  updatedAt: string
}

export type Doc = {
  /** Parsed frontmatter metadata from the MDX file. */
  metadata: DocMetadata
  /** Slug derived from the MDX filename (without extension). */
  slug: string
  /** Language directory for localized blog posts. */
  language?: BlogLanguage
  /** MDX content body without frontmatter. */
  content: string
}

/**
 * Minimal doc data for client components that don't need the full content.
 * Reduces serialization overhead and bundle size.
 */
export type DocPreview = {
  slug: string
  title: string
  category?: string
}

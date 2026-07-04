"use client"

import { useQueryState } from "nuqs"

import type { Bookmark } from "@/features/portfolio/types/bookmarks"

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "")

const matchesQuery = (bookmark: Bookmark, normalizedQuery: string) => {
  const values = [
    bookmark.title,
    bookmark.author ?? "",
    bookmark.category,
    bookmark.url,
  ]

  return values.some((value) => normalize(value).includes(normalizedQuery))
}

const searchBookmarks = (bookmarks: Bookmark[], query: string | null) => {
  if (!query) return bookmarks

  const normalizedQuery = normalize(query)
  return bookmarks.filter((bookmark) => matchesQuery(bookmark, normalizedQuery))
}

export function useFilteredBookmarks(bookmarks: Bookmark[]) {
  const [query] = useQueryState("q", {
    defaultValue: "",
  })

  return searchBookmarks(bookmarks, query)
}

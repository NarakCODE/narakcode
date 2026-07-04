import { compareDesc } from "date-fns"

import { BOOKMARKS } from "@/features/portfolio/data/bookmarks"

export function getVaultBookmarks() {
  return [...BOOKMARKS].sort((a, b) => {
    return compareDesc(new Date(a.bookmarkedAt), new Date(b.bookmarkedAt))
  })
}

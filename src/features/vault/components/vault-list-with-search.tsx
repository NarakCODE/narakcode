"use client"

import type { Bookmark } from "@/features/portfolio/types/bookmarks"

import { useFilteredBookmarks } from "../hooks/use-filtered-bookmarks"
import { VaultList } from "./vault-list"

export function VaultListWithSearch({ bookmarks }: { bookmarks: Bookmark[] }) {
  const filteredBookmarks = useFilteredBookmarks(bookmarks)
  return <VaultList bookmarks={filteredBookmarks} />
}

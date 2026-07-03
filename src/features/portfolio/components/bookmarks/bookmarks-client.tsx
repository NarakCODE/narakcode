"use client"

import dynamic from "next/dynamic"

export const BookmarksClient = dynamic(
  () => import("./index").then((mod) => mod.Bookmarks),
  { ssr: false }
)

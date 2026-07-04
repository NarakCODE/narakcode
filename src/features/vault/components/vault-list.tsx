import { cn } from "@/lib/utils"
import type { Bookmark } from "@/features/portfolio/types/bookmarks"

import { VaultItem } from "./vault-item"

export function VaultList({ bookmarks }: { bookmarks: Bookmark[] }) {
  return (
    <div className="relative pt-4">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-r border-line" />
        <div className="border-l border-line" />
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {bookmarks.map((bookmark, index) => (
          <li
            key={bookmark.url}
            className={cn(
              "max-sm:screen-line-top max-sm:screen-line-bottom",
              "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
            )}
          >
            <VaultItem
              bookmark={bookmark}
              imageLoading={index <= 3 ? "eager" : "lazy"}
            />
          </li>
        ))}

        {bookmarks.length === 0 && (
          <li className="screen-line-top screen-line-bottom p-4">
            <p className="font-mono text-sm">No bookmarks found.</p>
          </li>
        )}
      </ul>
    </div>
  )
}

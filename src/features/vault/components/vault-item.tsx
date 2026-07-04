import { formatDate } from "@/utils/format"
import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import type { Bookmark } from "@/features/portfolio/types/bookmarks"

function getYouTubeThumbnail(url: string) {
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0]
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null
  }

  if (url.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(url)
      const videoId = urlObj.searchParams.get("v")
      return videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : null
    } catch {
      return null
    }
  }

  return null
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function VaultItem({
  bookmark,
  imageLoading = "lazy",
}: {
  bookmark: Bookmark
  imageLoading?: "eager" | "lazy"
}) {
  const imageUrl = bookmark.image ?? getYouTubeThumbnail(bookmark.url)
  const domain = getDomain(bookmark.url)

  return (
    <div className="group/vault relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted">
      {imageUrl ? (
        <div className="relative select-none [--image-radius:var(--radius-xl)]">
          <img
            className="aspect-1200/630 w-full rounded-(--image-radius) object-cover transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] sm:grayscale sm:group-hover/vault:grayscale-0"
            src={imageUrl}
            alt=""
            loading={imageLoading}
          />
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      ) : (
        <div className="relative flex aspect-1200/630 flex-col justify-end overflow-hidden rounded-(--image-radius) bg-accent p-4 select-none [--image-radius:var(--radius-xl)]">
          <p className="font-mono text-xs text-muted-foreground">{domain}</p>
          <p className="line-clamp-3 text-lg leading-snug font-medium text-balance">
            {bookmark.title}
          </p>
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <h2 className="text-lg leading-snug font-medium text-balance">
          <a
            href={addQueryParams(bookmark.url, UTM_PARAMS)}
            target="_blank"
            rel="noopener"
          >
            <span className="absolute inset-0" aria-hidden />
            {bookmark.title}
          </a>
        </h2>

        <dl className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {bookmark.author && (
            <div>
              <dt className="sr-only">Author</dt>
              <dd>{bookmark.author}</dd>
            </div>
          )}

          <div>
            <dt className="sr-only">Category</dt>
            <dd>{bookmark.category}</dd>
          </div>

          <div>
            <dt className="sr-only">Bookmarked on</dt>
            <dd>
              <time dateTime={bookmark.bookmarkedAt}>
                {formatDate(bookmark.bookmarkedAt, "dd.MM.yyyy")}
              </time>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

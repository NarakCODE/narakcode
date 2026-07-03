import type { ImageProps } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/utils/format"

import { PostExample as DropDrawerPreview } from "@/registry/examples/dropdown-drawer-demo"
import MorphingPillDemo from "@/registry/examples/morphing-pill-demo"
import PinListDemo from "@/registry/examples/pin-list-demo"
import type { Doc } from "@/features/doc/types/document"

type HeadingTypes = "h2" | "h3" | "h4"

export function PostItem({
  post,
  headingAs,
  imageLoading = "lazy",
}: {
  post: Doc
  headingAs?: HeadingTypes
  imageLoading?: ImageProps["loading"]
}) {
  const Heading = headingAs ?? "h2"

  return (
    <div className="group/post relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted">
      {post.slug === "dropdown-drawer" ? (
        <div className="relative flex aspect-1200/630 items-center justify-center overflow-hidden rounded-(--image-radius) bg-background select-none [--image-radius:var(--radius-xl)]">
          <div className="pointer-events-none w-full max-w-md origin-center translate-y-8 scale-[0.6] transform-gpu rounded-xl bg-background shadow-xl sm:translate-y-10 sm:scale-[0.7]">
            <DropDrawerPreview />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      ) : post.slug === "pin-list" ? (
        <div className="relative flex aspect-1200/630 items-center justify-center overflow-hidden rounded-(--image-radius) bg-background select-none [--image-radius:var(--radius-xl)]">
          <div className="pointer-events-none w-full max-w-sm origin-center translate-y-16 scale-[0.55] transform-gpu rounded-3xl border border-border/50 bg-accent/30 p-6 shadow-sm sm:translate-y-20 sm:scale-[0.65]">
            <PinListDemo />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      ) : post.slug === "morphing-pill" ? (
        <div className="relative flex aspect-1200/630 items-center justify-center overflow-hidden rounded-(--image-radius) bg-background select-none [--image-radius:var(--radius-xl)]">
          <div className="pointer-events-none w-full origin-center scale-[0.7] transform-gpu sm:scale-[0.8]">
            <MorphingPillDemo />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      ) : post.metadata.image &&
        /\.(mp4|webm|mov)$/i.test(post.metadata.image) ? (
        <div className="relative select-none [--image-radius:var(--radius-xl)]">
          <video
            className="aspect-1200/630 w-full rounded-(--image-radius) object-cover grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/post:grayscale-0"
            src={post.metadata.image}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      ) : (
        post.metadata.image && (
          <div className="relative select-none [--image-radius:var(--radius-xl)]">
            <Image
              className="aspect-1200/630 rounded-(--image-radius) grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/post:grayscale-0"
              src={post.metadata.image}
              alt={post.metadata.title}
              width={1200}
              height={630}
              quality={100}
              loading={imageLoading}
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
          </div>
        )
      )}

      <div className="flex flex-col gap-1 p-2">
        <Heading className="text-lg leading-snug font-medium text-balance">
          <Link href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden />
            {post.metadata.title}
          </Link>

          {(post.metadata.new || post.metadata.updated) && (
            <span className="pointer-events-none ml-2 inline-block size-2 -translate-y-px rounded-full bg-info">
              <span className="sr-only">
                {post.metadata.new ? "New" : "Updated"}
              </span>
            </span>
          )}
        </Heading>

        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className="text-sm text-muted-foreground">
            <time dateTime={post.metadata.createdAt}>
              {formatDate(post.metadata.createdAt, "dd.MM.yyyy")}
            </time>
          </dd>
        </dl>
      </div>
    </div>
  )
}

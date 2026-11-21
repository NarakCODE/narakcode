import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { ChanhDaiMark } from "@/components/chanhdai-mark"
import {
  Foldable,
  FoldableCover,
  FoldableInsideLeft,
  FoldableInsideRight,
  FoldableSlider,
  FoldableStage,
} from "@/registry/components/foldable"

const PROFILE = {
  displayName: "NarakCODE",
  jobTitle: "Software Developer",
  bio: "Creating with code, driven by passion.",
  address: "Phnom Penh, Cambodia",
  avatar: "/images/avatar-profile.jpg",
}

type Post = {
  title: string
  date: string
}

const POSTS: Post[] = [
  { title: "Building a responsive DropDrawer component", date: "14.04.2026" },
  { title: "Interactive Pin List with layout animations", date: "02.03.2026" },
  { title: "Designing a Morphing Pill navigation bar", date: "18.02.2026" },
  { title: "Crafting tactile web interfaces with motion", date: "09.01.2026" },
  { title: "Shipping a custom shadcn component registry", date: "20.11.2025" },
]

export default function FoldableSpreadDemo() {
  return (
    <Foldable className="[--foldable-radius:--spacing(10)]">
      {/* A container one page wide: sizes follow the page, not the screen. */}
      <FoldableStage className="@container/foldable">
        <FoldableInsideRight>
          <SpreadHalf side="right">
            <InnerView />
          </SpreadHalf>
        </FoldableInsideRight>
        <FoldableCover>
          <OuterView />
        </FoldableCover>
        <FoldableInsideLeft>
          <SpreadHalf side="left">
            <InnerView />
          </SpreadHalf>
        </FoldableInsideLeft>
      </FoldableStage>

      <FoldableSlider />
    </Foldable>
  )
}

/** One page's window onto the two-page inner view. */
function SpreadHalf({
  side,
  children,
}: {
  side: "left" | "right"
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 w-[200%]",
        side === "left" ? "left-0" : "right-0"
      )}
    >
      {children}
    </div>
  )
}

function OuterView() {
  return (
    <div className="flex size-full flex-col">
      <Cover />
      <Profile className="px-[7.5cqw]">
        <Bio className="@max-xs/foldable:hidden" />
      </Profile>
      <PostList
        posts={POSTS.slice(0, 3)}
        className="mt-auto px-[7.5cqw] pb-[8cqw] @max-xs/foldable:pt-3 @max-xs/foldable:[&_li:nth-child(n+2)]:hidden @max-xs/foldable:[&>p]:hidden"
      />
    </div>
  )
}

function InnerView() {
  return (
    <div className="flex size-full flex-col">
      {/* Spans both pages, like a wallpaper across the crease. */}
      <Cover />
      <div className="grid flex-1 grid-cols-2">
        <Profile className="px-[7.5cqw] pb-[8cqw]">
          <Bio />
          <p className="text-sm text-muted-foreground @max-xs/foldable:hidden">
            {PROFILE.address}
          </p>
        </Profile>
        <PostList
          posts={POSTS}
          className="px-[7.5cqw] pt-[6.25cqw] pb-[8cqw] @max-xs/foldable:[&_li:nth-child(n+3)]:hidden"
        />
      </div>
    </div>
  )
}

function Cover() {
  return (
    <div className="flex h-[35cqw] shrink-0 items-center justify-center border-b bg-muted">
      <ChanhDaiMark className="size-[10cqw]" />
    </div>
  )
}

function Profile({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn("flex flex-col gap-3 @max-xs/foldable:gap-2", className)}
    >
      <img
        className="mt-[calc(max(2.5rem,20cqw)/-2)] size-[max(2.5rem,20cqw)] rounded-full border-4 border-background object-cover @max-xs/foldable:border-2"
        src={PROFILE.avatar}
        alt=""
        draggable={false}
      />
      <div>
        <p className="text-xl font-medium tracking-tight @max-xs/foldable:text-base">
          {PROFILE.displayName}
        </p>
        <p className="text-sm text-muted-foreground @max-xs/foldable:text-xs">
          {PROFILE.jobTitle}
        </p>
      </div>
      {children}
    </div>
  )
}

function Bio({ className }: { className?: string }) {
  return (
    <p
      className={cn("text-sm text-balance @max-xs/foldable:text-xs", className)}
    >
      {PROFILE.bio}
    </p>
  )
}

function PostList({ posts, className }: { posts: Post[]; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 font-mono text-xs text-muted-foreground">Blog</p>
      <ul className="border-b">
        {posts.map((post) => (
          <li
            key={post.title}
            className="flex flex-col gap-0.5 border-t py-2 @max-xs/foldable:py-1.5"
          >
            <span className="truncate text-sm font-medium @max-xs/foldable:text-xs">
              {post.title}
            </span>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {post.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

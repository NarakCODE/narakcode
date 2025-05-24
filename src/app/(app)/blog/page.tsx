import dayjs from "dayjs";
import { ChevronLeftIcon, RssIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PostItem } from "@/components/post-item";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
};

export default function Page() {
  const allPosts = getAllPosts();

  return (
    <>
      <div className="screen-line-after flex pb-4">
        <Button variant="link" className="px-2 text-base" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-5" />
            Home
          </Link>
        </Button>
      </div>

      <div className="screen-line-after flex items-center gap-2 px-4">
        <h1 className="font-heading text-3xl font-semibold">All Posts</h1>

        <Button variant="ghost" size="icon" asChild>
          <a href="/rss" target="_blank" rel="noopener noreferrer">
            <RssIcon />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </div>

      <div className="relative pt-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge"></div>
          <div className="border-l border-edge"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allPosts
            .slice()
            .sort((a, b) =>
              dayjs(b.metadata.createdAt).diff(dayjs(a.metadata.createdAt))
            )
            .map((post, index) => (
              <PostItem
                key={post.slug}
                post={post}
                shouldPreloadImage={index <= 4}
              />
            ))}
        </div>
      </div>

      <div className="h-4" />
    </>
  );
}

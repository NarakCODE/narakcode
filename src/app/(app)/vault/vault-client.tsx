"use client";

import { ChevronRight, Compass, ExternalLink, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { vaults } from "@/data/vault-items";

export function VaultDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = useMemo(() => {
    return vaults.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.channel.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  return (
    <div className="space-y-6 pt-4">
      {/* Search Filter */}
      <div className="px-4">
        <div className="relative flex max-w-lg items-center rounded-lg border border-edge bg-muted/20 transition-all focus-within:ring-2 focus-within:ring-amber-500/40 dark:border-zinc-800/80 dark:bg-zinc-950/20">
          <Search className="absolute left-3 size-4 text-muted-foreground select-none" />
          <Input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-0 bg-transparent pr-4 pl-9 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mr-1 px-2.5 font-mono text-[10px] font-bold text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="relative px-4 pb-8">
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {filteredBookmarks.map((item, index) => {
              const isYouTube =
                item.href.includes("youtu.be/") ||
                item.href.includes("youtube.com/");

              return (
                <Card
                  className="flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-edge bg-muted/20 py-0 shadow-none backdrop-blur-xs dark:border-zinc-800/80 dark:bg-zinc-950/20"
                  key={index}
                >
                  <CardHeader className="relative p-0">
                    <div className="relative aspect-video w-full overflow-hidden border-b bg-zinc-950/30">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={"secondary"} className="font-mono">
                          {item.channel}
                        </Badge>
                      </div>

                      <h3 className="mt-3.5 text-base leading-snug font-semibold tracking-tight">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mt-5">
                      <Button
                        className="flex w-full items-center justify-center gap-1.5 text-xs font-bold shadow-none"
                        asChild
                      >
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isYouTube ? "Watch Video" : "Open Link"}
                          {isYouTube ? (
                            <ChevronRight className="size-3.5" />
                          ) : (
                            <ExternalLink className="size-3" />
                          )}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto my-6 flex max-w-md flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-edge/60 bg-muted/5 p-8 text-center dark:border-zinc-800/60 dark:bg-zinc-950/5">
            <div className="rounded-full border border-edge/40 bg-background p-3 text-muted-foreground dark:border-zinc-800">
              <Compass className="stroke-1.25 size-8 animate-pulse text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold">
                No bookmarks found
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We couldn&apos;t find any bookmarks matching &ldquo;
                {searchQuery}&rdquo;.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
              }}
              className="border-edge font-mono text-xs font-bold hover:bg-muted dark:border-zinc-800"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

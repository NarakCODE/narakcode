"use client";

import {
  BookOpen,
  ChevronRight,
  Compass,
  Headphones,
  Laptop,
  Package,
  Search,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VAULT_ITEMS } from "@/data/vault-items";
import { cn } from "@/lib/utils";
import type {
  VaultCategory,
  VaultItem,
  VaultItemCategory,
} from "@/types/vault";
import { VAULT_TAB_CATEGORIES } from "@/types/vault";

const categoryIcons: Record<VaultItemCategory, typeof Sparkles> = {
  animations: Sparkles,
  resources: BookOpen,
  products: Laptop,
  accessories: Headphones,
};

const categoryTabLabels: Record<VaultCategory, string> = {
  all: "All",
  animations: "Animations",
  resources: "Resources",
  products: "Products",
  accessories: "Accessories",
};

const itemCategoryLabels: Record<VaultItemCategory, string> = {
  animations: "Animation Lib",
  resources: "Resource",
  products: "Product",
  accessories: "Accessory",
};

const usesIframePreview = (category: VaultItemCategory) =>
  category === "animations" || category === "resources";

export function VaultDashboard() {
  const [activeCategory, setActiveCategory] = useState<VaultCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return VAULT_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<VaultCategory, number> = {
      all: VAULT_ITEMS.length,
      animations: 0,
      resources: 0,
      products: 0,
      accessories: 0,
    };

    VAULT_ITEMS.forEach((item) => {
      counts[item.category]++;
    });

    return counts;
  }, []);

  const getGlowColor = (color: string) => {
    switch (color) {
      case "amber":
        return "from-amber-500/20 to-yellow-500/5";
      case "indigo":
        return "from-indigo-500/20 to-blue-500/5";
      case "emerald":
        return "from-emerald-500/20 to-teal-500/5";
      case "sky":
        return "from-sky-500/20 to-cyan-500/5";
      case "violet":
        return "from-violet-500/20 to-purple-500/5";
      case "rose":
        return "from-rose-500/20 to-pink-500/5";
      case "cyan":
        return "from-cyan-500/20 to-sky-500/5";
      case "zinc":
        return "from-zinc-500/20 to-neutral-500/5";
      default:
        return "from-zinc-500/10 to-transparent";
    }
  };

  const renderPreview = (item: VaultItem) => {
    if (item.image) {
      return (
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-95"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      );
    }

    if (usesIframePreview(item.category)) {
      return (
        <>
          <iframe
            src={item.link}
            title={item.title}
            className="pointer-events-none h-full w-full scale-[1.01] border-0 opacity-80 transition-opacity duration-300 select-none group-hover:opacity-95"
            loading="lazy"
            scrolling="no"
          />
          <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />
        </>
      );
    }

    const Icon = categoryIcons[item.category];

    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br p-6",
          getGlowColor(item.color)
        )}
      >
        <Icon className="size-12 text-foreground/30" strokeWidth={1.25} />
        <Package className="size-5 text-muted-foreground/50" />
      </div>
    );
  };

  const getActionLabel = (category: VaultItemCategory) =>
    usesIframePreview(category) ? "Open Resource" : "View Product";

  return (
    <div className="space-y-6 pt-4">
      <p className="max-w-2xl px-4 text-sm leading-relaxed text-muted-foreground">
        Animation libraries, dev resources, and the products & accessories I use
        daily — curated in one place.
      </p>

      <div className="px-4">
        <div className="relative flex max-w-lg items-center rounded-lg border border-edge bg-muted/20 transition-all focus-within:ring-2 focus-within:ring-amber-500/40 dark:border-zinc-800/80 dark:bg-zinc-950/20">
          <Search className="absolute left-3 size-4 text-muted-foreground select-none" />
          <Input
            type="text"
            placeholder="Search vault..."
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

      <Tabs
        defaultValue="all"
        value={activeCategory}
        onValueChange={(val) => setActiveCategory(val as VaultCategory)}
        className="w-full space-y-6"
      >
        <div className="px-4">
          <TabsList className="flex h-auto w-full max-w-full flex-wrap gap-1 rounded-lg border border-edge/60 bg-muted/50 p-1 select-none sm:w-fit">
            {VAULT_TAB_CATEGORIES.map((category) => {
              const count = categoryCounts[category];

              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium shadow-none transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <span>{categoryTabLabels[category]}</span>
                  <span className="inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.25 font-mono text-[10px] text-muted-foreground">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="relative px-4 pb-8">
          {VAULT_TAB_CATEGORIES.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="mt-0 outline-none"
            >
              {activeCategory === category &&
                (filteredItems.length > 0 ? (
                  <div className="relative">
                    <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
                      <div className="border-r border-edge" />
                      <div className="border-l border-edge" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {filteredItems.map((item) => (
                        <Card
                          className="group flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-edge bg-muted/20 py-0 shadow-none backdrop-blur-xs dark:border-zinc-800/80 dark:bg-zinc-950/20"
                          key={item.id}
                        >
                          <CardHeader className="relative p-0">
                            <div className="relative aspect-video w-full overflow-hidden border-b bg-zinc-950/30">
                              {renderPreview(item)}
                              <div
                                className={cn(
                                  "pointer-events-none absolute -top-12 -right-12 -z-1 size-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100",
                                  getGlowColor(item.color)
                                )}
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-1 flex-col justify-between p-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <Badge className="rounded border border-primary/10 bg-primary/5 px-1.5 py-0 font-mono text-[10px] font-medium text-primary capitalize shadow-none hover:bg-primary/5">
                                  {itemCategoryLabels[item.category]}
                                </Badge>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {item.readTime}
                                </span>
                              </div>

                              <h3 className="mt-4 text-[1.25rem] font-semibold tracking-tight transition-colors duration-200 group-hover:text-amber-500">
                                {item.title}
                              </h3>
                              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {item.description}
                              </p>
                              {item.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {item.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-md border border-edge/60 bg-muted/40 px-1.5 py-0.25 font-mono text-[10px] text-muted-foreground"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="mt-5">
                              <Button
                                className="flex w-full items-center justify-center gap-1 text-xs font-bold shadow-none"
                                asChild
                              >
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {getActionLabel(item.category)}
                                  <ChevronRight className="ml-0.5 size-3.5" />
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto my-6 flex max-w-md flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-edge/60 bg-muted/5 p-8 text-center dark:border-zinc-800/60 dark:bg-zinc-950/5">
                    <div className="rounded-full border border-edge/40 bg-background p-3 text-muted-foreground dark:border-zinc-800">
                      <Compass className="stroke-1.25 size-8 animate-pulse text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading text-sm font-bold">
                        No items matching selection
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        We couldn&apos;t find any resources matching &ldquo;
                        {searchQuery}&rdquo; in this category.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("all");
                      }}
                      className="border-edge font-mono text-xs font-bold hover:bg-muted dark:border-zinc-800"
                    >
                      Reset Filters
                    </Button>
                  </div>
                ))}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

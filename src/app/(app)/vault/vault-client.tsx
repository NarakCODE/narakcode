"use client";

import {
  BookOpen,
  Check,
  ChevronRight,
  Code,
  Compass,
  Copy,
  ExternalLink,
  Search,
  Sparkle,
  Sparkles,
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Category Types (snippets and design deprecated as empty)
type VaultCategory = "all" | "animations" | "resources";

interface VaultItem {
  id: string;
  title: string;
  description: string;
  category: "animations" | "resources";
  tags: string[];
  color: string; // Theme color (emerald, sky, violet, rose, cyan, amber, indigo)
  readTime: string; // Metric info label
  link: string;
}

// Icon Mapping helper
const categoryIcons = {
  animations: Sparkles,
  resources: BookOpen,
};

export function VaultDashboard() {
  const [activeCategory, setActiveCategory] = useState<VaultCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock Vault Items (Requested items removed cleanly!)
  const vaultItems: VaultItem[] = useMemo(
    () => [
      // Category: animations (Animation Libraries)
      {
        id: "cursify",
        title: "Cursify",
        description:
          "Beautiful animated custom cursor components for modern Next.js and React interfaces.",
        category: "animations",
        tags: ["Cursors", "React", "Interactions"],
        color: "rose",
        readTime: "Custom Cursor Library",
        link: "https://cursify.vercel.app/",
      },

      {
        id: "magic-ui",
        title: "Magic UI",
        description:
          "Design highly interactive landing pages utilizing ready-to-use animated React components.",
        category: "animations",
        tags: ["React Components", "Framer Motion", "Landing Pages"],
        color: "violet",
        readTime: "Animated Library",
        link: "https://magicui.design/",
      },
      {
        id: "eldora-ui",
        title: "Eldora UI",
        description:
          "Creative animated components crafted using Framer Motion and Tailwind CSS styles.",
        category: "animations",
        tags: ["Framer Motion", "Tailwind", "React"],
        color: "sky",
        readTime: "Sleek Presets",
        link: "https://www.eldoraui.site/",
      },
      {
        id: "aceternity-ui",
        title: "Aceternity UI",
        description:
          "Stunning, high-end copy-paste React components that embed creative three.js physics canvases.",
        category: "animations",
        tags: ["React Components", "Three.js", "Creative UI"],
        color: "emerald",
        readTime: "High-End Component Hub",
        link: "https://ui.aceternity.com/",
      },
      {
        id: "bossadizenith-ui",
        title: "Bossadizenith UI",
        description:
          "Dynamic landing pages and responsive grids using creative custom GSAP timeline chains.",
        category: "animations",
        tags: ["GSAP Timelines", "CSS Layouts", "Next.js"],
        color: "rose",
        readTime: "GSAP Repository",
        link: "https://ground.bossadizenith.me/",
      },
      {
        id: "cuicui",
        title: "C UI (Cuicui)",
        description:
          "A gorgeous collection of clean Tailwind and Framer Motion components designed for quick imports.",
        category: "animations",
        tags: ["Tailwind Presets", "Framer Motion", "Copy-Paste"],
        color: "amber",
        readTime: "Modular Component Lib",
        link: "https://cuicui.day/",
      },
      {
        id: "react-bits",
        title: "React Bits",
        description:
          "An animated, interactive, and responsive open-source gallery of standalone React items.",
        category: "animations",
        tags: ["React Elements", "Creative UI", "Standalone"],
        color: "cyan",
        readTime: "React Animation Library",
        link: "https://www.reactbits.dev/",
      },
      {
        id: "ui-layouts",
        title: "UI Layouts",
        description:
          "A curated layout panel of clean grids, expandable cards, and creative responsive page frameworks.",
        category: "animations",
        tags: ["Multi-column", "Grids", "Responsive UI"],
        color: "violet",
        readTime: "Responsive Grids Library",
        link: "https://www.ui-layouts.com/",
      },
      {
        id: "motion-primitives",
        title: "Motion Primitives",
        description:
          "Polished animated compound items engineered on top of Framer Motion and Radix primitives.",
        category: "animations",
        tags: ["Radix UI", "Framer Motion", "Accessible"],
        color: "rose",
        readTime: "Accessible Animation Lib",
        link: "https://motion-primitives.com/",
      },
      {
        id: "uiverse",
        title: "Uiverse",
        description:
          "A massive library of community-generated custom CSS/HTML responsive animated items.",
        category: "animations",
        tags: ["Custom CSS", "HTML Elements", "Community"],
        color: "indigo",
        readTime: "CSS Code Database",
        link: "https://uiverse.io/",
      },
      {
        id: "rombo",
        title: "Rombo",
        description:
          "Fluid spring visual presets, elastic layouts, and micro-physics for modern Tailwind projects.",
        category: "animations",
        tags: ["Tailwind CSS", "Spring Physics", "Micro-physics"],
        color: "amber",
        readTime: "Tailwind Animation Engine",
        link: "https://rombo.co/tailwind/",
      },
      {
        id: "framer-motion-lib",
        title: "Framer Motion",
        description:
          "A production-ready declarative motion framework for React that handles layout morphing easily.",
        category: "animations",
        tags: ["React Framework", "Damping Physics", "Declarative"],
        color: "violet",
        readTime: "React Animation Engine",
        link: "https://www.framer.com/motion/",
      },
      {
        id: "animejs",
        title: "Anime.js",
        description:
          "A lightweight vanilla JavaScript library targeting CSS properties, DOM vectors, and SVG paths.",
        category: "animations",
        tags: ["Vanilla JS", "SVG Path tracing", "Lightweight"],
        color: "indigo",
        readTime: "Core Engine Presets",
        link: "https://animejs.com/",
      },
      {
        id: "react-spring",
        title: "React Spring",
        description:
          "Spring-physics first visual framework designed to create smooth and fluid UI sheets.",
        category: "animations",
        tags: ["Spring Physics", "React Sheets", "Fluid Transitions"],
        color: "emerald",
        readTime: "Physics Animation Engine",
        link: "https://www.react-spring.dev/",
      },
      {
        id: "lottie",
        title: "Lottie",
        description:
          "Render high-end After Effects vector graphics dynamically in websites using simple JSON files.",
        category: "animations",
        tags: ["Vector Canvas", "JSON Maps", "After Effects"],
        color: "sky",
        readTime: "Vector Animator Engine",
        link: "https://airbnb.io/lottie/#/",
      },
      {
        id: "threejs",
        title: "Three.js",
        description:
          "A cross-browser 3D JavaScript engine mapping graphics to complex GPU WebGL shading scenes.",
        category: "animations",
        tags: ["3D WebGL", "GPU Shading", "Render Scenes"],
        color: "cyan",
        readTime: "3D Render Engine",
        link: "https://threejs.org/",
      },
      {
        id: "velocityjs",
        title: "Velocity.js",
        description:
          "Highly accelerated accelerated animate function wrapping legacy jQuery hooks for fast timelines.",
        category: "animations",
        tags: ["Legacy jQuery", "Speed Accelerated", "Fast Timeline"],
        color: "rose",
        readTime: "Performance Animate Engine",
        link: "http://velocityjs.org/",
      },
      {
        id: "theatrejs",
        title: "Theatre.js",
        description:
          "A professional graphical timeline editor designed for high-end WebGL graphics and interactive pages.",
        category: "animations",
        tags: ["Visual Timeline", "WebGL Graphics", "Creative Design"],
        color: "violet",
        readTime: "Dynamic Timeline Editor",
        link: "https://www.theatrejs.com/",
      },
      {
        id: "auto-animate",
        title: "AutoAnimate",
        description:
          "Drop-in, zero-config layout animation helper designed to smooth out list items and accordions.",
        category: "animations",
        tags: ["Zero-Config", "List Transition", "Accordion Smooth"],
        color: "emerald",
        readTime: "Auto-transition Helper",
        link: "https://auto-animate.formkit.com/",
      },

      // Category: resources (Bookmarks/Directories)
      {
        id: "svgl-logos",
        title: "SVGL Brand Vector Map",
        description:
          "A comprehensive developer icon catalog showcasing raw brand logos.",
        category: "resources",
        tags: ["SVGs", "Brand Vectors", "Icons"],
        color: "cyan",
        readTime: "Vector Link Directory",
        link: "https://svgl.app",
      },
    ],
    []
  );

  // Filters logic
  const filteredItems = useMemo(() => {
    return vaultItems.filter((item) => {
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
  }, [vaultItems, activeCategory, searchQuery]);

  // Counts map
  const categoryCounts = useMemo(() => {
    const counts = {
      all: vaultItems.length,
      animations: 0,
      resources: 0,
    };
    vaultItems.forEach((item) => {
      counts[item.category]++;
    });
    return counts;
  }, [vaultItems]);

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
      default:
        return "from-zinc-500/10 to-transparent";
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Sleek Subtitle */}
      <p className="max-w-xl px-4 text-sm leading-relaxed text-muted-foreground">
        A curated chest of high-performance animation libraries, responsive
        layouts, and useful development resource maps.
      </p>

      {/* Glassmorphic Search Bar */}
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
              onClick={() => setSearchQuery("")}
              className="mr-1 px-2.5 font-mono text-[10px] font-bold text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Categories Selector wrapping in Radix Tabs */}
      <Tabs
        defaultValue="all"
        value={activeCategory}
        onValueChange={(val) => setActiveCategory(val as VaultCategory)}
        className="w-full space-y-6"
      >
        <div className="px-4">
          <TabsList className="flex h-auto w-fit gap-1 rounded-lg border border-edge/60 bg-muted/50 p-1 select-none">
            {(["all", "animations", "resources"] as VaultCategory[]).map(
              (category) => {
                const count = categoryCounts[category];

                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium shadow-none transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <span className="capitalize">
                      {category === "animations" ? "Animations" : category}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.25 font-mono text-[10px] text-muted-foreground">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              }
            )}
          </TabsList>
        </div>

        {/* Content Panel for each Category */}
        <div className="relative px-4 pb-8">
          {(["all", "animations", "resources"] as VaultCategory[]).map(
            (category) => (
              <TabsContent
                key={category}
                value={category}
                className="mt-0 outline-none"
              >
                {activeCategory === category &&
                  (filteredItems.length > 0 ? (
                    <div className="relative">
                      <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
                        <div className="border-r border-edge"></div>
                        <div className="border-l border-edge"></div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {filteredItems.map((item) => {
                          // Unique dynamic visual representations for aspect-video
                          const renderAspectVideo = () => {
                            return (
                              <div className="relative h-full w-full overflow-hidden bg-zinc-950">
                                <iframe
                                  src={item.link}
                                  title={item.title}
                                  className="pointer-events-none h-full w-full scale-[1.01] border-0 opacity-80 transition-opacity duration-300 select-none group-hover:opacity-95"
                                  loading="lazy"
                                  scrolling="no"
                                />
                                {/* Overlay protection cover to intercept pointer inputs safely */}
                                <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />
                              </div>
                            );
                          };

                          return (
                            <Card
                              className="group flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-edge bg-muted/20 py-0 shadow-none backdrop-blur-xs dark:border-zinc-800/80 dark:bg-zinc-950/20"
                              key={item.id}
                            >
                              <CardHeader className="relative p-0">
                                <div className="relative aspect-video w-full border-b bg-zinc-950/30">
                                  {renderAspectVideo()}
                                  {/* Radial Hover Glow Spot */}
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
                                      {item.category === "animations"
                                        ? "Animation Lib"
                                        : item.category}
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
                                </div>

                                {/* Footer Action Button */}
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
                                      Open Resource{" "}
                                      <ChevronRight className="ml-0.5 size-3.5" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Empty matches fallback */
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
            )
          )}
        </div>
      </Tabs>
    </div>
  );
}

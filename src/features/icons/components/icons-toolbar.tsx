"use client"

import { useEffect } from "react"
import { LayersIcon, LayoutGridIcon, RotateCcwIcon, XIcon } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SearchIcon } from "@/components/icons"

import { DEFAULT_ICON_SIZE, ICON_CATEGORIES } from "../data"
import type { IconCategory, IconLibrary } from "../types"

export type IconsViewMode = "grouped" | "grid"

type IconsToolbarProps = {
  activeLibrary: IconLibrary
  query: string
  onQueryChange: (value: string | null) => void
  category: string
  onCategoryChange: (value: string | null) => void
  categoryCounts: Record<IconCategory, number>
  totalCount: number
  filteredCount: number
  iconSize: number
  onIconSizeChange: (size: number) => void
  viewMode: IconsViewMode
  onViewModeChange: (mode: IconsViewMode) => void
  onResetCustomizer: () => void
}

/**
 * Provides instant search, size customization, view mode toggling,
 * and category filter pills for the icon explorer.
 */
export function IconsToolbar({
  activeLibrary,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categoryCounts,
  totalCount,
  filteredCount,
  iconSize,
  onIconSizeChange,
  viewMode,
  onViewModeChange,
  onResetCustomizer,
}: IconsToolbarProps) {
  useHotkeys(
    "esc",
    () => {
      if (query) {
        onQueryChange(null)
      }
    },
    { enableOnFormTags: true }
  )

  useEffect(() => {
    if (query && query.length >= 2) {
      const timeoutId = setTimeout(() => {
        trackEvent({
          name: "icons_search",
          properties: {
            query,
            query_length: query.length,
            library: activeLibrary.id,
            results_count: filteredCount,
          },
        })
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [query, activeLibrary.id, filteredCount])

  const isCustomized = iconSize !== DEFAULT_ICON_SIZE

  return (
    <div className="flex flex-col">
      {/* Search + Live Customizer */}
      <div className="screen-line-top screen-line-bottom flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-sm">
          <InputGroup className="rounded-lg shadow-none">
            <InputGroupInput
              placeholder={`Search ${activeLibrary.count} ${activeLibrary.name} icons...`}
              value={query}
              onChange={(e) => {
                const value = e.target.value
                onQueryChange(value ? value : null)
              }}
              aria-label="Search icons"
            />

            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>

            <InputGroupAddon
              className="pr-2.25 data-[disabled=true]:hidden"
              align="inline-end"
              data-disabled={!query.length}
            >
              <InputGroupButton
                className="rounded-sm border-none"
                size="icon-xs"
                title="Clear search"
                aria-label="Clear search"
                onClick={() => onQueryChange(null)}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Size slider */}
          <div className="flex items-center gap-2 rounded-lg border border-line bg-background px-2.5 py-1.5">
            <label
              htmlFor="icon-size-slider"
              className="font-mono text-xs text-muted-foreground"
            >
              Size
            </label>
            <input
              id="icon-size-slider"
              type="range"
              min={16}
              max={64}
              step={2}
              value={iconSize}
              onChange={(e) => onIconSizeChange(Number(e.target.value))}
              className="h-1.5 w-20 cursor-pointer accent-foreground sm:w-24"
            />
            <span className="w-8 text-right font-mono text-xs text-foreground tabular-nums">
              {iconSize}px
            </span>
          </div>

          {/* View mode & Reset */}
          <div className="flex items-center gap-1">
            <div className="flex items-center rounded-lg border border-line bg-background p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant={viewMode === "grouped" ? "secondary" : "ghost"}
                    onClick={() => onViewModeChange("grouped")}
                    aria-label="Grouped by category"
                    aria-pressed={viewMode === "grouped"}
                  >
                    <LayersIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grouped by category</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    onClick={() => onViewModeChange("grid")}
                    aria-label="Flat grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <LayoutGridIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Flat grid view</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {isCustomized && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    onClick={onResetCustomizer}
                    aria-label="Reset size"
                  >
                    <RotateCcwIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset size</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="screen-line-bottom no-scrollbar flex scroll-fade-x items-center gap-1.5 overflow-x-auto px-3 py-2.5">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          aria-pressed={!category}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            !category
              ? "border-foreground bg-foreground text-background"
              : "border-line bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <span>All</span>
          <span
            className={cn(
              "font-mono text-[10px]",
              !category ? "text-background/80" : "text-muted-foreground"
            )}
          >
            {totalCount}
          </span>
        </button>

        {ICON_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] ?? 0
          const isActive = category === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(isActive ? null : cat)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-line bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  "font-mono text-[10px]",
                  isActive ? "text-background/80" : "text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

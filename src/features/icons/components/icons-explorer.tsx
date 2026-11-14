"use client"

import { useMemo, useState } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { DEFAULT_ICON_SIZE, ICON_CATEGORIES, ICON_LIBRARIES } from "../data"
import { fetchIconSvg, formatSvgForCopy } from "../lib/svg-transform"
import type { IconCategory, IconItem } from "../types"
import { IconDetailDialog } from "./icon-detail-dialog"
import { IconSvgPreview } from "./icon-svg-preview"
import { IconsToolbar, type IconsViewMode } from "./icons-toolbar"

type IconsExplorerProps = {
  icons: IconItem[]
}

function normalizeSearchValue(value: string): string {
  return value.toLowerCase().replaceAll("-", " ").replace(/\s+/g, " ").trim()
}

function matchesIconQuery(icon: IconItem, normalizedQuery: string): boolean {
  if (!normalizedQuery) {
    return true
  }

  const compactQuery = normalizedQuery.replaceAll(" ", "")
  const fields = [
    icon.name,
    icon.title,
    icon.componentName,
    icon.category,
    ...icon.tags,
  ]

  return fields.some((field) => {
    const normalizedField = normalizeSearchValue(field)
    return (
      normalizedField.includes(normalizedQuery) ||
      normalizedField.replaceAll(" ", "").includes(compactQuery)
    )
  })
}

/**
 * Interactive icon libraries explorer managing URL query state, live size
 * CSS variables, category grouping, quick SVG copy, and the detail inspector dialog.
 */
export function IconsExplorer({ icons }: IconsExplorerProps) {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" })
  const [category, setCategory] = useQueryState("cat", { defaultValue: "" })
  const [iconSize, setIconSize] = useState(DEFAULT_ICON_SIZE)
  const [viewMode, setViewMode] = useState<IconsViewMode>("grouped")
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null)
  const [copiedIconName, setCopiedIconName] = useState<string | null>(null)

  const activeLibrary = ICON_LIBRARIES[0]

  const libraryIcons = useMemo(
    () => icons.filter((icon) => icon.library === activeLibrary.id),
    [icons, activeLibrary.id]
  )

  const normalizedQuery = normalizeSearchValue(query)

  const searchMatchedIcons = useMemo(() => {
    if (!normalizedQuery) {
      return libraryIcons
    }
    return libraryIcons.filter((icon) =>
      matchesIconQuery(icon, normalizedQuery)
    )
  }, [libraryIcons, normalizedQuery])

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(
      ICON_CATEGORIES.map((cat) => [cat, 0])
    ) as Record<IconCategory, number>

    for (const icon of searchMatchedIcons) {
      counts[icon.category] = (counts[icon.category] ?? 0) + 1
    }

    return counts
  }, [searchMatchedIcons])

  const filteredIcons = useMemo(() => {
    if (!category) {
      return searchMatchedIcons
    }
    return searchMatchedIcons.filter((icon) => icon.category === category)
  }, [searchMatchedIcons, category])

  const groupedIcons = useMemo(() => {
    return ICON_CATEGORIES.map((cat) => ({
      category: cat,
      icons: filteredIcons.filter((icon) => icon.category === cat),
    })).filter((group) => group.icons.length > 0)
  }, [filteredIcons])

  const handleResetCustomizer = () => {
    setIconSize(DEFAULT_ICON_SIZE)
  }

  const handleQuickCopySvg = async (icon: IconItem) => {
    try {
      const rawSvg = await fetchIconSvg(icon.src)
      const formattedSvg = formatSvgForCopy(rawSvg, {
        size: iconSize,
      })

      const copied = await copyToClipboardWithEvent(formattedSvg, {
        name: "copy_icon_svg",
        properties: {
          icon: icon.name,
          library: icon.library,
          size: iconSize,
          source: "grid_quick_copy",
        },
      })

      if (copied) {
        setCopiedIconName(icon.name)
        toast.success(`Copied ${icon.name}.svg`)
        setTimeout(() => {
          setCopiedIconName((current) =>
            current === icon.name ? null : current
          )
        }, 1500)
      } else {
        toast.error("Failed to copy SVG")
      }
    } catch {
      toast.error(`Failed to load ${icon.name}.svg`)
    }
  }

  const showFlatGrid = viewMode === "grid" || Boolean(normalizedQuery)

  return (
    <div>
      <IconsToolbar
        activeLibrary={activeLibrary}
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categoryCounts={categoryCounts}
        totalCount={libraryIcons.length}
        filteredCount={filteredIcons.length}
        iconSize={iconSize}
        onIconSizeChange={setIconSize}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetCustomizer={handleResetCustomizer}
      />

      {/* Icon grid wrapper cascading CSS variables to all SVGs */}
      <div
        style={
          {
            "--icon-size": `${iconSize}px`,
          } as React.CSSProperties
        }
      >
        {filteredIcons.length === 0 ? (
          <div className="screen-line-bottom flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              No icons found matching{" "}
              {query ? `"${query}"` : "the selected filter"}.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery(null)
                setCategory(null)
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : showFlatGrid ? (
          <IconGrid
            icons={filteredIcons}
            copiedIconName={copiedIconName}
            onSelectIcon={setSelectedIcon}
            onQuickCopySvg={handleQuickCopySvg}
          />
        ) : (
          <div className="flex flex-col">
            {groupedIcons.map(({ category: groupName, icons: groupIcons }) => (
              <section key={groupName}>
                <div className="screen-line-bottom flex items-center justify-between bg-accent/25 px-4 py-2.5">
                  <h2 className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase">
                    {groupName}
                  </h2>
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                    {groupIcons.length}
                  </span>
                </div>

                <IconGrid
                  icons={groupIcons}
                  copiedIconName={copiedIconName}
                  onSelectIcon={setSelectedIcon}
                  onQuickCopySvg={handleQuickCopySvg}
                />
              </section>
            ))}
          </div>
        )}
      </div>

      <IconDetailDialog
        icon={selectedIcon}
        open={selectedIcon !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedIcon(null)
          }
        }}
        iconSize={iconSize}
      />
    </div>
  )
}

type IconGridProps = {
  icons: IconItem[]
  copiedIconName: string | null
  onSelectIcon: (icon: IconItem) => void
  onQuickCopySvg: (icon: IconItem) => void
}

function IconGrid({
  icons,
  copiedIconName,
  onSelectIcon,
  onQuickCopySvg,
}: IconGridProps) {
  return (
    <div className="overflow-hidden">
      <div className="-mr-px grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {icons.map((icon) => {
          const isCopied = copiedIconName === icon.name
          return (
            <div
              key={icon.name}
              className="group/icon-cell relative border-r border-b border-line bg-background transition-colors hover:bg-accent/35"
            >
              <button
                type="button"
                onClick={() => onSelectIcon(icon)}
                className="flex h-full w-full flex-col items-center justify-between gap-3 px-2.5 pt-7 pb-3.5 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <span className="flex min-h-16 items-center justify-center transition-transform duration-150 group-hover/icon-cell:scale-105">
                  <IconSvgPreview src={icon.src} name={icon.title} />
                </span>

                <span className="w-full truncate font-mono text-[11px] text-muted-foreground transition-colors group-hover/icon-cell:text-foreground">
                  {icon.name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onQuickCopySvg(icon)}
                title={`Copy ${icon.name}.svg`}
                aria-label={`Copy ${icon.name} SVG`}
                className={cn(
                  "absolute top-1.5 right-1.5 inline-flex size-6 items-center justify-center rounded-md border border-line bg-background/90 text-muted-foreground opacity-0 transition-opacity group-hover/icon-cell:opacity-100 hover:bg-accent hover:text-foreground focus-visible:opacity-100",
                  isCopied && "text-foreground opacity-100"
                )}
              >
                {isCopied ? (
                  <CheckIcon className="size-3 text-emerald-500" />
                ) : (
                  <CopyIcon className="size-3" />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

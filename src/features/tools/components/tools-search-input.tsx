"use client"

import { useEffect } from "react"
import { XIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { SearchIcon } from "@/components/icons"

import { TOOL_CATEGORIES } from "../data"

export function ToolsSearchInput({ totalCount }: { totalCount?: number }) {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  })

  const [category, setCategory] = useQueryState("category", {
    defaultValue: "",
  })

  useHotkeys(
    "esc",
    () => {
      setQuery(null)
      setCategory(null)
    },
    { enableOnFormTags: true }
  )

  useEffect(() => {
    if (query && query.length >= 2) {
      const timeoutId = setTimeout(() => {
        trackEvent({
          name: "tools_search",
          properties: {
            query,
            query_length: query.length,
          },
        })
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [query])

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <InputGroup className="flex-1 rounded-lg shadow-none">
          <InputGroupInput
            placeholder="Search tools, AI models, design resources..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
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
              onClick={() => setQuery(null)}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {totalCount !== undefined && (
          <div className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
            {totalCount} tools
          </div>
        )}
      </div>

      <div className="flex scrollbar-none flex-wrap gap-1.5 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors select-none",
            !category || category === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-accent/70 text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          All
        </button>
        {TOOL_CATEGORIES.map((cat) => {
          const isActive = category === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(isActive ? null : cat)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors select-none",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/70 text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}

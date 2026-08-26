"use client"

import { useEffect } from "react"
import { XIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { SearchIcon } from "@/components/icons"

export function ToolsSearchInput() {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  })

  useHotkeys("esc", () => setQuery(null), { enableOnFormTags: true })

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
    <InputGroup className="rounded-lg shadow-none">
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
  )
}

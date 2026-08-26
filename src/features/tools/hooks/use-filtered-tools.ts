"use client"

import { useQueryState } from "nuqs"

import type { Tool } from "../types"

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "")

const matchesQuery = (tool: Tool, normalizedQuery: string) => {
  const values = [
    tool.name,
    tool.description ?? "",
    tool.category,
    tool.tag ?? "",
    tool.url,
  ]
  return values.some((value) => normalize(value).includes(normalizedQuery))
}

export function useFilteredTools(tools: Tool[]) {
  const [query] = useQueryState("q", {
    defaultValue: "",
  })

  const [category] = useQueryState("category", {
    defaultValue: "",
  })

  let filtered = tools

  if (category && category !== "all") {
    filtered = filtered.filter((tool) => tool.category === category)
  }

  if (query) {
    const normalizedQuery = normalize(query)
    filtered = filtered.filter((tool) => matchesQuery(tool, normalizedQuery))
  }

  return filtered
}

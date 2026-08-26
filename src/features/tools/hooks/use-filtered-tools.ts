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

  if (!query) {
    return tools
  }

  const normalizedQuery = normalize(query)
  return tools.filter((tool) => matchesQuery(tool, normalizedQuery))
}

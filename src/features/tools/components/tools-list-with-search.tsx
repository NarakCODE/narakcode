"use client"

import { useFilteredTools } from "../hooks/use-filtered-tools"
import type { Tool } from "../types"
import { ToolsList } from "./tools-list"

export function ToolsListWithSearch({ tools }: { tools: Tool[] }) {
  const filteredTools = useFilteredTools(tools)
  return <ToolsList tools={filteredTools} />
}

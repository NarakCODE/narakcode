import { cn } from "@/lib/utils"

import { TOOL_CATEGORIES } from "../data"
import type { Tool } from "../types"
import { ToolsItem } from "./tools-item"

export function ToolsList({
  tools,
  className,
}: {
  tools: Tool[]
  className?: string
}) {
  // Group tools by category
  const toolsByCategory = TOOL_CATEGORIES.map((category) => {
    const categoryTools = tools.filter((t) => t.category === category)
    return {
      category,
      tools: categoryTools,
    }
  }).filter((group) => group.tools.length > 0)

  if (toolsByCategory.length === 0) {
    return (
      <div className="screen-line-top screen-line-bottom my-8 p-8 text-center">
        <p className="font-mono text-body-regular text-text-secondary">
          No tools found matching your search.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {toolsByCategory.map(({ category, tools: categoryTools }) => {
        return (
          <div key={category} className="flex flex-col bg-background">
            <div className="flex items-center justify-between border-b border-line bg-accent/25 px-3.5 py-2.5">
              <h2 className="text-body-mini-medium tracking-wider text-text-primary uppercase">
                {category}
              </h2>
              <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-body-micro-medium text-text-secondary">
                {categoryTools.length}
              </span>
            </div>

            <ul className="flex flex-1 flex-col divide-y divide-line/40">
              {categoryTools.map((tool) => (
                <li key={tool.name}>
                  <ToolsItem tool={tool} />
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

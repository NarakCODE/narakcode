import { addQueryParams } from "@/utils/url"
import { ArrowUpRightIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"

import type { Tool } from "../types"
import { ToolIcon } from "./tool-icon"

export function ToolsItem({
  tool,
  className,
}: {
  tool: Tool
  className?: string
}) {
  const href = addQueryParams(tool.url, UTM_PARAMS)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        "group/tool-item flex items-center justify-between gap-2.5 px-3 py-2 text-body-small-regular transition-[background-color,color] ease-out hover:bg-accent/60",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <ToolIcon url={tool.url} name={tool.name} />

        <span className="truncate text-body-small-medium text-foreground/90 transition-colors group-hover/tool-item:text-text-primary">
          {tool.name}
        </span>
      </div>

      <ArrowUpRightIcon
        className="size-3.5 shrink-0 text-muted-foreground/30 transition-[color,transform] duration-200 ease-out group-hover/tool-item:translate-x-0.5 group-hover/tool-item:-translate-y-0.5 group-hover/tool-item:text-foreground"
        aria-hidden
      />
    </a>
  )
}

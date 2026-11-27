"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function ToolIcon({
  url,
  name,
  className,
}: {
  url: string
  name: string
  className?: string
}) {
  const [hasError, setHasError] = useState(false)
  const domain = getDomain(url)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

  if (hasError) {
    return (
      <div
        className={cn(
          "flex size-5.5 items-center justify-center rounded-sm bg-accent/60 text-muted-foreground",
          className
        )}
      >
        <span className="text-xs font-medium">{name.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex size-5.5 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-accent/40",
        className
      )}
    >
      <img
        src={faviconUrl}
        alt=""
        loading="lazy"
        onError={() => setHasError(true)}
        className="size-4 object-contain transition-transform group-hover/tool-item:scale-110"
      />
    </div>
  )
}

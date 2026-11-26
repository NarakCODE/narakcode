"use client"

import { cn } from "@/lib/utils"
import { useIsScrolled } from "@/hooks/use-is-scrolled"

const HEADER_SCROLL_OFFSET = 1

export function SiteHeaderWrapper({
  className,
  ...props
}: React.ComponentProps<"header">) {
  const isScrolled = useIsScrolled(HEADER_SCROLL_OFFSET) === true

  return (
    <header
      data-scrolled={isScrolled ? "" : undefined}
      className={cn(
        "sticky top-0 z-50 h-(--header-height) max-w-screen overflow-x-clip bg-transparent px-2 pt-1 transition-colors duration-200 ease-out data-scrolled:bg-background",
        className
      )}
      {...props}
    />
  )
}

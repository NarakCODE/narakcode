"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { fetchIconSvg, scopeSvgIds } from "../lib/svg-transform"

type IconSvgPreviewProps = {
  src: string
  name: string
  size?: number
  eager?: boolean
  className?: string
}

/**
 * Lazily fetches and renders a Nucleo SVG inline so CSS variables like
 * `--nucleo-accent` and `--icon-size` cascade dynamically across all icons.
 */
export function IconSvgPreview({
  src,
  name,
  size,
  eager = false,
  className,
}: IconSvgPreviewProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const rawScopeId = useId()
  const [isVisible, setIsVisible] = useState(eager)
  const [rawSvg, setRawSvg] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (eager || isVisible) {
      return
    }

    const element = containerRef.current
    if (!element) {
      return
    }

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [eager, isVisible])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    let cancelled = false
    fetchIconSvg(src)
      .then((svg) => {
        if (!cancelled) {
          setRawSvg(svg)
          setHasError(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isVisible, src])

  const scopedSvg = useMemo(() => {
    if (!rawSvg) {
      return null
    }
    return scopeSvgIds(rawSvg, rawScopeId)
  }, [rawSvg, rawScopeId])

  return (
    <span
      ref={containerRef}
      role="img"
      aria-label={name}
      style={
        size !== undefined
          ? ({ "--icon-size": `${size}px` } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "inline-flex size-(--icon-size,36px) shrink-0 items-center justify-center [&_svg]:size-(--icon-size,36px) [&_svg]:shrink-0 [&_svg]:transition-[width,height] [&_svg]:duration-150",
        className
      )}
    >
      {scopedSvg ? (
        <span
          className="contents"
          dangerouslySetInnerHTML={{ __html: scopedSvg }}
        />
      ) : hasError ? (
        <span className="size-5 rounded-md border border-dashed border-muted-foreground/40" />
      ) : (
        <span className="size-(--icon-size,36px) animate-pulse rounded-lg bg-muted/70" />
      )}
    </span>
  )
}

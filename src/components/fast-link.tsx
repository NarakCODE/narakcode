"use client"

import { forwardRef } from "react"
import {
  FastLink as BaseFastLink,
  FastLinkRegion as BaseFastLinkRegion,
  type FastLinkProps,
  type FastLinkRegionProps,
  type FastNavigationPolicy,
} from "@fast-link/next"

const NON_APP_ROUTER_PATHS = new Set([
  "/ads.txt",
  "/llms-full.txt",
  "/llms.txt",
  "/manifest.webmanifest",
  "/robots.txt",
  "/rss",
  "/sitemap.xml",
  "/vcard",
])

const NON_APP_ROUTER_PREFIXES = ["/og/", "/doc.md/", "/doc.mdx/"]
const NON_APP_ROUTER_SUFFIXES = [".md", ".mdx", "/rss"]

/**
 * Keeps non-page route handlers (RSS, Markdown/MDX endpoints, vCard, OG, etc.)
 * on document navigation while routing App Router pages through the client router.
 */
export const appNavigationPolicy: FastNavigationPolicy = (intent) => {
  const { pathname } = intent.url

  if (
    NON_APP_ROUTER_PATHS.has(pathname) ||
    NON_APP_ROUTER_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    NON_APP_ROUTER_SUFFIXES.some((suffix) => pathname.endsWith(suffix))
  ) {
    return { kind: "document", method: "assign" }
  }

  return { kind: "router" }
}

export const FastLink = forwardRef<HTMLAnchorElement, FastLinkProps>(
  function FastLink({ navigationPolicy, ...props }, ref) {
    return (
      <BaseFastLink
        ref={ref}
        navigationPolicy={navigationPolicy ?? appNavigationPolicy}
        {...props}
      />
    )
  }
) as typeof BaseFastLink

export function FastLinkRegion({
  navigationPolicy,
  ...props
}: FastLinkRegionProps) {
  return (
    <BaseFastLinkRegion
      navigationPolicy={navigationPolicy ?? appNavigationPolicy}
      {...props}
    />
  )
}

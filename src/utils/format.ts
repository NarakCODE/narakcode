import { tz } from "@date-fns/tz"
import { format } from "date-fns"

/**
 * Always `en-US`, never the runtime locale: a client component would pick up
 * the visitor's locale while a server component picks up the host's, so the
 * same figure could render as `1,234` in one place and `1.234` in another on
 * the same page.
 *
 * Module-level because constructing an `Intl` formatter is the expensive part,
 * not formatting with it.
 */
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
})

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value)
}

export function formatCompactNumber(value: number): string {
  return COMPACT_NUMBER_FORMATTER.format(value)
}

/**
 * Formats a duration given in seconds into a compact `Xh Ym Zs` string.
 * Zero-valued units are omitted; a zero duration renders as `0s`.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.round(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0) parts.push(`${secs}s`)

  return parts.length > 0 ? parts.join(" ") : "0s"
}

/**
 * Formats a date string, number, or Date object into a string using the UTC timezone.
 * This ensures consistent formatting between SSR and Client-side hydration.
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string
): string {
  const d =
    typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return format(d, formatStr, { in: tz("UTC") })
}

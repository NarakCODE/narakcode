import { tz } from "@date-fns/tz"
import { format } from "date-fns"

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

import { Avatar, Style, type StyleOptions } from "@dicebear/core"
import glass from "@dicebear/styles/glass.json"

export const DICEBEAR_API_BASE_URL = "https://api.dicebear.com/10.x"

const glassStyle = new Style(glass)

export type GlassAvatarOptions = Omit<StyleOptions<typeof glass>, "seed">

/**
 * Generates a deterministic DiceBear Glass avatar as an inline SVG data URI
 * for the given seed (e.g. a user's name).
 */
export function getDiceBearAvatarDataUri(
  seed: string,
  options?: GlassAvatarOptions
): string {
  return new Avatar(glassStyle, {
    seed,
    ...options,
  }).toDataUri()
}

/**
 * Builds a DiceBear 10.x HTTP API URL for the given seed and style.
 */
export function getDiceBearAvatarUrl(seed: string, style = "glass"): string {
  const params = new URLSearchParams({ seed })
  return `${DICEBEAR_API_BASE_URL}/${style}/svg?${params.toString()}`
}

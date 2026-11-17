import type { ComponentPropsWithoutRef } from "react"

import {
  getDiceBearAvatarDataUri,
  type GlassAvatarOptions,
} from "@/lib/dicebear"
import { cn } from "@/lib/utils"

export type DiceBearAvatarProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src"
> & {
  /** Dynamic name used as the DiceBear seed and default alt text. */
  name?: string
  /** Pixel size for the rendered image and generated SVG. */
  size?: number
  /** Additional DiceBear Glass style options. */
  options?: Omit<GlassAvatarOptions, "size">
}

/**
 * Renders a deterministic DiceBear Glass avatar from a dynamic `name` seed
 * using the local `@dicebear/core` + `@dicebear/styles` JS library.
 */
export function DiceBearAvatar({
  name,
  size = 64,
  options,
  alt,
  className,
  ...props
}: DiceBearAvatarProps) {
  const seed = name?.trim() || "avatar"
  const src = getDiceBearAvatarDataUri(seed, {
    size,
    ...options,
  })

  return (
    <img
      src={src}
      alt={alt ?? (name?.trim() || "avatar")}
      width={size}
      height={size}
      className={cn(
        "shrink-0 rounded-full bg-muted object-cover select-none",
        className
      )}
      {...props}
    />
  )
}

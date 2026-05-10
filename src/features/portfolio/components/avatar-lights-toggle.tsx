"use client"

import { useAvatarLights } from "@/hooks/use-avatar-lights"

export function AvatarLightsToggle() {
  const { toggleLights } = useAvatarLights()

  return (
    <button
      className="absolute top-0 right-0 flex h-8 w-20 outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-inset"
      aria-label="Toggle Avatar Lights"
      onClick={toggleLights}
    />
  )
}

"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type AvatarLights = "on" | "off"

const lightsAtom = atomWithStorage<AvatarLights>("avatarLights", "on")

export function useAvatarLights() {
  const [lights, setLights] = useAtom(lightsAtom)

  const toggleLights = () => {
    const nextLights: AvatarLights = lights === "off" ? "on" : "off"
    document.documentElement.dataset.avatarLights = nextLights
    setLights(nextLights)
  }

  return { toggleLights }
}

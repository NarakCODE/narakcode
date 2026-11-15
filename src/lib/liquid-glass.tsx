"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export const LIQUID_GLASS_CDN_URL = "https://liquidglass.dev/lib/components.js"

let loadPromise: Promise<boolean> | null = null

/** Loads the liquidglass.dev CDN custom elements once on the client. */
export function loadLiquidGlassCdn(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false)
  }

  if (window.customElements?.get("lg-panel")) {
    return Promise.resolve(true)
  }

  if (!loadPromise) {
    loadPromise = import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      LIQUID_GLASS_CDN_URL
    )
      .then(() => Boolean(window.customElements?.get("lg-panel")))
      .catch(() => {
        loadPromise = null
        return false
      })
  }

  return loadPromise
}

/** Ensures liquidglass.dev CDN web components are registered in the browser. */
export function useLiquidGlass(): boolean {
  const [ready, setReady] = React.useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.customElements?.get("lg-panel"))
  )

  React.useEffect(() => {
    let active = true

    void loadLiquidGlassCdn().then((loaded) => {
      if (active && loaded) {
        setReady(true)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return ready
}

export interface LiquidGlassPanelProps {
  className?: string
  style?: React.CSSProperties
  radius?: number | "capsule"
  tone?: "light" | "dark"
  refraction?: number
  bezel?: number
  curvature?: number
  chroma?: number
  blur?: number
  specular?: number
  specularWidth?: number
  lightAngle?: number
  backdrop?: string
}

type LiquidGlassStyle = React.CSSProperties & {
  "--lg-tint"?: string
  "--lg-tint-strong"?: string
  "--lg-shadow-2"?: string
  "--lg-fallback"?: string
}

/**
 * Empty `<lg-panel>` surface layer backed by liquidglass.dev.
 * Keeping it childless prevents React reconciliation conflicts with light-DOM reparenting.
 */
export function LiquidGlassPanel({
  className,
  style,
  radius = 24,
  tone,
  refraction = 14,
  bezel = 0.35,
  curvature = 3.5,
  chroma = 0.04,
  blur = 2,
  specular = 0.22,
  specularWidth = 1.25,
  lightAngle,
  backdrop,
}: LiquidGlassPanelProps) {
  useLiquidGlass()

  const toneVars: LiquidGlassStyle =
    tone === "dark"
      ? {
          "--lg-tint": "rgb(255 255 255 / 0.04)",
          "--lg-tint-strong": "rgb(255 255 255 / 0.09)",
          "--lg-shadow-2": "0 8px 22px -8px rgb(0 0 0 / 0.24)",
          "--lg-fallback": "blur(18px) saturate(1.35)",
        }
      : {
          "--lg-tint": "rgb(255 255 255 / 0.2)",
          "--lg-tint-strong": "rgb(255 255 255 / 0.32)",
          "--lg-shadow-2": "0 6px 18px -8px rgb(15 23 42 / 0.08)",
          "--lg-fallback": "blur(18px) saturate(1.35)",
        }

  return React.createElement("lg-panel", {
    "aria-hidden": "true",
    class: cn("pointer-events-none", className),
    radius: String(radius),
    tone: tone === "light" ? "light" : undefined,
    refraction: String(refraction),
    bezel: String(bezel),
    curvature: String(curvature),
    chroma: String(chroma),
    blur: String(blur),
    specular: String(specular),
    "specular-width": String(specularWidth),
    "light-angle": lightAngle !== undefined ? String(lightAngle) : undefined,
    backdrop,
    style: {
      position: "absolute",
      inset: 0,
      ...toneVars,
      ...style,
    },
  })
}

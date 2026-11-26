"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import {
  mountSky,
  SKY_HEIGHT,
  stillSky,
  type MountedSky,
  type SkyTheme,
} from "../ascii-sky"

const FADE_TRANSITION = "opacity 700ms ease-out"

export function StoreSkyBackground() {
  const { resolvedTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const skyRef = useRef<MountedSky | undefined>(undefined)
  const [isDrawn, setIsDrawn] = useState(false)

  const skyTheme: SkyTheme = resolvedTheme === "dark" ? "dark" : "light"
  const themeRef = useRef<SkyTheme>(skyTheme)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const initialTheme: SkyTheme = document.documentElement.classList.contains(
      "dark"
    )
      ? "dark"
      : themeRef.current

    const mounted = mountSky(canvas, {
      theme: initialTheme,
      assets: "/ascii-sky/",
      faintFrom: 320,
    })
    skyRef.current = mounted

    const observer = new MutationObserver(() => {
      const next: SkyTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
      skyRef.current?.setTheme(next)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    mounted.ready
      .then(() => {
        if (skyRef.current === mounted) {
          setIsDrawn(true)
        }
      })
      .catch(() => undefined)

    return () => {
      observer.disconnect()
      mounted.stop()
      skyRef.current = undefined
      setIsDrawn(false)
    }
  }, [])

  useEffect(() => {
    themeRef.current = skyTheme
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      skyRef.current?.setTheme(skyTheme)
    }
  }, [resolvedTheme, skyTheme])

  const still = stillSky(skyTheme, "/ascii-sky/")

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-1 overflow-hidden select-none"
      style={{ height: SKY_HEIGHT }}
    >
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 220px, rgb(0 0 0 / 0.16) 355px, rgb(0 0 0 / 0.05) 510px, transparent)",
          maskImage:
            "linear-gradient(to bottom, #000 220px, rgb(0 0 0 / 0.16) 355px, rgb(0 0 0 / 0.05) 510px, transparent)",
        }}
      >
        <div
          className="absolute inset-0 size-full"
          style={{
            ...still,
            opacity: isDrawn ? 0 : still.opacity,
            transition: FADE_TRANSITION,
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block size-full"
          style={{
            opacity: isDrawn ? 1 : 0,
            transition: FADE_TRANSITION,
          }}
        />
      </div>
    </div>
  )
}

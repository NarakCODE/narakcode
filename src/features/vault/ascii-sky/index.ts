// Adapted from https://github.com/unvalley/ascii-sky (MIT License, Copyright (c) 2026 unvalley)
import {
  skyCells,
  sunsetColours,
  sunsetGradient,
  type CloudLayer,
  type SkyCells,
  type SkyTheme,
} from "./cells"
import {
  CONTROLS,
  measureShapes,
  startSky,
  type Sky,
  type ThemeChoice,
} from "./engine"
import { NIGHT, type Stars } from "./shade"

export type { SkyTheme } from "./cells"
export { CONTROLS, type ThemeChoice } from "./engine"
export { NIGHT, type Stars } from "./shade"

export const sky = {
  columns: 400,
  rows: 71,
  cellWidth: 6,
  cellHeight: 9.75,
  version: "0654411dbe",
}

export const SKY_WIDTH: number = sky.columns * sky.cellWidth
export const SKY_HEIGHT: number = sky.rows * sky.cellHeight

const SKY_FILES = {
  text: "sky.txt",
  light: "sky-light.webp",
  dark: "sky-dark.webp",
  near: "clouds-near.webp",
  far: "clouds-far.webp",
} as const

export type SkyAssets =
  | string
  | Readonly<Record<keyof typeof SKY_FILES, string>>

const DEFAULT_ASSETS = "/ascii-sky/"
const CELL: { width: number; height: number } = {
  width: sky.cellWidth,
  height: sky.cellHeight,
}

const urlIn = (folder: string, file: keyof typeof SKY_FILES): string => {
  const base = folder.endsWith("/") ? folder : `${folder}/`
  return `${base}${SKY_FILES[file]}?v=${sky.version}`
}

const skyUrl = (assets: SkyAssets, file: keyof typeof SKY_FILES): string =>
  typeof assets === "string" ? urlIn(assets, file) : assets[file]

const fetched = async (url: string, signal: AbortSignal): Promise<Response> => {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`ascii-sky: ${url} answered ${response.status}`)
  }
  return response
}

const pixelsOf = async (
  url: string,
  signal: AbortSignal
): Promise<CloudLayer> => {
  const response = await fetched(url, signal)
  const bitmap = await createImageBitmap(await response.blob(), {
    colorSpaceConversion: "none",
    premultiplyAlpha: "none",
  })
  const { width, height } = bitmap
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) {
    throw new Error("ascii-sky: no 2d context")
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  return { pixels: ctx.getImageData(0, 0, width, height).data, width, height }
}

const loadSky = async (
  assets: SkyAssets,
  signal: AbortSignal
): Promise<SkyCells> => {
  const [text, light, dark, near, far] = await Promise.all([
    fetched(skyUrl(assets, "text"), signal).then((response) => response.text()),
    pixelsOf(skyUrl(assets, "light"), signal),
    pixelsOf(skyUrl(assets, "dark"), signal),
    pixelsOf(skyUrl(assets, "near"), signal),
    pixelsOf(skyUrl(assets, "far"), signal),
  ])
  return skyCells({
    still: {
      columns: sky.columns,
      rows: sky.rows,
      cellWidth: sky.cellWidth,
      cellHeight: sky.cellHeight,
      text,
      rgb: {
        light: light.pixels,
        dark: dark.pixels,
        sunset: sunsetColours(sky.columns, sky.rows, sky.cellHeight, text),
      },
    },
    near,
    far,
    shapes: measureShapes(sky.cellWidth, sky.cellHeight),
  })
}

const STILL_OPACITY: Record<SkyTheme, number> = {
  light: 0.4,
  dark: 0.33,
  sunset: 0.4,
}

export type StillSkyStyle = {
  background: string
  imageRendering: "pixelated"
  opacity: number
}

export const stillSky = (
  theme: SkyTheme,
  assets: SkyAssets = DEFAULT_ASSETS
): StillSkyStyle => ({
  background:
    theme === "sunset"
      ? sunsetGradient()
      : `url("${skyUrl(assets, theme)}") center top / ${SKY_WIDTH}px ${SKY_HEIGHT}px repeat-x`,
  imageRendering: "pixelated",
  opacity: STILL_OPACITY[theme],
})

export type MountOptions = {
  theme?: ThemeChoice
  assets?: SkyAssets
  faintFrom?: number
  ignore?: string
  night?: Stars
}

export type MountedSky = Sky & {
  ready: Promise<void>
}

export const mountSky = (
  canvas: HTMLCanvasElement,
  {
    theme = "auto",
    assets = DEFAULT_ASSETS,
    faintFrom,
    ignore = CONTROLS,
    night = NIGHT,
  }: MountOptions = {}
): MountedSky => {
  const loading = new AbortController()
  const mounted: { theme: ThemeChoice; running: Sky | undefined } = {
    theme,
    running: undefined,
  }
  const ready = loadSky(assets, loading.signal).then(
    (cells) => {
      if (!loading.signal.aborted) {
        mounted.running = startSky(canvas, cells, SKY_WIDTH, CELL, {
          theme: mounted.theme,
          faintFrom,
          ignore,
          night,
        })
      }
    },
    (error: unknown) => {
      if (!loading.signal.aborted) {
        throw error
      }
    }
  )
  return {
    ready,
    setTheme: (next: ThemeChoice): void => {
      mounted.theme = next
      mounted.running?.setTheme(next)
    },
    stop: (): void => {
      loading.abort()
      mounted.running?.stop()
    },
  }
}

// Adapted from https://github.com/unvalley/ascii-sky (MIT License, Copyright (c) 2026 unvalley)
import { blow, calm, createAir, fitAir, puff, stepAir, type Air } from "./air"
import {
  ALPHA,
  GLYPHS,
  measureGlyph,
  normaliseShapes,
  range,
  RGBA,
  type SkyCells,
  type SkyTheme,
} from "./cells"
import {
  createFrame,
  EVERY_ROW,
  isStarAt,
  layoutGrid,
  shadeFrame,
  stepSparkles,
  TURNS,
  type CellSize,
  type Frame,
  type Grid,
  type Stars,
} from "./shade"

export const FULL_RATE = 60
export const HALF_RATE = 30
export const STEP: number = 1 / FULL_RATE
const MAX_STEPS = 4
const MAX_DT = 0.1
const MS_PER_SECOND = 1000
const CALM_RATE: number = FULL_RATE / TURNS
const PACE_FRAMES = 30
const SLOW_MS = 8
const QUICK_MS = 5
const EARLY_MS = 1.5
const RETRY_MS = 5000
const MOST_DPR = 3
export const CONTROLS = "a, button, input, textarea, select, label, [role]"

export const beat = (drawnAt: number, rate: number, now: number): number => {
  const gap = MS_PER_SECOND / rate
  const due = drawnAt + gap
  if (now < due - EARLY_MS) {
    return Number.NaN
  }
  return now - due < gap ? due : now
}

type Clock = Readonly<{
  time: number
  last: number
  owed: number
  drawnAt: number
}>

const owing = (
  owed: number,
  steps = 0
): Readonly<{ owed: number; steps: number }> => {
  if (steps === MAX_STEPS) {
    return { owed: 0, steps }
  }
  return owed >= STEP ? owing(owed - STEP, steps + 1) : { owed, steps }
}

const advance = (
  clock: Clock,
  now: number,
  due: number
): Readonly<{ clock: Clock; dt: number; steps: number }> => {
  const dt = Math.min(MAX_DT, (now - clock.last) / MS_PER_SECOND)
  const { owed, steps } = owing(clock.owed + dt)
  return {
    clock: { time: clock.time + dt, last: now, owed, drawnAt: due },
    dt,
    steps,
  }
}

type Pace = Readonly<{ rate: number; since: number; costs: readonly number[] }>

const paced = (pace: Pace, rate: number, now: number): Pace =>
  rate === pace.rate ? pace : { rate, since: now, costs: [] }

const retried = (pace: Pace, now: number): Pace =>
  pace.rate === HALF_RATE && now - pace.since >= RETRY_MS
    ? paced(pace, FULL_RATE, now)
    : pace

const median = (values: readonly number[]): number =>
  [...values].sort((a, b) => a - b)[values.length >> 1]

const timed = (pace: Pace, cost: number, now: number): Pace => {
  const costs = [...pace.costs, cost]
  if (costs.length < PACE_FRAMES) {
    return { ...pace, costs }
  }
  const ms = median(costs)
  const counted = { ...pace, costs: [] }
  if (ms > SLOW_MS) {
    return paced(counted, HALF_RATE, now)
  }
  return ms < QUICK_MS ? paced(counted, FULL_RATE, now) : counted
}

const FONT = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
const MEASURE = 8
const GAP = 1
const PAD = 0.25
const PROBE = 100

type Ink = Readonly<{ up: number; down: number; left: number; right: number }>

export const fitGlyphs = (
  ink: Ink,
  cellWidth: number,
  cellHeight: number
): { size: number; x: number; y: number } => {
  const roomWidth = cellWidth - GAP - 2 * PAD
  const roomHeight = cellHeight - GAP - 2 * PAD
  const wide = ink.left + ink.right
  const tall = ink.up + ink.down
  const scale = Math.min(roomWidth / wide, roomHeight / tall)
  return {
    size: PROBE * scale,
    x: GAP + PAD + (roomWidth - wide * scale) / 2 + ink.left * scale,
    y: GAP + PAD + (roomHeight - tall * scale) / 2 + ink.up * scale,
  }
}

const measureInk = (ctx: CanvasRenderingContext2D): Ink => {
  ctx.font = `bold ${PROBE}px ${FONT}`
  return GLYPHS.map((g) => ctx.measureText(g)).reduce(
    (ink, m) => ({
      up: Math.max(ink.up, m.actualBoundingBoxAscent),
      down: Math.max(ink.down, m.actualBoundingBoxDescent),
      left: Math.max(ink.left, m.actualBoundingBoxLeft),
      right: Math.max(ink.right, m.actualBoundingBoxRight),
    }),
    { up: 0, down: 0, left: 0, right: 0 }
  )
}

const context2d = (
  canvas: HTMLCanvasElement,
  settings: CanvasRenderingContext2DSettings
): CanvasRenderingContext2D => {
  const ctx = canvas.getContext("2d", settings)
  if (!ctx) {
    throw new Error("ascii-sky: no 2d context")
  }
  return ctx
}

type Atlas = Readonly<{
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  glyphWidth: number
}>

const drawAtlas = (
  cellWidth: number,
  cellHeight: number,
  scale: number
): Atlas => {
  const glyphWidth = Math.ceil(cellWidth * scale)
  const glyphHeight = Math.ceil(cellHeight * scale)
  const canvas = document.createElement("canvas")
  canvas.width = glyphWidth * GLYPHS.length
  canvas.height = glyphHeight
  const ctx = context2d(canvas, { willReadFrequently: true })
  ctx.fillStyle = "#fff"
  ctx.textBaseline = "alphabetic"
  const fit = fitGlyphs(measureInk(ctx), cellWidth, cellHeight)
  ctx.font = `bold ${fit.size * scale}px ${FONT}`
  const inside = Math.round(GAP * scale)
  const x = Math.round(fit.x * scale)
  const y = Math.round(fit.y * scale)
  GLYPHS.forEach((g, i) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(
      i * glyphWidth + inside,
      inside,
      glyphWidth - inside,
      glyphHeight - inside
    )
    ctx.clip()
    ctx.fillText(g, i * glyphWidth + x, y)
    ctx.restore()
  })
  return { canvas, ctx, glyphWidth }
}

export const measureShapes = (
  cellWidth: number,
  cellHeight: number
): Float32Array => {
  const { canvas, ctx, glyphWidth } = drawAtlas(cellWidth, cellHeight, MEASURE)
  const glyphHeight = canvas.height
  const ink = ctx.getImageData(0, 0, canvas.width, glyphHeight).data
  return normaliseShapes(
    range(GLYPHS.length).map((g) =>
      measureGlyph(
        Uint8ClampedArray.from({ length: glyphWidth * glyphHeight }, (_, i) => {
          const x = i % glyphWidth
          const y = (i - x) / glyphWidth
          return ink[(y * canvas.width + g * glyphWidth + x) * RGBA + ALPHA]
        }),
        glyphWidth,
        glyphHeight
      )
    )
  )
}

type Layer = Readonly<{
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}>

const layer = (canvas: HTMLCanvasElement): Layer => ({
  canvas,
  ctx: context2d(canvas, {}),
})
const offscreen = (): Layer => layer(document.createElement("canvas"))

type Layers = Readonly<{
  main: Layer
  mask: Layer
  ink: Layer
  gaps: Layer
  tint: Layer
  tiles: Layer
}>

const createLayers = (canvas: HTMLCanvasElement): Layers => ({
  main: layer(canvas),
  mask: offscreen(),
  ink: offscreen(),
  gaps: offscreen(),
  tint: offscreen(),
  tiles: offscreen(),
})

type Images = Readonly<{ colours: ImageData; tiles: ImageData }>

const sizeLayers = (layers: Layers, grid: Grid): Images => {
  const { main, mask, ink, gaps, tint, tiles } = layers
  const {
    pixelWidth,
    pixelHeight,
    columns,
    rows,
    dpr,
    originX,
    cellWidth,
    cellHeight,
  } = grid
  ;[main, mask, ink, gaps].forEach(({ canvas }) => {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  })
  ;[tint, tiles].forEach(({ canvas }) => {
    canvas.width = columns
    canvas.height = rows
  })
  main.ctx.imageSmoothingEnabled = false
  ink.ctx.imageSmoothingEnabled = false
  const line = Math.max(1, Math.round(dpr))
  gaps.ctx.fillStyle = "#000"
  range(columns + 1).forEach((c) => {
    gaps.ctx.fillRect(
      Math.round((originX + c * cellWidth) * dpr),
      0,
      line,
      pixelHeight
    )
  })
  range(rows + 1).forEach((r) => {
    gaps.ctx.fillRect(0, Math.round(r * cellHeight * dpr), pixelWidth, line)
  })
  return {
    colours: tint.ctx.createImageData(columns, rows),
    tiles: tiles.ctx.createImageData(columns, rows),
  }
}

const stamp = (
  layers: Layers,
  atlas: Atlas,
  grid: Grid,
  frame: Frame,
  count: number
): void => {
  const mask = layers.mask.ctx
  const { columns, columnLeft, columnWidth, rowTop, rowHeight } = grid
  for (let i = 0; i < count; i += 1) {
    const k = frame.changed[i]
    const r = (k / columns) | 0
    const c = k - r * columns
    const x = columnLeft[c]
    const y = rowTop[r]
    const w = columnWidth[c]
    const h = rowHeight[r]
    mask.clearRect(x, y, w, h)
    const code = frame.shown[k]
    if (code >= 0) {
      mask.drawImage(atlas.canvas, code * atlas.glyphWidth, 0, w, h, x, y, w, h)
    }
  }
}

const composite = (layers: Layers, grid: Grid, images: Images): void => {
  const { main, mask, ink, gaps, tint, tiles } = layers
  const { columns, rows, cellWidth, cellHeight, dpr, originX } = grid
  const left = originX * dpr
  const width = columns * cellWidth * dpr
  const height = rows * cellHeight * dpr
  tiles.ctx.putImageData(images.tiles, 0, 0)
  main.ctx.globalCompositeOperation = "copy"
  main.ctx.drawImage(tiles.canvas, 0, 0, columns, rows, left, 0, width, height)
  main.ctx.globalCompositeOperation = "destination-out"
  main.ctx.drawImage(gaps.canvas, 0, 0)
  tint.ctx.putImageData(images.colours, 0, 0)
  ink.ctx.globalCompositeOperation = "copy"
  ink.ctx.drawImage(mask.canvas, 0, 0)
  ink.ctx.globalCompositeOperation = "source-in"
  ink.ctx.drawImage(tint.canvas, 0, 0, columns, rows, left, 0, width, height)
  main.ctx.globalCompositeOperation = "source-over"
  main.ctx.drawImage(ink.canvas, 0, 0)
}

export type ThemeChoice = SkyTheme | "auto"

export type SkyConfig = Readonly<{
  theme: ThemeChoice
  faintFrom: number | undefined
  ignore: string
  night: Stars
}>

export type Sky = {
  setTheme: (theme: ThemeChoice) => void
  stop: () => void
}

type View = Readonly<{ grid: Grid; atlas: Atlas; frame: Frame; images: Images }>

type Running = {
  choice: ThemeChoice
  theme: SkyTheme
  view: View | undefined
  air: Air
  clock: Clock
  pace: Pace
  drawn: number
  raf: number
  visible: boolean
}

export const startSky = (
  canvas: HTMLCanvasElement,
  cells: SkyCells,
  skyWidth: number,
  cell: CellSize,
  { theme: chosen, faintFrom, ignore, night }: SkyConfig
): Sky => {
  const layers = createLayers(canvas)
  const reduced = globalThis.matchMedia("(prefers-reduced-motion: reduce)")
  const darkScheme = globalThis.matchMedia("(prefers-color-scheme: dark)")
  const listening = new AbortController()
  const { signal } = listening
  const themeOf = (choice: ThemeChoice): SkyTheme => {
    if (choice !== "auto") {
      return choice
    }
    return darkScheme.matches ? "dark" : "light"
  }

  const sky: Running = {
    choice: chosen,
    theme: themeOf(chosen),
    view: undefined,
    air: createAir(0, 0, 1, 1),
    clock: { time: 0, last: 0, owed: 0, drawnAt: Number.NEGATIVE_INFINITY },
    pace: { rate: FULL_RATE, since: 0, costs: [] },
    drawn: 0,
    raf: 0,
    visible: true,
  }

  const isStar = (c: number, r: number): boolean => {
    if (!sky.view) {
      return false
    }
    const { originX, cellWidth, skyOffset } = sky.view.grid
    const skyColumn = Math.floor(
      (originX + c * cellWidth + skyOffset) / cellWidth
    )
    return isStarAt(skyColumn, r, sky.view.frame.night.stars)
  }

  const draw = (half: number, every: number): void => {
    const { view } = sky
    if (!view) {
      return
    }
    const { grid, atlas, frame, images } = view
    const turn = half === EVERY_ROW ? 0 : sky.drawn % every
    const changed = shadeFrame(
      grid,
      cells,
      sky.air,
      frame,
      sky.clock.time,
      sky.theme,
      half,
      every,
      turn
    )
    stamp(layers, atlas, grid, frame, changed)
    composite(layers, grid, images)
    if (canvas.dataset.ready === undefined) {
      canvas.dataset.ready = ""
    }
  }

  const resize = (): void => {
    const rect = canvas.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) {
      return
    }
    const dpr = Math.min(globalThis.devicePixelRatio || 1, MOST_DPR)
    const faint =
      faintFrom ??
      (Number.parseFloat(
        getComputedStyle(canvas).getPropertyValue("--sky-faint")
      ) ||
        0)
    const was = sky.view?.grid
    if (
      was &&
      was.width === rect.width &&
      was.height === rect.height &&
      was.dpr === dpr &&
      was.faintFrom === faint
    ) {
      return
    }
    const grid = layoutGrid(rect.width, rect.height, dpr, skyWidth, cell, faint)
    const atlas =
      sky.view && was?.dpr === dpr
        ? sky.view.atlas
        : drawAtlas(cell.width, cell.height, dpr)
    const images = sizeLayers(layers, grid)
    sky.view = {
      grid,
      atlas,
      images,
      frame: createFrame(grid, images.colours.data, images.tiles.data, night),
    }
    sky.air = fitAir(
      sky.air,
      grid.columns,
      grid.rows,
      grid.cellWidth,
      grid.cellHeight
    )
    sky.drawn = 0
    draw(EVERY_ROW, TURNS)
  }

  const tick = (now: number): void => {
    sky.raf = requestAnimationFrame(tick)
    sky.pace = retried(sky.pace, now)
    const isCalm = !sky.air.lively
    const rate = isCalm ? Math.min(sky.pace.rate, CALM_RATE) : sky.pace.rate
    const due = beat(sky.clock.drawnAt, rate, now)
    if (Number.isNaN(due)) {
      return
    }
    const begin = performance.now()
    const { clock, dt, steps } = advance(sky.clock, now, due)
    sky.clock = clock
    range(steps).forEach(() => {
      stepAir(sky.air, STEP)
    })
    const sparkles = sky.theme === "dark" ? sky.view?.frame.sparkles : undefined
    if (sky.view && sparkles) {
      stepSparkles(sparkles, dt, sky.view.grid.faintRow, isStar, Math.random)
    }
    const half = sky.drawn & 1
    sky.drawn += 1
    draw(half, isCalm ? 1 : TURNS)
    if (!isCalm) {
      sky.pace = timed(sky.pace, performance.now() - begin, now)
    }
  }

  const schedule = (): void => {
    cancelAnimationFrame(sky.raf)
    if (signal.aborted) {
      return
    }
    if (reduced.matches) {
      sky.clock = { ...sky.clock, time: 0 }
      draw(EVERY_ROW, TURNS)
      return
    }
    if (!sky.visible || document.hidden) {
      return
    }
    sky.clock = {
      ...sky.clock,
      last: performance.now(),
      drawnAt: Number.NEGATIVE_INFINITY,
    }
    sky.raf = requestAnimationFrame(tick)
  }

  const pointerAt = (e: PointerEvent): { x: number; y: number } | undefined => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      ? { x, y }
      : undefined
  }
  const onPointerMove = (e: PointerEvent): void => {
    if (reduced.matches || e.pointerType === "touch") {
      return
    }
    const at = sky.visible ? pointerAt(e) : undefined
    if (at) {
      blow(sky.air, at.x, at.y, e.timeStamp)
    } else {
      calm(sky.air)
    }
  }
  const onPointerDown = (e: PointerEvent): void => {
    const isOnControl =
      ignore !== "" &&
      e.target instanceof Element &&
      e.target.closest(ignore) !== null
    if (reduced.matches || isOnControl) {
      return
    }
    const at = pointerAt(e)
    if (at) {
      puff(sky.air, at.x, at.y)
    }
  }
  const onLeave = (): void => calm(sky.air)
  const onTheme = (): void => {
    const next = themeOf(sky.choice)
    if (signal.aborted || next === sky.theme) {
      return
    }
    sky.theme = next
    draw(EVERY_ROW, TURNS)
  }

  const sized = new ResizeObserver(resize)
  const seen = new IntersectionObserver(([entry]) => {
    sky.visible = entry.isIntersecting
    schedule()
  })
  sized.observe(canvas)
  seen.observe(canvas)
  darkScheme.addEventListener("change", onTheme, { signal })
  reduced.addEventListener("change", schedule, { signal })
  document.addEventListener("visibilitychange", schedule, { signal })
  globalThis.addEventListener("pointermove", onPointerMove, {
    passive: true,
    signal,
  })
  globalThis.addEventListener("pointerdown", onPointerDown, {
    passive: true,
    signal,
  })
  document.documentElement.addEventListener("pointerleave", onLeave, { signal })
  globalThis.addEventListener("blur", onLeave, { signal })

  resize()
  schedule()

  return {
    setTheme: (next: ThemeChoice): void => {
      sky.choice = next
      onTheme()
    },
    stop: (): void => {
      listening.abort()
      cancelAnimationFrame(sky.raf)
      sized.disconnect()
      seen.disconnect()
    },
  }
}

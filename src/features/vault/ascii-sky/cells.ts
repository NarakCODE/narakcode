// Adapted from https://github.com/unvalley/ascii-sky (MIT License, Copyright (c) 2026 unvalley)
export const range = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i)

export const span = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

export const once = <T>(make: () => T): (() => T) => {
  const kept: { value: T | undefined } = { value: undefined }
  return () => {
    kept.value ??= make()
    return kept.value
  }
}

export const BYTE_MAX = 255
export const RGB = 3
export const RGBA = 4
export const ALPHA = 3
export const CENTRE = 0.5
export const TAU: number = 2 * Math.PI
const UINT32_RANGE = 4_294_967_296

export const rounded = (x: number): number => (x + CENTRE) | 0

const LOWBIAS32 = {
  firstShift: 16,
  firstMultiplier: 0x7f_eb_35_2d,
  secondShift: 15,
  secondMultiplier: 0x84_6c_a6_8b,
  lastShift: 16,
}

const mix = (n: number): number => {
  const a = Math.imul(
    n ^ (n >>> LOWBIAS32.firstShift),
    LOWBIAS32.firstMultiplier
  )
  const b = Math.imul(
    a ^ (a >>> LOWBIAS32.secondShift),
    LOWBIAS32.secondMultiplier
  )
  return b ^ (b >>> LOWBIAS32.lastShift)
}

export const hash = (x: number, y: number, seed: number): number =>
  (mix(mix(mix(seed) ^ y) ^ x) >>> 0) / UINT32_RANGE

export const wrap = (x: number, n: number): number => {
  const w = x - Math.floor(x / n) * n
  if (w < 0) {
    return w + n
  }
  return w >= n ? w - n : w
}

export const HERMITE = { square: 3, cube: 2 }

export const smoothstep = (from: number, to: number, t: number): number => {
  const x = Math.min(1, Math.max(0, (t - from) / (to - from)))
  return x * x * (HERMITE.square - HERMITE.cube * x)
}

const toByte = (x: number): number => Math.min(BYTE_MAX, Math.max(0, x)) | 0

type Rgb = readonly [number, number, number]

export const hex = (colour: string): Rgb => {
  const channel = (i: number): number => {
    const at = 1 + i * 2
    return Number.parseInt(colour.slice(at, at + 2), 16)
  }
  return [channel(0), channel(1), channel(2)]
}

const SRGB = {
  linearBelow: 0.040_45,
  encodedBelow: 0.003_130_8,
  linearSlope: 12.92,
  offset: 0.055,
  scale: 1.055,
  gamma: 2.4,
}

const toLinear = (v: number): number => {
  const c = v / BYTE_MAX
  return c <= SRGB.linearBelow
    ? c / SRGB.linearSlope
    : ((c + SRGB.offset) / SRGB.scale) ** SRGB.gamma
}

const fromLinear = (v: number): number => {
  const c =
    v <= SRGB.encodedBelow
      ? SRGB.linearSlope * v
      : SRGB.scale * Math.max(0, v) ** (1 / SRGB.gamma) - SRGB.offset
  return Math.max(0, Math.min(BYTE_MAX, Math.round(c * BYTE_MAX)))
}

const LMS_FROM_LINEAR = {
  l: { r: 0.412_221_470_8, g: 0.536_332_536_3, b: 0.051_445_992_9 },
  m: { r: 0.211_903_498_2, g: 0.680_699_545_1, b: 0.107_396_956_6 },
  s: { r: 0.088_302_461_9, g: 0.281_718_837_6, b: 0.629_978_700_5 },
}
const OKLAB_FROM_LMS = {
  lightness: { l: 0.210_454_255_3, m: 0.793_617_785, s: -0.004_072_046_8 },
  a: { l: 1.977_998_495_1, m: -2.428_592_205, s: 0.450_593_709_9 },
  b: { l: 0.025_904_037_1, m: 0.782_771_766_2, s: -0.808_675_766 },
}
const LMS_FROM_OKLAB = {
  l: { a: 0.396_337_777_4, b: 0.215_803_757_3 },
  m: { a: -0.105_561_345_8, b: -0.063_854_172_8 },
  s: { a: -0.089_484_177_5, b: -1.291_485_548 },
}
const LINEAR_FROM_LMS = {
  r: { l: 4.076_741_662_1, m: -3.307_711_591_3, s: 0.230_969_929_2 },
  g: { l: -1.268_438_004_6, m: 2.609_757_401_1, s: -0.341_319_396_5 },
  b: { l: -0.004_196_086_3, m: -0.703_418_614_7, s: 1.707_614_701 },
}
const CUBE = 3

type FromRgb = Readonly<{ r: number; g: number; b: number }>
type FromLms = Readonly<{ l: number; m: number; s: number }>
type FromLab = Readonly<{ a: number; b: number }>

export const oklab = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  const linear = [toLinear(r), toLinear(g), toLinear(b)]
  const cone = (row: FromRgb): number =>
    Math.cbrt(row.r * linear[0] + row.g * linear[1] + row.b * linear[2])
  const l = cone(LMS_FROM_LINEAR.l)
  const m = cone(LMS_FROM_LINEAR.m)
  const s = cone(LMS_FROM_LINEAR.s)
  const axis = (row: FromLms): number => row.l * l + row.m * m + row.s * s
  return [
    axis(OKLAB_FROM_LMS.lightness),
    axis(OKLAB_FROM_LMS.a),
    axis(OKLAB_FROM_LMS.b),
  ]
}

export const fromOklab = (
  lightness: number,
  a: number,
  b: number
): [number, number, number] => {
  const cone = (row: FromLab): number =>
    (lightness + row.a * a + row.b * b) ** CUBE
  const l = cone(LMS_FROM_OKLAB.l)
  const m = cone(LMS_FROM_OKLAB.m)
  const s = cone(LMS_FROM_OKLAB.s)
  const channel = (row: FromLms): number =>
    fromLinear(row.l * l + row.m * m + row.s * s)
  return [
    channel(LINEAR_FROM_LMS.r),
    channel(LINEAR_FROM_LMS.g),
    channel(LINEAR_FROM_LMS.b),
  ]
}

export const SKY_RAMP = ".:+*ox%#@"
export const GLYPHS: string[] = [
  ...new Set([...SKY_RAMP.split(""), ..."-_'`,;~()8|/\\".split("")]),
]
export const glyphOf = (g: string): number => GLYPHS.indexOf(g)
const codes = (glyphs: string): number[] => glyphs.split("").map(glyphOf)
const EDGE_GLYPHS = ".,'`-_~():;"
const EDGE = codes(EDGE_GLYPHS)
const CURLY_GLYPHS = "~()"
const CURLY_COST = 0.06
const EDGE_COST = EDGE_GLYPHS.split("").map((g) =>
  CURLY_GLYPHS.includes(g) ? CURLY_COST : 0
)

const REGION_COLUMNS = { left: 0.27, right: 0.73 }
const REGION_ROWS = { top: 0.2, middle: 0.5, bottom: 0.8 }
export const REGIONS = [
  REGION_ROWS.top,
  REGION_ROWS.middle,
  REGION_ROWS.bottom,
].flatMap((y) => [
  { x: REGION_COLUMNS.left, y },
  { x: REGION_COLUMNS.right, y },
])
export const REGION_COUNT: number = REGIONS.length
export const REGION_RADIUS = 0.24
const LAST_REGION: number = REGION_COUNT - 1

export const measureGlyph = (
  alpha: ArrayLike<number>,
  width: number,
  height: number
): Float32Array => {
  const radius = REGION_RADIUS * width
  return Float32Array.from(REGIONS, (region) => {
    const cx = region.x * width
    const cy = region.y * height
    const xs = span(Math.floor(cx - radius), Math.ceil(cx + radius))
    const disc = span(Math.floor(cy - radius), Math.ceil(cy + radius)).flatMap(
      (y) =>
        xs
          .filter(
            (x) =>
              (x + CENTRE - cx) ** 2 + (y + CENTRE - cy) ** 2 <= radius * radius
          )
          .map((x) => ({ x, y }))
    )
    const isInside = ({ x, y }: { x: number; y: number }): boolean =>
      x >= 0 && y >= 0 && x < width && y < height
    const ink = disc.reduce(
      (total, pixel) =>
        isInside(pixel)
          ? total + alpha[pixel.y * width + pixel.x] / BYTE_MAX
          : total,
      0
    )
    return disc.length > 0 ? ink / disc.length : 0
  })
}

export const normaliseShapes = (
  measured: readonly Float32Array[]
): Float32Array => {
  const most = REGIONS.map((_, k) =>
    measured.reduce((m, shape) => Math.max(m, shape[k]), 0)
  )
  return Float32Array.from(
    measured.flatMap((shape) =>
      Array.from(shape, (v, k) => (most[k] ? v / most[k] : 0))
    )
  )
}

export type CloudLayer = {
  pixels: Uint8ClampedArray
  width: number
  height: number
}

const CLOUD_SHADE = 0
const CLOUD_COVER = 1
const LAYER_SCALE = 2

export type SkyTheme = "light" | "dark" | "sunset"

type ThemeStyle = {
  inside: readonly number[]
  tile: readonly Rgb[]
  glyph: readonly Rgb[]
  edge: readonly Rgb[]
  wash: Readonly<{ thin: number; dense: number }>
  smallestCloud: number
  clouds: boolean
  farClouds: boolean
}

const palette = (...colours: string[]): Rgb[] => colours.map(hex)

export const THEMES: Record<SkyTheme, ThemeStyle> = {
  light: {
    inside: codes(" .:;o8%@"),
    tile: palette("#ffffff", "#f5f8fc", "#ebf1f8", "#dfe8f2"),
    glyph: palette("#b8cee0", "#a0bbd3", "#8aa8c6", "#7496b9"),
    edge: palette("#b8cee0", "#a0bbd3", "#8aa8c6", "#7496b9"),
    wash: { thin: 0.2, dense: 0.5 },
    smallestCloud: 0,
    clouds: true,
    farClouds: true,
  },
  dark: {
    inside: codes(" .:;o8%#@"),
    tile: palette("#ffffff", "#e6edf8", "#bccbe4", "#8a9fc6"),
    glyph: palette("#c6d4ea", "#aebfdc", "#8ea3c8", "#6d83ad"),
    edge: palette("#ffffff", "#e6edf8", "#bccbe4", "#8a9fc6"),
    wash: { thin: 0.18, dense: 0.42 },
    smallestCloud: 0,
    clouds: false,
    farClouds: false,
  },
  sunset: {
    inside: codes(" .:;o8%@"),
    tile: palette("#ffeedd", "#ffd8c8", "#f9bfd2", "#e3a6d6"),
    glyph: palette("#ff9a68", "#f87a96", "#d064b0", "#985cc4"),
    edge: palette("#ff9a68", "#f87a96", "#d064b0", "#985cc4"),
    wash: { thin: 0.3, dense: 0.6 },
    smallestCloud: 6000,
    clouds: true,
    farClouds: false,
  },
}

export const SUNSET_STOPS: readonly Readonly<{ at: number; colour: string }>[] =
  [
    { at: 0, colour: "#5a4cc2" },
    { at: 100, colour: "#9551c6" },
    { at: 180, colour: "#df4f9d" },
    { at: 260, colour: "#ff6a63" },
    { at: 340, colour: "#ff9148" },
    { at: 440, colour: "#ffbb4a" },
  ]
const SUNSET_LAB = SUNSET_STOPS.map(({ at, colour }) => ({
  at,
  lab: oklab(...hex(colour)),
}))
const SUNSET_DEPTH = 0.1

const sunsetAt = (y: number): readonly [number, number, number] => {
  const [first] = SUNSET_LAB
  const last = SUNSET_LAB.at(-1) ?? first
  if (y <= first.at) {
    return first.lab
  }
  if (y >= last.at) {
    return last.lab
  }
  const next = SUNSET_LAB.findIndex(({ at }) => at >= y)
  const above = SUNSET_LAB[next - 1]
  const below = SUNSET_LAB[next]
  const t = (y - above.at) / (below.at - above.at)
  const [a, b] = [above.lab, below.lab]
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

export const sunsetColours = (
  columns: number,
  rows: number,
  cellHeight: number,
  text: string
): Uint8ClampedArray => {
  const written = text.split("\n")
  const lines = range(rows).map((r) => written[r] ?? "")
  const shades = range(rows).map((r) => {
    const [lightness, a, b] = sunsetAt((r + CENTRE) * cellHeight)
    return SKY_RAMP.split("").map((_, g) =>
      fromOklab(
        lightness + SUNSET_DEPTH * (CENTRE - g / (SKY_RAMP.length - 1)),
        a,
        b
      )
    )
  })
  return Uint8ClampedArray.from({ length: columns * rows * RGBA }, (_, i) => {
    const channel = i % RGBA
    const k = (i - channel) / RGBA
    const c = k % columns
    const r = (k - c) / columns
    const glyph = lines[r][c] ?? "."
    return channel === ALPHA
      ? BYTE_MAX
      : shades[r][Math.max(0, SKY_RAMP.indexOf(glyph))][channel]
  })
}

const SUNSET_STOP_LIST = SUNSET_STOPS.map(
  ({ at, colour }) => `${colour} ${at}px`
).join(", ")

export const sunsetGradient = (): string =>
  `linear-gradient(to bottom, ${SUNSET_STOP_LIST})`

export const bigClouds = (layer: CloudLayer, smallest: number): CloudLayer => {
  const { pixels, width, height } = layer
  const out = new Uint8ClampedArray(pixels)
  const seen = new Uint8Array(width * height)
  const isCloud = (i: number): boolean => pixels[i * RGBA + CLOUD_COVER] > 0
  const besides = (i: number): number[] => {
    const x = i % width
    const y = (i - x) / width
    return [
      y * width + (x + 1 === width ? 0 : x + 1),
      y * width + (x === 0 ? width - 1 : x - 1),
      y > 0 ? i - width : -1,
      y + 1 < height ? i + width : -1,
    ]
  }
  const cloudFrom = (start: number): number[] => {
    const cloud = [start]
    seen[start] = 1
    for (const i of cloud) {
      for (const j of besides(i)) {
        if (j < 0 || seen[j] !== 0 || !isCloud(j)) {
          continue
        }
        seen[j] = 1
        cloud.push(j)
      }
    }
    return cloud
  }
  range(width * height).forEach((start) => {
    if (seen[start] === 1 || !isCloud(start)) {
      return
    }
    const cloud = cloudFrom(start)
    if (cloud.length < smallest / LAYER_SCALE ** 2) {
      cloud.forEach((k) => {
        out[k * RGBA + CLOUD_SHADE] = 0
        out[k * RGBA + CLOUD_COVER] = 0
      })
    }
  })
  return { pixels: out, width, height }
}

export const WIND = { near: 18, far: 8 }
const FAR_LAG = 3
const GUSTS = [
  { share: 0.45, period: 23, phase: 0 },
  { share: 0.25, period: 8.7, phase: 1.1 },
]
export const drift = (seconds: number, mean: number, lag: number): number =>
  GUSTS.reduce((d, { share, period, phase }) => {
    const w = TAU / period
    return (
      d +
      (share / w) * (Math.sin(w * (seconds - lag) + phase) - Math.sin(phase))
    )
  }, seconds) * mean

const BILLOW = { across: 240, down: 120, x: 28, y: 12, driftX: 14, driftY: -3 }
const CURL = { across: 90, down: 30, x: 8, y: 5, driftX: -16, driftY: 4 }
const CURL_OFFSET = { x: 61.3, y: 17.9 }
const SEED_SKEW = 0.7
const FRAY = 0.55
const FRAY_MIX = { billow: 0.6, curl: 0.7 }
const SHADE_SHIFT = 0.14
const FAR_SCALE = 0.6
const FAR_SEED = 37.1

const NOISE_SIZE = 128
const NOISE_CELL = 16
const LATTICE: number = NOISE_SIZE / NOISE_CELL
const NOISE_CHANNELS = 4
const NOISE_SHIFT_X = 0
const NOISE_SHIFT_Y = 1
const NOISE_SHADE = 2
const NOISE_FRAY = 3
const NOISE_SEED = 7
const MULBERRY32 = {
  step: 0x6d_2b_79_f5,
  firstShift: 15,
  secondShift: 7,
  secondOr: 61,
  lastShift: 14,
}
const PERLIN_FADE = { fifth: 6, fourth: 15, third: 10 }

const randomAt = (k: number): number => {
  const s = (NOISE_SEED + k * MULBERRY32.step) >>> 0
  const a = Math.imul(s ^ (s >>> MULBERRY32.firstShift), s | 1)
  const b =
    a ^
    (a + Math.imul(a ^ (a >>> MULBERRY32.secondShift), a | MULBERRY32.secondOr))
  return ((b ^ (b >>> MULBERRY32.lastShift)) >>> 0) / UINT32_RANGE
}

const fade = (t: number): number =>
  t *
  t *
  t *
  (t * (t * PERLIN_FADE.fifth - PERLIN_FADE.fourth) + PERLIN_FADE.third)

const octave = (n: number, first: number): ((i: number) => number) => {
  const values = Float64Array.from(
    { length: n * n * NOISE_CHANNELS },
    (_, i) => randomAt(first + i + 1) * 2 - 1
  )
  const step = NOISE_SIZE / n
  const lo = Int32Array.from({ length: NOISE_SIZE }, (_, x) =>
    Math.floor(x / step)
  )
  const hi = lo.map((l) => (l + 1) % n)
  const along = Float64Array.from(lo, (l, x) => fade(x / step - l))
  return (i: number): number => {
    const k = i % NOISE_CHANNELS
    const texel = (i - k) / NOISE_CHANNELS
    const x = texel % NOISE_SIZE
    const y = (texel - x) / NOISE_SIZE
    const u = along[x]
    const v = along[y]
    const topLeft = values[(lo[y] * n + lo[x]) * NOISE_CHANNELS + k]
    const topRight = values[(lo[y] * n + hi[x]) * NOISE_CHANNELS + k]
    const bottomLeft = values[(hi[y] * n + lo[x]) * NOISE_CHANNELS + k]
    const bottomRight = values[(hi[y] * n + hi[x]) * NOISE_CHANNELS + k]
    return (
      topLeft +
      (topRight - topLeft) * u +
      (bottomLeft -
        topLeft +
        (bottomRight - bottomLeft - topRight + topLeft) * u) *
        v
    )
  }
}

const OCTAVES: { cells: number; weight: number }[] = [
  { cells: LATTICE, weight: 1 },
  { cells: LATTICE * 2, weight: 0.5 },
]

const makeNoise = (): Float32Array => {
  const firsts = OCTAVES.map((_, o) =>
    OCTAVES.slice(0, o).reduce(
      (sum, { cells }) => sum + cells * cells * NOISE_CHANNELS,
      0
    )
  )
  const layers = OCTAVES.map(({ cells, weight }, o) => ({
    at: octave(cells, firsts[o]),
    weight,
  }))
  const raw = Float32Array.from(
    { length: NOISE_SIZE * NOISE_SIZE * NOISE_CHANNELS },
    (_, i) =>
      layers.reduce(
        (sum, { at, weight }) => Math.fround(sum + weight * at(i)),
        0
      )
  )
  const most = raw.reduce((m, v) => Math.max(m, Math.abs(v)), 0)
  return raw.map((v) => v / most)
}
const sharedNoise = once(makeNoise)

const slideMost = (
  line: Uint8Array,
  r: number,
  fore: Uint8Array,
  back: Uint8Array,
  most: Uint8Array
): void => {
  const n = line.length
  const w = 2 * r + 1
  for (let b = 0; b < n; b += w) {
    const e = Math.min(b + w, n)
    fore[b] = line[b]
    for (let p: number = b + 1; p < e; p += 1) {
      fore[p] = Math.max(fore[p - 1], line[p])
    }
    back[e - 1] = line[e - 1]
    for (let p: number = e - 2; p >= b; p -= 1) {
      back[p] = Math.max(back[p + 1], line[p])
    }
  }
  for (let k = 0; k < most.length; k += 1) {
    most[k] = Math.max(back[k], fore[k + w - 1])
  }
}

const BAND_BITS = 7
const BAND: number = 1 << BAND_BITS

const wrapIndex = (k: number, n: number): number =>
  k < 0 || k >= n ? ((k % n) + n) % n : k

const reachBand = (
  layer: CloudLayer,
  rx: number,
  ry: number,
  x0: number,
  out: Uint8Array
): void => {
  const { pixels, width, height } = layer
  const bandWidth = Math.min(width, x0 + BAND) - x0
  const across = new Uint8Array(bandWidth * height)
  const row = new Uint8Array(bandWidth + 2 * rx)
  const rowFore = new Uint8Array(row.length)
  const rowBack = new Uint8Array(row.length)
  for (let j = 0; j < height; j += 1) {
    for (let p = 0; p < row.length; p += 1) {
      row[p] =
        pixels[(j * width + wrapIndex(x0 + p - rx, width)) * RGBA + CLOUD_COVER]
    }
    slideMost(
      row,
      rx,
      rowFore,
      rowBack,
      across.subarray(j * bandWidth, (j + 1) * bandWidth)
    )
  }
  const column = new Uint8Array(height + 2 * ry)
  const columnFore = new Uint8Array(column.length)
  const columnBack = new Uint8Array(column.length)
  const most = new Uint8Array(height)
  for (let i = 0; i < bandWidth; i += 1) {
    for (let j = 0; j < height; j += 1) {
      column[ry + j] = across[j * bandWidth + i]
    }
    slideMost(column, ry, columnFore, columnBack, most)
    for (let j = 0; j < height; j += 1) {
      out[j * width + x0 + i] = most[j]
    }
  }
}

type Reach = (x: number, y: number) => number

export const reachOf = (layer: CloudLayer, rx: number, ry: number): Reach => {
  const { width, height } = layer
  const out = new Uint8Array(width * height)
  const done = new Uint8Array(Math.ceil(width / BAND))
  return (x: number, y: number) => {
    const i = wrap(Math.floor(x / LAYER_SCALE), width)
    const j = Math.min(height - 1, Math.max(0, Math.floor(y / LAYER_SCALE)))
    const band = i >> BAND_BITS
    if (done[band] === 0) {
      reachBand(layer, rx, ry, band * BAND, out)
      done[band] = 1
    }
    return out[j * width + i]
  }
}

export type StillSky = {
  columns: number
  rows: number
  cellWidth: number
  cellHeight: number
  text: string
  rgb: Record<SkyTheme, ArrayLike<number>>
}

export type Look = {
  readonly glyph: Float64Array
  readonly tile: Float64Array
  density: number
  tileAlpha: number
}

export const createLook = (): Look => ({
  glyph: new Float64Array(RGB),
  tile: new Float64Array(RGB),
  density: 0,
  tileAlpha: 0,
})

export type CellAt = (
  left: number,
  top: number,
  width: number,
  height: number,
  look: Look,
  index: number,
  shown: number,
  pushX: number,
  pushY: number
) => number

export type SkyCells = Readonly<{
  at: (seconds: number, theme: SkyTheme) => CellAt
  indexAt: (x: number, y: number) => number
}>

type Samples = Readonly<{ shade: Float32Array; cover: Float32Array }>
type Shape = { shiftX: number; shiftY: number; fray: number; shade: number }

type Clouds = Readonly<{
  noise: Float32Array
  near: CloudLayer
  nearWide: Reach
  nearAround: Reach
  farWide: Reach
  farAround: Reach
}>

type Moment = {
  seconds: number
  style: ThemeStyle
  map: ArrayLike<number>
  clouds: Clouds | undefined
  nearShift: number
  farShift: number
}

type Sky = Readonly<{
  still: StillSky
  shapes: Float32Array
  density: Float32Array
  near: CloudLayer
  far: CloudLayer
  cloudsOf: Record<SkyTheme, () => Clouds>
  now: Moment
}>

export const OPEN_SKY = -3
export const BLANK = -1

const REACH = 6
const NEAR_CLOUD = 3
const COVERED = { thin: 0.2, full: 0.7 }
const HALF_COVER_GAIN = 4
const KEEP_SHADE = 0.8
const KEEP_SHAPE = 0.1
const EDGE_INK = 0.7
const BLANK_INK = 0.35
const SHADE_CURVE = 1.35
const LAST_STOP_MARGIN = 1.0001
const BILINEAR_MARGIN = 1.001
const FAINTEST_CLOUD = 0.14
const NEAR_SHARE = 0.5
const INSIDE = { coverage: 0.6, thinnest: 0.3 }
const TILE_FILL = {
  insideFrom: 0.55,
  edgeFrom: 0.15,
  full: 0.9,
  edge: 0.8,
  far: 0.85,
}
const JITTER = 1.5
const JITTER_SEED = { near: 3, far: 5 }

const COVER_OF = Float32Array.from({ length: BYTE_MAX + 1 }, (_, v) =>
  smoothstep(COVERED.thin, COVERED.full, v / BYTE_MAX)
)

const wantedInk = new Float32Array(REGION_COUNT)
const tileColour = new Float64Array(RGB)
const COLUMN_SPOTS = Object.values(REGION_COLUMNS)
const ROW_SPOTS = Object.values(REGION_ROWS)
const spotLeft = new Int32Array(COLUMN_SPOTS.length)
const spotRight = new Int32Array(COLUMN_SPOTS.length)
const spotAcross = new Float64Array(COLUMN_SPOTS.length)
const spotTop = new Int32Array(ROW_SPOTS.length)
const spotDown = new Float64Array(ROW_SPOTS.length)
const nearSamples: Samples = {
  shade: new Float32Array(REGION_COUNT),
  cover: new Float32Array(REGION_COUNT),
}
const farSamples: Samples = {
  shade: new Float32Array(REGION_COUNT),
  cover: new Float32Array(REGION_COUNT),
}
const grain = new Float32Array(NOISE_CHANNELS)
const nearShape: Shape = { shiftX: 0, shiftY: 0, fray: 0, shade: 0 }
const farShape: Shape = { shiftX: 0, shiftY: 0, fray: 0, shade: 0 }

const stillIndex = (still: StillSky, x: number, y: number): number => {
  const c = wrap(Math.floor(x / still.cellWidth), still.columns)
  const r = Math.min(
    still.rows - 1,
    Math.max(0, Math.floor(y / still.cellHeight))
  )
  return r * still.columns + c
}

const sampleRegions = (
  layer: CloudLayer,
  left: number,
  top: number,
  width: number,
  height: number,
  windShift: number,
  shape: Shape,
  out: Samples
): void => {
  const { pixels, width: layerWidth, height: layerHeight } = layer
  for (let c = 0; c < COLUMN_SPOTS.length; c += 1) {
    const x = left + COLUMN_SPOTS[c] * width - windShift + shape.shiftX
    const fx = wrap(x / LAYER_SCALE, layerWidth) - CENTRE
    const x0 = Math.floor(fx)
    const from = x0 < 0 ? x0 + layerWidth : x0
    spotLeft[c] = from
    spotRight[c] = from + 1 === layerWidth ? 0 : from + 1
    spotAcross[c] = fx - x0
  }
  for (let r = 0; r < ROW_SPOTS.length; r += 1) {
    const y = top + ROW_SPOTS[r] * height + shape.shiftY
    const fy = Math.min(
      layerHeight - BILINEAR_MARGIN,
      Math.max(0, y / LAYER_SCALE - CENTRE)
    )
    const y0 = Math.floor(fy)
    spotTop[r] = y0 * layerWidth
    spotDown[r] = fy - y0
  }
  for (let k = 0; k < REGION_COUNT; k += 1) {
    const c = k % COLUMN_SPOTS.length
    const r = (k - c) / COLUMN_SPOTS.length
    const u = spotAcross[c]
    const v = spotDown[r]
    const topLeft = (spotTop[r] + spotLeft[c]) * RGBA
    const topRight = (spotTop[r] + spotRight[c]) * RGBA
    const bottomLeft = topLeft + layerWidth * RGBA
    const bottomRight = topRight + layerWidth * RGBA
    const wTopLeft = (1 - u) * (1 - v)
    const wTopRight = u * (1 - v)
    const wBottomLeft = (1 - u) * v
    const wBottomRight = u * v
    out.shade[k] =
      pixels[topLeft + CLOUD_SHADE] * wTopLeft +
      pixels[topRight + CLOUD_SHADE] * wTopRight +
      pixels[bottomLeft + CLOUD_SHADE] * wBottomLeft +
      pixels[bottomRight + CLOUD_SHADE] * wBottomRight
    out.cover[k] =
      pixels[topLeft + CLOUD_COVER] * wTopLeft +
      pixels[topRight + CLOUD_COVER] * wTopRight +
      pixels[bottomLeft + CLOUD_COVER] * wBottomLeft +
      pixels[bottomRight + CLOUD_COVER] * wBottomRight
  }
}

const shadeGlyph = (
  glyphs: readonly number[],
  shade: number,
  jitter: number,
  shown: number
): number => {
  const at = shade ** SHADE_CURVE * (glyphs.length - CENTRE) + jitter
  const j = shown < 0 ? -1 : glyphs.indexOf(shown)
  if (j >= 0 && Math.abs(j + CENTRE - at) < KEEP_SHADE) {
    return shown
  }
  return glyphs[Math.min(glyphs.length - 1, Math.max(0, Math.floor(at)))]
}

const shapeGlyph = (shapes: Float32Array, shown: number): number => {
  let best = BLANK
  let bestDistance = 0
  for (let k = 0; k < REGION_COUNT; k += 1) {
    bestDistance += wantedInk[k] * wantedInk[k]
  }
  let shownDistance = shown === BLANK ? bestDistance : Number.POSITIVE_INFINITY
  for (let e = 0; e < EDGE.length; e += 1) {
    const g = EDGE[e]
    const shape = g * REGION_COUNT
    let distance = EDGE_COST[e]
    for (let k = 0; k < REGION_COUNT; k += 1) {
      const diff = shapes[shape + k] - wantedInk[k]
      distance += diff * diff
    }
    if (g === shown) {
      shownDistance = distance
    }
    if (distance >= bestDistance) {
      continue
    }
    bestDistance = distance
    best = g
  }
  return shownDistance <= bestDistance + KEEP_SHAPE ? shown : best
}

const paletteAt = (
  colours: readonly Rgb[],
  shade: number,
  out: Float64Array
): void => {
  const p = Math.min(
    colours.length - LAST_STOP_MARGIN,
    Math.max(0, shade) * (colours.length - 1)
  )
  const j = Math.floor(p)
  const q = p - j
  for (let k = 0; k < out.length; k += 1) {
    out[k] = colours[j][k] + (colours[j + 1][k] - colours[j][k]) * q
  }
}

const noiseAt = (
  noise: Float32Array,
  u: number,
  v: number,
  out: Float32Array
): void => {
  const fu = wrap(u, NOISE_SIZE)
  const fv = wrap(v, NOISE_SIZE)
  const x0 = fu | 0
  const y0 = fv | 0
  const a = fu - x0
  const b = fv - y0
  const x1 = x0 + 1 === NOISE_SIZE ? 0 : x0 + 1
  const y1 = y0 + 1 === NOISE_SIZE ? 0 : y0 + 1
  const topLeft = (y0 * NOISE_SIZE + x0) * NOISE_CHANNELS
  const topRight = (y0 * NOISE_SIZE + x1) * NOISE_CHANNELS
  const bottomLeft = (y1 * NOISE_SIZE + x0) * NOISE_CHANNELS
  const bottomRight = (y1 * NOISE_SIZE + x1) * NOISE_CHANNELS
  for (let k = 0; k < NOISE_CHANNELS; k += 1) {
    const top =
      noise[topLeft + k] + (noise[topRight + k] - noise[topLeft + k]) * a
    const bottom =
      noise[bottomLeft + k] +
      (noise[bottomRight + k] - noise[bottomLeft + k]) * a
    out[k] = top + (bottom - top) * b
  }
}

const shapeAt = (
  noise: Float32Array,
  time: number,
  u: number,
  y: number,
  scale: number,
  seed: number,
  out: Shape
): void => {
  const s = NOISE_CELL / scale
  noiseAt(
    noise,
    ((u + BILLOW.driftX * time) * s) / BILLOW.across + seed,
    ((y + BILLOW.driftY * time) * s) / BILLOW.down + seed * SEED_SKEW,
    grain
  )
  const shiftX = BILLOW.x * grain[NOISE_SHIFT_X]
  const shiftY = BILLOW.y * grain[NOISE_SHIFT_Y]
  const shade = grain[NOISE_SHADE]
  const fray = grain[NOISE_FRAY]
  noiseAt(
    noise,
    ((u + CURL.driftX * time) * s) / CURL.across + CURL_OFFSET.x + seed,
    ((y + CURL.driftY * time) * s) / CURL.down + CURL_OFFSET.y + seed,
    grain
  )
  out.shiftX = Math.fround((shiftX + CURL.x * grain[NOISE_SHIFT_X]) * scale)
  out.shiftY = Math.fround((shiftY + CURL.y * grain[NOISE_SHIFT_Y]) * scale)
  out.fray = Math.fround(
    Math.max(
      -1,
      Math.min(1, FRAY_MIX.billow * fray + FRAY_MIX.curl * grain[NOISE_SHADE])
    ) * FRAY
  )
  out.shade = Math.fround(shade * SHADE_SHIFT * BYTE_MAX)
}

const covered = (cover: number, fray: number): number => {
  const c = cover / BYTE_MAX
  const frayed = (c + fray * HALF_COVER_GAIN * c * (1 - c)) * BYTE_MAX
  return COVER_OF[toByte(frayed)]
}

const wideReach = (layer: CloudLayer, scale: number): Reach =>
  reachOf(
    layer,
    REACH + Math.ceil(((BILLOW.x + CURL.x) * scale) / LAYER_SCALE),
    REACH + Math.ceil(((BILLOW.y + CURL.y) * scale) / LAYER_SCALE)
  )

const findClouds = (
  near: CloudLayer,
  far: CloudLayer,
  smallest: number
): Clouds => {
  const nearer = smallest > 0 ? bigClouds(near, smallest) : near
  return {
    noise: sharedNoise(),
    near: nearer,
    nearWide: wideReach(nearer, 1),
    nearAround: reachOf(nearer, REACH, REACH),
    farWide: wideReach(far, FAR_SCALE),
    farAround: reachOf(far, REACH, REACH),
  }
}

const isNearHere = (now: Moment, x: number, y: number): boolean => {
  const { clouds } = now
  if (!clouds || clouds.nearWide(x, y) < NEAR_CLOUD) {
    return false
  }
  shapeAt(clouds.noise, now.seconds, x, y, 1, 0, nearShape)
  return (
    clouds.nearAround(x + nearShape.shiftX, y + nearShape.shiftY) >= NEAR_CLOUD
  )
}

const isFarHere = (now: Moment, x: number, y: number): boolean => {
  const { clouds } = now
  if (!(clouds && now.style.farClouds) || clouds.farWide(x, y) < NEAR_CLOUD) {
    return false
  }
  shapeAt(clouds.noise, now.seconds, x, y, FAR_SCALE, FAR_SEED, farShape)
  return (
    clouds.farAround(x + farShape.shiftX, y + farShape.shiftY) >= NEAR_CLOUD
  )
}

const cellOf = (
  sky: Sky,
  left: number,
  top: number,
  width: number,
  height: number,
  look: Look,
  index: number,
  shown: number,
  pushX: number,
  pushY: number
): number => {
  const { now, density } = sky
  const { style, map, clouds, nearShift, farShift } = now
  const nearer = clouds ? clouds.near : sky.near
  const cx = left + width / 2
  const cy = top + height / 2
  const pushedLeft = left - pushX
  const pushedTop = top - pushY
  const lx = cx - pushX
  const ly = cy - pushY
  const hasNear = isNearHere(now, lx - nearShift, ly)
  const hasFar = isFarHere(now, lx - farShift, ly)
  const { glyph, tile } = look
  const pixel = index * RGBA
  for (let k = 0; k < glyph.length; k += 1) {
    glyph[k] = map[pixel + k]
    tile[k] = map[pixel + k]
  }
  look.density = density[index]
  const wash =
    style.wash.thin + (style.wash.dense - style.wash.thin) * density[index]
  look.tileAlpha = wash
  if (!(hasNear || hasFar)) {
    return OPEN_SKY
  }
  let sum = 0
  let thinnest = 1
  let most = 0
  let shaded = 0
  let nearSum = 0
  if (hasNear) {
    sampleRegions(
      nearer,
      pushedLeft,
      pushedTop,
      width,
      height,
      nearShift,
      nearShape,
      nearSamples
    )
  }
  if (hasFar) {
    sampleRegions(
      sky.far,
      pushedLeft,
      pushedTop,
      width,
      height,
      farShift,
      farShape,
      farSamples
    )
  }
  for (let k = 0; k < REGION_COUNT; k += 1) {
    const nearCover = hasNear
      ? covered(nearSamples.cover[k], nearShape.fray)
      : 0
    const nearShade = hasNear
      ? toByte(nearSamples.shade[k] + nearShape.shade)
      : 0
    const farCover = hasFar ? covered(farSamples.cover[k], farShape.fray) : 0
    const farShade = hasFar ? toByte(farSamples.shade[k] + farShape.shade) : 0
    const cover = nearCover + farCover * (1 - nearCover)
    wantedInk[k] = cover * EDGE_INK
    thinnest = Math.min(thinnest, cover)
    most = Math.max(most, cover)
    sum += cover
    nearSum += nearCover
    shaded +=
      (nearCover * nearShade + farCover * (1 - nearCover) * farShade) / BYTE_MAX
  }
  if (most < FAINTEST_CLOUD) {
    return OPEN_SKY
  }
  const shade = sum > 0 ? shaded / sum : 0
  const coverage = sum / REGION_COUNT
  const isOnNear = nearSum >= sum * NEAR_SHARE
  const u = Math.floor((lx - (isOnNear ? nearShift : farShift)) / width)
  const v = Math.floor(ly / height)
  const isInside = coverage >= INSIDE.coverage && thinnest >= INSIDE.thinnest
  paletteAt(style.tile, shade, tileColour)
  const fill =
    (isInside
      ? smoothstep(TILE_FILL.insideFrom, TILE_FILL.full, coverage)
      : TILE_FILL.edge *
        smoothstep(TILE_FILL.edgeFrom, TILE_FILL.full, coverage)) *
    (isOnNear ? 1 : TILE_FILL.far)
  const tileAlpha = fill + (1 - fill) * wash
  for (let k = 0; k < tile.length; k += 1) {
    tile[k] = (fill * tileColour[k] + (1 - fill) * wash * tile[k]) / tileAlpha
  }
  look.tileAlpha = tileAlpha
  if (isInside) {
    paletteAt(style.glyph, shade, glyph)
    const jitter =
      (hash(u, v, isOnNear ? JITTER_SEED.near : JITTER_SEED.far) - CENTRE) *
      JITTER
    return shadeGlyph(style.inside, shade, jitter, shown)
  }
  const best = shapeGlyph(sky.shapes, shown)
  if (best < 0) {
    return wantedInk[LAST_REGION] < EDGE_INK * BLANK_INK ? OPEN_SKY : BLANK
  }
  paletteAt(style.edge, shade, glyph)
  return best
}

const momentAt = (sky: Sky, seconds: number, theme: SkyTheme): void => {
  const style = THEMES[theme]
  Object.assign(sky.now, {
    seconds,
    style,
    map: sky.still.rgb[theme],
    clouds: style.clouds ? sky.cloudsOf[theme]() : undefined,
    nearShift: drift(seconds, WIND.near, 0),
    farShift: drift(seconds, WIND.far, FAR_LAG),
  })
}

export const skyCells = ({
  still,
  shapes,
  near,
  far,
}: {
  still: StillSky
  near: CloudLayer
  far: CloudLayer
  shapes: Float32Array
}): SkyCells => {
  const { columns, rows } = still
  const written = still.text.split("\n")
  const lines = range(rows).map((r) => written[r] ?? "")
  const cloudsFor = (style: ThemeStyle): (() => Clouds) =>
    once(() => findClouds(near, far, style.smallestCloud))
  const sky: Sky = {
    still,
    shapes,
    near,
    far,
    density: Float32Array.from({ length: columns * rows }, (_, i) => {
      const c = i % columns
      const glyph = lines[(i - c) / columns][c]
      return glyph === undefined
        ? 0
        : Math.max(0, SKY_RAMP.indexOf(glyph)) / (SKY_RAMP.length - 1)
    }),
    cloudsOf: {
      light: cloudsFor(THEMES.light),
      dark: cloudsFor(THEMES.dark),
      sunset: cloudsFor(THEMES.sunset),
    },
    now: {
      seconds: 0,
      style: THEMES.light,
      map: still.rgb.light,
      clouds: undefined,
      nearShift: 0,
      farShift: 0,
    },
  }
  const cellAt = (
    left: number,
    top: number,
    width: number,
    height: number,
    look: Look,
    index: number,
    shown: number,
    pushX: number,
    pushY: number
  ): number =>
    cellOf(sky, left, top, width, height, look, index, shown, pushX, pushY)
  return {
    at: (seconds: number, theme: SkyTheme): CellAt => {
      momentAt(sky, seconds, theme)
      return cellAt
    },
    indexAt: (x: number, y: number) => stillIndex(still, x, y),
  }
}

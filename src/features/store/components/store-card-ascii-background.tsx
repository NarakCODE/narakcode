"use client"

import { useEffect, useRef } from "react"

const ASCII_CFG = {
  ramp: " .·:+*#",
  cellSize: 12,
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: "400",
  brightness: 0,
  contrast: 6,
  gamma: 1,
  saturation: 85,
  bgColor: "#081022",
  centerFade: 10,
} as const

const ASCII_SRC_URL =
  "data:image/jpeg;base64,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"

let sharedImagePromise: Promise<HTMLImageElement> | null = null

function loadSharedAsciiImage(): Promise<HTMLImageElement> {
  if (!sharedImagePromise) {
    sharedImagePromise = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = ASCII_SRC_URL
    })
  }
  return sharedImagePromise
}

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v
}

function smoothstep(e0: number, e1: number, x: number) {
  const k = clamp((x - e0) / (e1 - e0), 0, 1)
  return k * k * (3 - 2 * k)
}

export function StoreCardAsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const sample = document.createElement("canvas")
    const sctx = sample.getContext("2d", { willReadFrequently: true })
    if (!sctx) return

    let disposed = false
    let img: HTMLImageElement | null = null

    function render() {
      if (!img || !img.width || !canvas || !ctx || !sctx) return
      const rect = canvas.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      if (w <= 0 || h <= 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${ASCII_CFG.fontWeight} ${ASCII_CFG.cellSize}px ${ASCII_CFG.fontFamily}`
      ctx.textBaseline = "top"

      const cw = Math.max(
        4,
        ctx.measureText("M").width || ASCII_CFG.cellSize * 0.6
      )
      const ch = ASCII_CFG.cellSize
      const cols = Math.max(8, Math.ceil(w / cw))
      const rows = Math.max(6, Math.ceil(h / ch))
      const ox = (w - cols * cw) * 0.5
      const oy = (h - rows * ch) * 0.5

      sample.width = cols
      sample.height = rows
      sctx.fillStyle = "#000"
      sctx.fillRect(0, 0, cols, rows)

      const ta = (cols * cw) / (rows * ch)
      const sa = img.width / img.height
      let dx = 0
      let dy = 0
      let dw = cols
      let dh = rows
      if (sa > ta) {
        dw = (rows * ch * sa) / cw
        dx = (cols - dw) * 0.5
      } else {
        dh = (cols * cw) / (sa * ch)
        dy = (rows - dh) * 0.5
      }

      sctx.drawImage(img, dx, dy, dw, dh)
      const px = sctx.getImageData(0, 0, cols, rows).data

      const bOff = ASCII_CFG.brightness / 100
      const cFac =
        (259 * (ASCII_CFG.contrast * 2.55 + 255)) /
        (255 * (259 - ASCII_CFG.contrast * 2.55))
      const iGam = 1 / Math.max(0.1, ASCII_CFG.gamma)
      const sat = ASCII_CFG.saturation / 100
      const ramp = ASCII_CFG.ramp
      const lastIdx = ramp.length - 1
      const cf = (ASCII_CFG.centerFade / 100) * 0.88

      ctx.fillStyle = ASCII_CFG.bgColor
      ctx.fillRect(0, 0, w, h)

      for (let r = 0; r < rows; r++) {
        const y = oy + r * ch
        const cy = ((r + 0.5) / rows - 0.5) * 2
        for (let c = 0; c < cols; c++) {
          const p = (r * cols + c) * 4
          const y709 =
            (0.2126 * px[p] + 0.7152 * px[p + 1] + 0.0722 * px[p + 2]) / 255
          const l = Math.pow(
            clamp((y709 + bOff - 0.5) * cFac + 0.5, 0, 1),
            iGam
          )
          const chGlyph = ramp[Math.round(l * lastIdx)]
          if (!chGlyph || chGlyph === " ") continue

          const gr = y709 * 255
          const red = Math.round(
            clamp(
              (((gr + (px[p] - gr) * sat) / 255 + bOff - 0.5) * cFac + 0.5) *
                255,
              0,
              255
            )
          )
          const green = Math.round(
            clamp(
              (((gr + (px[p + 1] - gr) * sat) / 255 + bOff - 0.5) * cFac +
                0.5) *
                255,
              0,
              255
            )
          )
          const blue = Math.round(
            clamp(
              (((gr + (px[p + 2] - gr) * sat) / 255 + bOff - 0.5) * cFac +
                0.5) *
                255,
              0,
              255
            )
          )

          const cx = ((c + 0.5) / cols - 0.5) * 1.65
          const mask = smoothstep(0.12, 0.95, Math.sqrt(cx * cx + cy * cy))
          const fade = cf > 0 ? 1 - cf * (1 - mask) : 1

          ctx.fillStyle = `rgb(${red},${green},${blue})`
          ctx.globalAlpha = fade
          ctx.fillText(chGlyph, ox + c * cw, y)
        }
      }
      ctx.globalAlpha = 1
    }

    const ro = new ResizeObserver(() => {
      render()
    })
    ro.observe(canvas)

    loadSharedAsciiImage()
      .then((loaded) => {
        if (disposed) return
        img = loaded
        render()
      })
      .catch(() => undefined)

    return () => {
      disposed = true
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none block size-full select-none"
    />
  )
}

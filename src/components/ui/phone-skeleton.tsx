import * as React from "react"

import { cn } from "@/lib/utils"

// iPhone 18 Pro Max geometry in mm: body 78.0 x 163.4 mm, 6.9" display 2868 x 1320 px @ 460 ppi
const DEFAULT_PAPER = "#EEF1F3"
const DEFAULT_INK = "#14303F"
const DEFAULT_GUIDE = "#8DA3B1"

const W = 78
const H = 163.4
const BODY_R = 11.6
const RIM = 0.9
const SW = (1320 / 460) * 25.4
const SH = (2868 / 460) * 25.4
const SX = (W - SW) / 2
const SY = (H - SH) / 2
const SCREEN_R = 9.2

// Logical iOS viewport in points for scaled children
const PT_W = 440
const PT_H = 956

const ISLAND = {
  mini: { w: 13.49, h: 5.0, top: 1.9 },
  classic: { w: 20.76, h: 6.1, top: 1.9 },
} as const

const BUTTONS = [
  { side: "left", y: 29, h: 6 },
  { side: "left", y: 43, h: 12 },
  { side: "left", y: 59, h: 12 },
  { side: "right", y: 61, h: 22 },
  { side: "right", y: 108, h: 13 },
] as const

const PAD = 4
const FILL_PAD = 1.6
const BOTTOM_CROP_MM = 58
const STROKE_PROPS = {
  fill: "none",
  vectorEffect: "non-scaling-stroke",
} as const

export interface PhoneSkeletonProps {
  /** Pixels per millimeter scale factor. */
  scale?: number
  /** Dynamic Island width preset. */
  island?: keyof typeof ISLAND
  /** Display the full device frame or crop to the bottom section. */
  crop?: "full" | "bottom"
  /** Automatically scale the frame to fill its parent container width and height. */
  fillContainer?: boolean
  /** Screen background fill color. */
  paper?: string
  /** Blueprint outline stroke color. */
  ink?: string
  /** Hatched bezel guide stroke color. */
  guide?: string
  className?: string
  children?: React.ReactNode
}

/**
 * Architectural wireframe skeleton frame of an iPhone 18 Pro Max with a scaled
 * logical 440 x 956 iOS viewport for embedded UI previews.
 */
export function PhoneSkeleton({
  scale = 4,
  island = "mini",
  crop = "full",
  fillContainer = false,
  paper = DEFAULT_PAPER,
  ink = DEFAULT_INK,
  guide = DEFAULT_GUIDE,
  className,
  children,
}: PhoneSkeletonProps) {
  const hatchId = React.useId()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)

  React.useEffect(() => {
    if (!fillContainer) {
      return
    }

    const el = containerRef.current
    if (!el) {
      return
    }

    const updateWidth = () => {
      const nextWidth = el.getBoundingClientRect().width
      if (nextWidth > 0) {
        setContainerWidth(nextWidth)
      }
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)

    return () => observer.disconnect()
  }, [fillContainer])

  const pad = fillContainer ? FILL_PAD : PAD
  const activeScale =
    fillContainer && containerWidth > 0 ? containerWidth / (W + pad * 2) : scale

  const isl = ISLAND[island]
  const ix = W / 2 - isl.w / 2
  const iy = SY + isl.top
  const k = (SW * activeScale) / PT_W

  const fullWidth = (W + pad * 2) * activeScale
  const fullHeight = (H + pad * 2) * activeScale
  const isBottomCrop = crop === "bottom"
  const visibleHeight = isBottomCrop ? BOTTOM_CROP_MM * activeScale : fullHeight

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden select-none",
        fillContainer ? "h-full w-full" : "shrink-0",
        isBottomCrop &&
          "mask-[linear-gradient(to_bottom,transparent_0%,black_22%)]",
        className
      )}
      style={
        fillContainer
          ? { minHeight: visibleHeight }
          : { width: fullWidth, height: visibleHeight }
      }
    >
      <div
        className="absolute bottom-0 left-0"
        style={{ width: fullWidth, height: fullHeight }}
      >
        <svg
          role="img"
          aria-label="iPhone 18 Pro Max skeleton frame"
          className="absolute inset-0 h-full w-full"
          viewBox={`${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`}
        >
          <defs>
            <pattern
              id={hatchId}
              width="1.4"
              height="1.4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="1.4"
                stroke={guide}
                strokeOpacity="0.6"
                strokeWidth="0.12"
              />
            </pattern>
          </defs>

          <rect
            x="0"
            y="0"
            width={W}
            height={H}
            rx={BODY_R}
            fill={`url(#${hatchId})`}
          />
          <rect
            x={SX}
            y={SY}
            width={SW}
            height={SH}
            rx={SCREEN_R}
            fill={paper}
          />
          <rect
            x="0"
            y="0"
            width={W}
            height={H}
            rx={BODY_R}
            {...STROKE_PROPS}
            stroke={ink}
            strokeOpacity="0.75"
            strokeWidth="1.5"
          />
          <rect
            x={RIM}
            y={RIM}
            width={W - RIM * 2}
            height={H - RIM * 2}
            rx={BODY_R - RIM}
            {...STROKE_PROPS}
            stroke={ink}
            strokeOpacity="0.55"
            strokeWidth="0.75"
          />
          <rect
            x={SX}
            y={SY}
            width={SW}
            height={SH}
            rx={SCREEN_R}
            {...STROKE_PROPS}
            stroke={ink}
            strokeOpacity="0.65"
            strokeWidth="1"
          />

          <rect
            x={ix}
            y={iy}
            width={isl.w}
            height={isl.h}
            rx={isl.h / 2}
            {...STROKE_PROPS}
            stroke={ink}
            strokeOpacity="0.65"
            strokeWidth="1"
          />

          {BUTTONS.map((b, i) => (
            <rect
              key={i}
              x={b.side === "left" ? -0.8 : W}
              y={b.y}
              width="0.8"
              height={b.h}
              rx="0.4"
              {...STROKE_PROPS}
              stroke={ink}
              strokeOpacity="0.65"
              strokeWidth="1"
            />
          ))}
        </svg>

        {children && (
          <div
            className="absolute overflow-hidden"
            style={{
              left: (pad + SX) * activeScale,
              top: (pad + SY) * activeScale,
              width: SW * activeScale,
              height: SH * activeScale,
              borderRadius: SCREEN_R * activeScale,
            }}
          >
            <div
              style={{
                width: PT_W,
                height: PT_H,
                transform: `scale(${k})`,
                transformOrigin: "0 0",
              }}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

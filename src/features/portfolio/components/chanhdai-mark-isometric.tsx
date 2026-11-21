"use client"

import { useEffect, useId, useRef } from "react"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { metalClickSound } from "@/lib/soundcn/metal-click"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

// The N's top corner: the vertex whose 30° wedge to the horizontal is clear.
const ISOMETRIC_ANGLE = Math.PI / 6
const ANGLE_RADIUS = 116
const ANGLE_VERTEX = { x: 333.05, y: 0.58 }
const ANGLE_START = { x: ANGLE_VERTEX.x + ANGLE_RADIUS, y: ANGLE_VERTEX.y }
const ANGLE_END = {
  x: ANGLE_VERTEX.x + ANGLE_RADIUS * Math.cos(ISOMETRIC_ANGLE),
  y: ANGLE_VERTEX.y + ANGLE_RADIUS * Math.sin(ISOMETRIC_ANGLE),
}
const ANGLE_LABEL = {
  x: ANGLE_VERTEX.x + (ANGLE_RADIUS + 24) * Math.cos(ISOMETRIC_ANGLE / 2),
  y: ANGLE_VERTEX.y + (ANGLE_RADIUS + 24) * Math.sin(ISOMETRIC_ANGLE / 2),
}
// Tip at the origin, pointing left, so each use only translates and rotates.
const ANGLE_ARROW = "M0 0 10.5-3.8v7.6Z"

/**
 * An isometric SVG mark combining letters N and C, whose outline is traced by a
 * gradient highlight that follows the cursor. Pressing the mark morphs the 3D
 * walls with a spring effect and plays a tactile click sound.
 */
export function ChanhDaiMarkIsometric({ className }: { className?: string }) {
  const id = useId()
  const ids = {
    facePattern: `chanhdai-face-pattern-${id}`,
    faceFill: `chanhdai-face-fill-${id}`,
    radialGradient: `chanhdai-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [166, 944]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className={cn(
        "h-auto w-full touch-manipulation overflow-visible [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]",
        className
      )}
      viewBox="166 0 778 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.g
          id={ids.faceFill}
          variants={{
            normal: { y: 0 },
            pressed: { y: 16 },
          }}
          transition={transition}
        >
          <path d="M166.78 96.58 L388.48 224.58 L443.90 192.58 L277.63 96.58 L499.33 160.58 L554.76 128.58 L333.05 0.58 L277.63 32.58 L443.90 128.58 L222.20 64.58 Z" />
          <g transform="translate(610, 0)">
            <path d="M166.78 160.58L55.93 224.58L0.50 192.58L111.35 128.58L166.78 160.58Z" />
            <path d="M166.78 288.58L111.35 320.58L0.50 256.58L55.93 224.58L166.78 288.58Z" />
            <path d="M333.05 256.58L222.20 320.58L166.78 288.58L277.63 224.58L333.05 256.58Z" />
          </g>
        </motion.g>

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="280"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      <g className="stroke-line" strokeWidth="1.25" strokeDasharray="5 2.5">
        <path d="M-1500 1346.90L2500 -962.51" />
        <path d="M-1500 -833.74L2500 1475.67" />
        <path d="M-1500 -1057.73L2500 1251.67" />
      </g>

      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        <motion.path
          variants={{
            normal: {
              d: "M166.78 96.58L388.48 224.58L443.90 192.58V224.58L388.48 256.58L166.78 128.58Z",
            },
            pressed: {
              d: "M166.78 112.58L388.48 240.58L443.90 208.58V224.58L388.48 256.58L166.78 128.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: {
              d: "M277.63 96.58L499.33 160.58L554.76 128.58V160.58L499.33 192.58L277.63 128.58Z",
            },
            pressed: {
              d: "M277.63 112.58L499.33 176.58L554.76 144.58V160.58L499.33 192.58L277.63 128.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: { d: "M277.63 32.58L443.90 128.58V160.58L277.63 64.58Z" },
            pressed: { d: "M277.63 48.58L443.90 144.58V160.58L277.63 64.58Z" },
          }}
          transition={transition}
        />
        <g transform="translate(610, 0)">
          <motion.path
            variants={{
              normal: {
                d: "M166.78 160.58L55.93 224.58L0.50 192.58V224.58L55.93 256.58L166.78 192.58V160.58Z",
              },
              pressed: {
                d: "M166.78 176.58L55.93 240.58L0.50 208.58V224.58L55.93 256.58L166.78 192.58V176.58Z",
              },
            }}
            transition={transition}
          />
          <motion.path
            variants={{
              normal: {
                d: "M166.78 288.58L111.35 320.58L0.50 256.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V256.58L222.20 320.58L166.78 288.58Z",
              },
              pressed: {
                d: "M166.78 304.58L111.35 336.58L0.50 272.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V272.58L222.20 336.58L166.78 304.58Z",
              },
            }}
            transition={transition}
          />
        </g>
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <motion.path
        variants={{
          normal: {
            d:
              "M166.78 96.58 L388.48 224.58 L443.90 192.58 L277.63 96.58 L499.33 160.58 L554.76 128.58 L333.05 0.58 L277.63 32.58 L443.90 128.58 L222.20 64.58 Z" +
              " M166.78 96.58 V128.58 M388.48 224.58 V256.58 M443.90 192.58 V224.58 M277.63 96.58 V128.58 M499.33 160.58 V192.58 M554.76 128.58 V160.58 M277.63 32.58 V64.58 M443.90 128.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
          pressed: {
            d:
              "M166.78 112.58 L388.48 240.58 L443.90 208.58 L277.63 112.58 L499.33 176.58 L554.76 144.58 L333.05 16.58 L277.63 48.58 L443.90 144.58 L222.20 80.58 Z" +
              " M166.78 112.58 V128.58 M388.48 240.58 V256.58 M443.90 208.58 V224.58 M277.63 112.58 V128.58 M499.33 176.58 V192.58 M554.76 144.58 V160.58 M277.63 48.58 V64.58 M443.90 144.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
        }}
        transition={transition}
        stroke="var(--stroke)"
      />

      <motion.path
        variants={{
          normal: {
            d:
              "M166.78 96.58 L388.48 224.58 L443.90 192.58 L277.63 96.58 L499.33 160.58 L554.76 128.58 L333.05 0.58 L277.63 32.58 L443.90 128.58 L222.20 64.58 Z" +
              " M166.78 96.58 V128.58 M388.48 224.58 V256.58 M443.90 192.58 V224.58 M277.63 96.58 V128.58 M499.33 160.58 V192.58 M554.76 128.58 V160.58 M277.63 32.58 V64.58 M443.90 128.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
          pressed: {
            d:
              "M166.78 112.58 L388.48 240.58 L443.90 208.58 L277.63 112.58 L499.33 176.58 L554.76 144.58 L333.05 16.58 L277.63 48.58 L443.90 144.58 L222.20 80.58 Z" +
              " M166.78 112.58 V128.58 M388.48 240.58 V256.58 M443.90 208.58 V224.58 M277.63 112.58 V128.58 M499.33 176.58 V192.58 M554.76 144.58 V160.58 M277.63 48.58 V64.58 M443.90 144.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
        }}
        transition={transition}
        stroke={`url(#${ids.radialGradient})`}
      />

      <g transform="translate(610, 0)">
        <motion.path
          variants={{
            normal: {
              d:
                "M28.21 240.58 L0.50 224.58 V192.58 L111.35 128.58 L166.78 160.58 V192.58 L83.64 240.58" +
                " M166.78 160.58 L0.50 256.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V256.58 L277.63 224.58 L166.78 288.58 L0.50 192.58" +
                " M0.50 256.58 L111.35 320.58 L166.78 288.58 L222.20 320.58 L333.05 256.58" +
                " M111.35 320.58 V352.58 M166.78 288.58 V320.58 M222.20 320.58 V352.58",
            },
            pressed: {
              d:
                "M42.07 248.58 L0.50 224.58 V208.58 L111.35 144.58 L166.78 176.58 V192.58 L69.78 248.58" +
                " M166.78 176.58 L0.5 272.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V272.58 L277.63 240.58 L166.78 304.58 L0.5 208.58" +
                " M0.5 272.58 L111.35 336.58 L166.78 304.58 L222.20 336.58 L333.05 272.58" +
                " M111.35 336.58 V352.58 M166.78 304.58 V320.58 M222.20 336.58 V352.58",
            },
          }}
          transition={transition}
          stroke="var(--stroke)"
        />

        <motion.path
          variants={{
            normal: {
              d:
                "M28.21 240.58 L0.50 224.58 V192.58 L111.35 128.58 L166.78 160.58 V192.58 L83.64 240.58" +
                " M166.78 160.58 L0.50 256.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V256.58 L277.63 224.58 L166.78 288.58 L0.50 192.58" +
                " M0.50 256.58 L111.35 320.58 L166.78 288.58 L222.20 320.58 L333.05 256.58" +
                " M111.35 320.58 V352.58 M166.78 288.58 V320.58 M222.20 320.58 V352.58",
            },
            pressed: {
              d:
                "M42.07 248.58 L0.50 224.58 V208.58 L111.35 144.58 L166.78 176.58 V192.58 L69.78 248.58" +
                " M166.78 176.58 L0.5 272.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V272.58 L277.63 240.58 L166.78 304.58 L0.5 208.58" +
                " M0.5 272.58 L111.35 336.58 L166.78 304.58 L222.20 336.58 L333.05 272.58" +
                " M111.35 336.58 V352.58 M166.78 304.58 V320.58 M222.20 336.58 V352.58",
            },
          }}
          transition={transition}
          stroke={`url(#${ids.radialGradient})`}
        />
      </g>

      {/* Unreadable below sm. Measures the 30° isometric angle at N's top vertex. */}
      <g
        className="pointer-events-none text-dimension max-sm:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      >
        {/* A reference line, not an extension line, so no gap at the vertex. */}
        <path
          d={`M${ANGLE_VERTEX.x} ${ANGLE_VERTEX.y}H${ANGLE_START.x + 16}`}
        />
        <path
          d={`M${ANGLE_START.x} ${ANGLE_START.y}A${ANGLE_RADIUS} ${ANGLE_RADIUS} 0 0 1 ${ANGLE_END.x} ${ANGLE_END.y}`}
        />
        {/* Filled so the arc stops at each arrow's base. */}
        <path
          className="fill-background"
          d={ANGLE_ARROW}
          transform={`translate(${ANGLE_START.x} ${ANGLE_START.y}) rotate(90)`}
        />
        <path
          className="fill-background"
          d={ANGLE_ARROW}
          transform={`translate(${ANGLE_END.x} ${ANGLE_END.y}) rotate(-60)`}
        />
        <text
          className="fill-dimension-foreground font-mono select-none"
          x={ANGLE_LABEL.x}
          y={ANGLE_LABEL.y}
          stroke="none"
          fontSize="16"
          textAnchor="middle"
          dominantBaseline="central"
        >
          30°
        </text>
      </g>
    </motion.svg>
  )
}

/**
 * An isometric letter N SVG mark with a cursor-tracking gradient highlight
 * and a springy press effect.
 */
export function IsometricLetterN() {
  const id = useId()
  const ids = {
    facePattern: `letter-n-face-pattern-${id}`,
    faceFill: `letter-n-face-fill-${id}`,
    radialGradient: `letter-n-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), {
    stiffness: 150,
    damping: 25,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 150,
    damping: 25,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full touch-manipulation [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.g
          id={ids.faceFill}
          variants={{
            normal: { y: 0 },
            pressed: { y: 16 },
          }}
          transition={transition}
        >
          <path d="M166.78 96.58 L388.48 224.58 L443.90 192.58 L277.63 96.58 L499.33 160.58 L554.76 128.58 L333.05 0.58 L277.63 32.58 L443.90 128.58 L222.20 64.58 Z" />
        </motion.g>

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      <g className="stroke-line" strokeWidth="1" strokeDasharray="4 2">
        <path d="M-477.55 756.57L1254.51 -243.41" />
        <path d="M977.37 788.58L-754.67 -211.42" />
        <path d="M1143.65 692.58L-588.39 -307.42" />
      </g>

      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        <motion.path
          variants={{
            normal: {
              d: "M166.78 96.58L388.48 224.58L443.90 192.58V224.58L388.48 256.58L166.78 128.58Z",
            },
            pressed: {
              d: "M166.78 112.58L388.48 240.58L443.90 208.58V224.58L388.48 256.58L166.78 128.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: {
              d: "M277.63 96.58L499.33 160.58L554.76 128.58V160.58L499.33 192.58L277.63 128.58Z",
            },
            pressed: {
              d: "M277.63 112.58L499.33 176.58L554.76 144.58V160.58L499.33 192.58L277.63 128.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: { d: "M277.63 32.58L443.90 128.58V160.58L277.63 64.58Z" },
            pressed: { d: "M277.63 48.58L443.90 144.58V160.58L277.63 64.58Z" },
          }}
          transition={transition}
        />
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <motion.path
        variants={{
          normal: {
            d:
              "M166.78 96.58 L388.48 224.58 L443.90 192.58 L277.63 96.58 L499.33 160.58 L554.76 128.58 L333.05 0.58 L277.63 32.58 L443.90 128.58 L222.20 64.58 Z" +
              " M166.78 96.58 V128.58 M388.48 224.58 V256.58 M443.90 192.58 V224.58 M277.63 96.58 V128.58 M499.33 160.58 V192.58 M554.76 128.58 V160.58 M277.63 32.58 V64.58 M443.90 128.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
          pressed: {
            d:
              "M166.78 112.58 L388.48 240.58 L443.90 208.58 L277.63 112.58 L499.33 176.58 L554.76 144.58 L333.05 16.58 L277.63 48.58 L443.90 144.58 L222.20 80.58 Z" +
              " M166.78 112.58 V128.58 M388.48 240.58 V256.58 M443.90 208.58 V224.58 M277.63 112.58 V128.58 M499.33 176.58 V192.58 M554.76 144.58 V160.58 M277.63 48.58 V64.58 M443.90 144.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
        }}
        transition={transition}
        stroke="var(--stroke)"
      />

      <motion.path
        variants={{
          normal: {
            d:
              "M166.78 96.58 L388.48 224.58 L443.90 192.58 L277.63 96.58 L499.33 160.58 L554.76 128.58 L333.05 0.58 L277.63 32.58 L443.90 128.58 L222.20 64.58 Z" +
              " M166.78 96.58 V128.58 M388.48 224.58 V256.58 M443.90 192.58 V224.58 M277.63 96.58 V128.58 M499.33 160.58 V192.58 M554.76 128.58 V160.58 M277.63 32.58 V64.58 M443.90 128.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
          pressed: {
            d:
              "M166.78 112.58 L388.48 240.58 L443.90 208.58 L277.63 112.58 L499.33 176.58 L554.76 144.58 L333.05 16.58 L277.63 48.58 L443.90 144.58 L222.20 80.58 Z" +
              " M166.78 112.58 V128.58 M388.48 240.58 V256.58 M443.90 208.58 V224.58 M277.63 112.58 V128.58 M499.33 176.58 V192.58 M554.76 144.58 V160.58 M277.63 48.58 V64.58 M443.90 144.58 V160.58" +
              " M166.78 128.58 L388.48 256.58 L443.90 224.58 M277.63 128.58 L499.33 192.58 L554.76 160.58 M277.63 64.58 L443.90 160.58",
          },
        }}
        transition={transition}
        stroke={`url(#${ids.radialGradient})`}
      />
    </motion.svg>
  )
}

/**
 * An isometric letter C SVG mark with a cursor-tracking gradient highlight
 * and a springy press effect.
 */
export function IsometricLetterC() {
  const id = useId()
  const ids = {
    facePattern: `letter-c-face-pattern-${id}`,
    faceFill: `letter-c-face-fill-${id}`,
    radialGradient: `letter-c-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), {
    stiffness: 150,
    damping: 25,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 150,
    damping: 25,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full touch-manipulation [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.g
          id={ids.faceFill}
          variants={{
            normal: { y: 0 },
            pressed: { y: 16 },
          }}
          transition={transition}
        >
          <path d="M166.78 160.58L55.93 224.58L0.50 192.58L111.35 128.58L166.78 160.58Z" />
          <path d="M166.78 288.58L111.35 320.58L0.50 256.58L55.93 224.58L166.78 288.58Z" />
          <path d="M333.05 256.58L222.20 320.58L166.78 288.58L277.63 224.58L333.05 256.58Z" />
        </motion.g>

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      <g className="stroke-line" strokeWidth="1" strokeDasharray="4 2">
        <path d="M-477.55 756.57L1254.51 -243.41" />
        <path d="M977.37 788.58L-754.67 -211.42" />
        <path d="M1143.65 692.58L-588.39 -307.42" />
      </g>

      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        <motion.path
          variants={{
            normal: {
              d: "M166.78 160.58L55.93 224.58L0.50 192.58V224.58L55.93 256.58L166.78 192.58V160.58Z",
            },
            pressed: {
              d: "M166.78 176.58L55.93 240.58L0.50 208.58V224.58L55.93 256.58L166.78 192.58V176.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: {
              d: "M166.78 288.58L111.35 320.58L0.50 256.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V256.58L222.20 320.58L166.78 288.58Z",
            },
            pressed: {
              d: "M166.78 304.58L111.35 336.58L0.50 272.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V272.58L222.20 336.58L166.78 304.58Z",
            },
          }}
          transition={transition}
        />
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <motion.path
        variants={{
          normal: {
            d:
              "M28.21 240.58 L0.50 224.58 V192.58 L111.35 128.58 L166.78 160.58 V192.58 L83.64 240.58" +
              " M166.78 160.58 L0.50 256.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V256.58 L277.63 224.58 L166.78 288.58 L0.50 192.58" +
              " M0.50 256.58 L111.35 320.58 L166.78 288.58 L222.20 320.58 L333.05 256.58" +
              " M111.35 320.58 V352.58 M166.78 288.58 V320.58 M222.20 320.58 V352.58",
          },
          pressed: {
            d:
              "M42.07 248.58 L0.50 224.58 V208.58 L111.35 144.58 L166.78 176.58 V192.58 L69.78 248.58" +
              " M166.78 176.58 L0.5 272.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V272.58 L277.63 240.58 L166.78 304.58 L0.5 208.58" +
              " M0.5 272.58 L111.35 336.58 L166.78 304.58 L222.20 336.58 L333.05 272.58" +
              " M111.35 336.58 V352.58 M166.78 304.58 V320.58 M222.20 336.58 V352.58",
          },
        }}
        transition={transition}
        stroke="var(--stroke)"
      />

      <motion.path
        variants={{
          normal: {
            d:
              "M28.21 240.58 L0.50 224.58 V192.58 L111.35 128.58 L166.78 160.58 V192.58 L83.64 240.58" +
              " M166.78 160.58 L0.50 256.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V256.58 L277.63 224.58 L166.78 288.58 L0.50 192.58" +
              " M0.50 256.58 L111.35 320.58 L166.78 288.58 L222.20 320.58 L333.05 256.58" +
              " M111.35 320.58 V352.58 M166.78 288.58 V320.58 M222.20 320.58 V352.58",
          },
          pressed: {
            d:
              "M42.07 248.58 L0.50 224.58 V208.58 L111.35 144.58 L166.78 176.58 V192.58 L69.78 248.58" +
              " M166.78 176.58 L0.5 272.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V272.58 L277.63 240.58 L166.78 304.58 L0.5 208.58" +
              " M0.5 272.58 L111.35 336.58 L166.78 304.58 L222.20 336.58 L333.05 272.58" +
              " M111.35 336.58 V352.58 M166.78 304.58 V320.58 M222.20 336.58 V352.58",
          },
        }}
        transition={transition}
        stroke={`url(#${ids.radialGradient})`}
      />
    </motion.svg>
  )
}

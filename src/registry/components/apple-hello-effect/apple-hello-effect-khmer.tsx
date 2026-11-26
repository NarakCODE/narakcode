"use client"

import type { ComponentProps } from "react"
import type { TargetAndTransition } from "motion/react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const initialProps: TargetAndTransition = {
  pathLength: 0,
  opacity: 0,
}

const animateProps: TargetAndTransition = {
  pathLength: 1,
  opacity: 1,
}

export type AppleHelloEffectProps = Omit<
  ComponentProps<typeof motion.svg>,
  "durationScale" | "onAnimationComplete"
> & {
  /**
   * Scales the duration and delay of the handwriting animation.
   * Values below 1 speed up, values above 1 slow down.
   * @defaultValue 1
   */
  durationScale?: number
  /** Called when the full handwriting animation completes. */
  onAnimationComplete?: () => void
}

export function AppleHelloEffectKhmer({
  className,
  durationScale = 1,
  onAnimationComplete,
  ...props
}: AppleHelloEffectProps) {
  const calc = (x: number) => x * durationScale

  return (
    <motion.svg
      className={cn("h-20", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 264"
      fill="none"
      stroke="currentColor"
      strokeWidth="13.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <title>សួស្តី</title>

      <motion.path
        d="M 43 147 C 49 145 53 150 52 157 C 50 167 40 175 28 175 C 24 175 22 171 22 163 L 22 129 C 22 105 38 93 56 93 C 74 93 84 106 84 129 L 84 147 C 84 167 96 178 115 178 C 134 178 146 167 146 147 L 146 109 C 146 102 134 97 126 92 C 133 84 144 67 151 67 C 157 67 161 76 167 76"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.95),
          ease: "easeInOut",
          opacity: { duration: 0.2 },
        }}
      />

      <motion.path
        d="M 24 91 C 34 79 46 63 55 63 C 63 63 69 74 78 74 C 83 74 86 71 89 68"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.3),
          ease: "easeOut",
          delay: calc(0.9),
          opacity: { duration: 0.15, delay: calc(0.9) },
        }}
      />

      <motion.path
        d="M 93 205 C 99 203 102 208 100 217 C 98 227 92 238 83 241 C 92 248 107 246 117 233 C 121 227 123 222 125 218 C 123 228 124 240 133 244 C 143 248 154 236 155 220 C 155 211 152 205 146 204"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.55),
          ease: "easeInOut",
          delay: calc(1.2),
          opacity: { duration: 0.2, delay: calc(1.2) },
        }}
      />

      <motion.path
        d="M 215 147 C 221 145 225 150 224 157 C 222 167 212 175 200 175 C 196 175 194 171 194 163 L 194 129 C 194 105 210 93 228 93 C 246 93 256 106 256 129 L 256 147 C 256 167 268 178 287 178 C 306 178 318 167 318 147 L 318 109 C 318 102 306 97 298 92 C 305 84 316 67 323 67 C 329 67 333 76 339 76"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.95),
          ease: "easeInOut",
          delay: calc(1.75),
          opacity: { duration: 0.2, delay: calc(1.75) },
        }}
      />

      <motion.path
        d="M 196 91 C 206 79 218 63 227 63 C 235 63 241 74 250 74 C 255 74 258 71 261 68"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.3),
          ease: "easeOut",
          delay: calc(2.65),
          opacity: { duration: 0.15, delay: calc(2.65) },
        }}
      />

      <motion.path
        d="M 269 233 C 275 231 278 236 277 241 C 275 247 265 250 256 249 L 256 222 C 256 205 269 197 285 197 C 301 197 313 205 313 222 L 313 249"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.45),
          ease: "easeInOut",
          delay: calc(2.95),
          opacity: { duration: 0.2, delay: calc(2.95) },
        }}
      />

      <motion.path
        d="M 307 49 C 300 34 287 26 271 26 C 255 26 244 35 244 46 C 244 51 248 53 256 53 L 309 53 C 311 40 315 24 313 13 C 312 11 309 10 307 11"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.5),
          ease: "easeOut",
          delay: calc(3.4),
          opacity: { duration: 0.2, delay: calc(3.4) },
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  )
}

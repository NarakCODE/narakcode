import { GeistPixelSquare } from "geist/font/pixel"
import { GeistSans } from "geist/font/sans"
import { JetBrains_Mono } from "next/font/google"
import localFont from "next/font/local"

import { cn } from "@/lib/utils"

const fontSans = GeistSans

const fontMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
})

const fontSerif = localFont({
  src: "../assets/fonts/charter_regular.woff2",
  weight: "400",
  fallback: ["Georgia", "serif"],
  variable: "--font-serif",
})

// const fontPixel = localFont({
//   src: "../assets/fonts/DepartureMono-Regular.woff2",
//   weight: "400",
//   fallback: ["monospace"],
//   variable: "--font-pixel",
// })

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontSerif.variable,
  GeistPixelSquare.variable,
  "[--font-sans:var(--font-geist-sans)]"
)

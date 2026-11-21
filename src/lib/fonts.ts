import localFont from "next/font/local"
import { GeistMono } from "geist/font/mono"
import { GeistSerif } from "geist/font/serif"

import { cn } from "@/lib/utils"

const fontSans = localFont({
  src: "../assets/fonts/GeistRounded.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  variable: "--font-sans",
})

const fontMono = GeistMono

const fontSerif = GeistSerif

// Only the iPod uses it, so it loads on demand instead of on every page.
const fontChicagoKare = localFont({
  src: "../assets/fonts/ChicagoKare-Regular.woff2",
  weight: "400",
  display: "block",
  preload: false,
  variable: "--font-chicago-kare",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontSerif.variable,
  fontChicagoKare.variable,
  "[--font-mono:var(--font-geist-mono)]",
  "[--font-serif:var(--font-geist-serif)]"
)

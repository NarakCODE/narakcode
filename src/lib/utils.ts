import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const TYPOGRAPHY_TOKENS = [
  "text-title-regular",
  "text-title-small-regular",
  "text-title-small-medium",
  "text-title-small-semibold",
  "text-title-mini-regular",
  "text-title-mini-medium",
  "text-title-mini-semibold",
  "text-body-regular",
  "text-body-regular-medium",
  "text-body-regular-semibold",
  "text-body-regular-spaced",
  "text-body-small-regular",
  "text-body-small-medium",
  "text-body-small-semibold",
  "text-body-small-spaced",
  "text-body-mini-regular",
  "text-body-mini-medium",
  "text-body-micro-regular",
  "text-body-micro-medium",
  "text-paragraph-regular",
  "text-paragraph-small",
  "text-paragraph-small-relaxed",
] as const

const twMerge = extendTailwindMerge<"typography">({
  extend: {
    classGroups: {
      typography: [...TYPOGRAPHY_TOKENS],
    },
    conflictingClassGroups: {
      typography: ["font-size", "leading", "font-weight", "tracking"],
      "font-size": ["typography"],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

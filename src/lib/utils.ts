import type { ClassValue } from "cnfast"
import { clsx, twMerge, clsx as type } from "cnfast"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

"use client"

import { useTheme } from "@/components/theme-provider"

export function RemountOnThemeChange(props: React.ComponentProps<"div">) {
  const { resolvedTheme } = useTheme()

  return <div key={resolvedTheme} {...props} />
}

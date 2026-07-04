"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeProviderContextValue = {
  theme: Theme
  setTheme: (theme: string | ((theme: Theme) => string)) => void
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  themes: Theme[]
  forcedTheme?: Theme
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  enableColorScheme?: boolean
  disableTransitionOnChange?: boolean
  forcedTheme?: Theme
}

const ThemeProviderContext = createContext<ThemeProviderContextValue | null>(
  null
)

const THEMES: Theme[] = ["light", "dark", "system"]
const MEDIA_QUERY = "(prefers-color-scheme: dark)"

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light"
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  try {
    const theme = localStorage.getItem(storageKey)
    return isTheme(theme) ? theme : defaultTheme
  } catch {
    return defaultTheme
  }
}

function isTheme(theme: string | null): theme is Theme {
  return theme === "light" || theme === "dark" || theme === "system"
}

function resolveTheme(theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? systemTheme : theme
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}")
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    setTimeout(() => {
      document.head.removeChild(style)
    }, 1)
  }
}

function applyTheme({
  resolvedTheme,
  enableColorScheme,
  disableTransitionOnChange,
}: {
  resolvedTheme: ResolvedTheme
  enableColorScheme: boolean
  disableTransitionOnChange: boolean
}) {
  const restoreTransitions = disableTransitionOnChange
    ? disableTransitionsTemporarily()
    : null

  document.documentElement.classList.remove("light", "dark")
  document.documentElement.classList.add(resolvedTheme)

  if (enableColorScheme) {
    document.documentElement.style.colorScheme = resolvedTheme
  }

  restoreTransitions?.()
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
  enableColorScheme = true,
  disableTransitionOnChange = false,
  forcedTheme,
}: ThemeProviderProps) {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme()
  )
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === "undefined"
      ? defaultTheme
      : getStoredTheme(storageKey, defaultTheme)
  )

  const activeTheme = forcedTheme ?? theme
  const resolvedTheme = resolveTheme(
    enableSystem
      ? activeTheme
      : activeTheme === "system"
        ? "light"
        : activeTheme,
    systemTheme
  )

  useEffect(() => {
    applyTheme({
      resolvedTheme,
      enableColorScheme,
      disableTransitionOnChange,
    })
  }, [disableTransitionOnChange, enableColorScheme, resolvedTheme])

  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY)
    const handleChange = () => setSystemTheme(getSystemTheme())

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return
      setThemeState(isTheme(event.newValue) ? event.newValue : defaultTheme)
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [defaultTheme, storageKey])

  const setTheme = useCallback(
    (value: string | ((theme: Theme) => string)) => {
      setThemeState((currentTheme) => {
        const requestedTheme =
          typeof value === "function" ? value(currentTheme) : value
        const nextTheme = isTheme(requestedTheme)
          ? requestedTheme
          : defaultTheme

        try {
          localStorage.setItem(storageKey, nextTheme)
        } catch {}

        return nextTheme
      })
    },
    [defaultTheme, storageKey]
  )

  const value = useMemo(
    () => ({
      theme: activeTheme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: enableSystem
        ? THEMES
        : THEMES.filter((item) => item !== "system"),
      forcedTheme,
    }),
    [
      activeTheme,
      enableSystem,
      forcedTheme,
      resolvedTheme,
      setTheme,
      systemTheme,
    ]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    return {
      theme: "system" as const,
      setTheme: () => {},
      resolvedTheme: "light" as const,
      systemTheme: "light" as const,
      themes: THEMES,
    }
  }

  return context
}

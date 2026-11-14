const svgCache = new Map<string, Promise<string>>()

const DEFAULT_SVG_ACCENT = "var(--info, oklch(0.67 0.17 244.98))"

const SVG_ATTR_TO_JSX: Record<string, string> = {
  class: "className",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "xmlns:xlink": "xmlnsXlink",
  "xlink:href": "xlinkHref",
}

/**
 * Fetches an SVG file by public path with an in-memory promise cache
 * so each icon asset is downloaded at most once per browser session.
 */
export function fetchIconSvg(src: string): Promise<string> {
  const cached = svgCache.get(src)
  if (cached) {
    return cached
  }

  const request = fetch(src).then(async (response) => {
    if (!response.ok) {
      svgCache.delete(src)
      throw new Error(`Failed to load icon from ${src} (${response.status})`)
    }
    return response.text()
  })

  svgCache.set(src, request)
  return request
}

/**
 * Scopes internal SVG IDs (`id`, `url(#...)`, `href="#..."`) with a unique prefix
 * so multiple instances of the same icon can coexist safely in the DOM.
 */
export function scopeSvgIds(rawSvg: string, scopePrefix: string): string {
  const sanitizedPrefix = scopePrefix.replace(/[^a-zA-Z0-9_-]/g, "")
  if (!sanitizedPrefix) {
    return rawSvg
  }

  const idMap = new Map<string, string>()
  for (const match of rawSvg.matchAll(/\bid="([^"]+)"/g)) {
    const id = match[1]
    if (!idMap.has(id)) {
      idMap.set(id, `${sanitizedPrefix}_${id}`)
    }
  }

  if (idMap.size === 0) {
    return rawSvg
  }

  let scoped = rawSvg
  for (const [originalId, nextId] of idMap) {
    scoped = scoped
      .replaceAll(`id="${originalId}"`, `id="${nextId}"`)
      .replaceAll(`url(#${originalId})`, `url(#${nextId})`)
      .replaceAll(`href="#${originalId}"`, `href="#${nextId}"`)
  }

  return scoped
}

function parseRootSvgMeta(rawSvg: string): {
  width: string
  height: string
  viewBox: string
  innerHtml: string
} {
  const openTagMatch = rawSvg.match(/<svg([^>]*)>([\s\S]*)<\/svg>\s*$/)
  if (!openTagMatch) {
    throw new Error("Invalid SVG markup: missing root <svg> element")
  }

  const attrs = openTagMatch[1]
  const innerHtml = openTagMatch[2]
  const width = attrs.match(/\bwidth="([^"]+)"/)?.[1] ?? "24"
  const height = attrs.match(/\bheight="([^"]+)"/)?.[1] ?? "24"
  const viewBox = attrs.match(/\bviewBox="([^"]+)"/)?.[1] ?? "0 0 24 24"

  return { width, height, viewBox, innerHtml }
}

function cssPropertyToCamelCase(property: string): string {
  return property
    .trim()
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function convertInlineStyleAttrToJsx(styleValue: string): string {
  const entries = styleValue
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .map((rule) => {
      const colonIndex = rule.indexOf(":")
      if (colonIndex === -1) {
        return null
      }
      const key = cssPropertyToCamelCase(rule.slice(0, colonIndex))
      const val = rule
        .slice(colonIndex + 1)
        .trim()
        .replaceAll('"', '\\"')
      return `${key}: "${val}"`
    })
    .filter((entry): entry is string => entry !== null)

  return `style={{ ${entries.join(", ")} }}`
}

function convertSvgInnerToJsx(innerHtml: string): string {
  let jsx = innerHtml.replace(/\bstyle="([^"]*)"/g, (_, styleValue: string) =>
    convertInlineStyleAttrToJsx(styleValue)
  )

  for (const [htmlAttr, jsxAttr] of Object.entries(SVG_ATTR_TO_JSX)) {
    const attrPattern = new RegExp(`(\\s)${htmlAttr}=`, "g")
    jsx = jsx.replace(attrPattern, `$1${jsxAttr}=`)
  }

  return jsx
}

export type FormatSvgOptions = {
  accentColor?: string
  size?: number
}

/**
 * Formats a standalone SVG string with explicit size and `--icon-accent` value
 * for clipboard copy or file download.
 */
export function formatSvgForCopy(
  rawSvg: string,
  options: FormatSvgOptions = {}
): string {
  const { accentColor = DEFAULT_SVG_ACCENT, size } = options
  const { width, height, viewBox, innerHtml } = parseRootSvgMeta(rawSvg)

  const resolvedWidth =
    size !== undefined ? String(size) : width.replace(/px$/, "")
  const resolvedHeight =
    size !== undefined ? String(size) : height.replace(/px$/, "")

  return `<svg width="${resolvedWidth}" height="${resolvedHeight}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" style="--icon-accent: ${accentColor}">${innerHtml}</svg>`
}

export type FormatJsxOptions = {
  componentName: string
  accentColor?: string
  size?: number
}

/**
 * Converts a raw SVG string into a typed React TSX icon component
 * with `--icon-accent` support and forwardable `SVGProps<SVGSVGElement>`.
 */
export function formatJsxForCopy(
  rawSvg: string,
  options: FormatJsxOptions
): string {
  const { componentName, accentColor = DEFAULT_SVG_ACCENT, size } = options
  const { width, height, viewBox, innerHtml } = parseRootSvgMeta(rawSvg)

  const numericWidth = size ?? Number.parseInt(width, 10)
  const numericHeight = size ?? Number.parseInt(height, 10)
  const jsxInner = convertSvgInnerToJsx(innerHtml)

  return `import type { CSSProperties, SVGProps } from "react"

export function ${componentName}({
  style,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={${Number.isFinite(numericWidth) ? numericWidth : 24}}
      height={${Number.isFinite(numericHeight) ? numericHeight : 24}}
      viewBox="${viewBox}"
      xmlns="http://www.w3.org/2000/svg"
      style={
        {
          "--icon-accent": "${accentColor}",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      ${jsxInner}
    </svg>
  )
}
`
}

import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { describe, expect, it } from "vitest"

import { ICON_LIBRARIES, NUCLEO_ICONS } from "@/features/icons/data"
import {
  formatJsxForCopy,
  formatSvgForCopy,
  scopeSvgIds,
} from "@/features/icons/lib/svg-transform"

const NUCLEO_PUBLIC_DIR = path.join(process.cwd(), "public/icons/nucleo")

describe("Nucleo icon assets", () => {
  it("matches all 249 SVG files in public/icons/nucleo/", () => {
    const filesOnDisk = fs
      .readdirSync(NUCLEO_PUBLIC_DIR)
      .filter((file) => file.endsWith(".svg"))
      .map((file) => file.replace(/\.svg$/, ""))
      .sort()

    const catalogNames = NUCLEO_ICONS.map((icon) => icon.name).sort()

    expect(NUCLEO_ICONS).toHaveLength(249)
    expect(ICON_LIBRARIES[0]?.count).toBe(249)
    expect(catalogNames).toEqual(filesOnDisk)
  })

  it("uses light blue --info color via --nucleo-accent fallback without invalid hsl(oklch)", () => {
    for (const icon of NUCLEO_ICONS) {
      const svg = fs.readFileSync(
        path.join(NUCLEO_PUBLIC_DIR, `${icon.name}.svg`),
        "utf8"
      )
      expect(svg).toContain(
        'style="--icon-accent: var(--nucleo-accent, var(--info, oklch(0.67 0.17 244.98)))"'
      )
      expect(svg).not.toContain("hsl(var(--primary")
      expect(svg).toContain(`viewBox="${icon.viewBox}"`)
    }
  })
})

describe("formatSvgForCopy", () => {
  it("defaults --icon-accent to light blue --info", () => {
    const rawSvg = fs.readFileSync(
      path.join(NUCLEO_PUBLIC_DIR, "analytics.svg"),
      "utf8"
    )

    const formatted = formatSvgForCopy(rawSvg, { size: 32 })

    expect(formatted).toContain('width="32"')
    expect(formatted).toContain('height="32"')
    expect(formatted).toContain(
      'style="--icon-accent: var(--info, oklch(0.67 0.17 244.98))"'
    )
  })

  it("injects custom accentColor and size on the root <svg>", () => {
    const rawSvg = fs.readFileSync(
      path.join(NUCLEO_PUBLIC_DIR, "analytics.svg"),
      "utf8"
    )

    const formatted = formatSvgForCopy(rawSvg, {
      accentColor: "#10b981",
      size: 32,
    })

    expect(formatted).toContain('width="32"')
    expect(formatted).toContain('height="32"')
    expect(formatted).toContain('viewBox="0 0 24 24"')
    expect(formatted).toContain('style="--icon-accent: #10b981"')
  })
})

describe("formatJsxForCopy", () => {
  it("produces valid React JSX props and style object", () => {
    const rawSvg = fs.readFileSync(
      path.join(NUCLEO_PUBLIC_DIR, "analytics.svg"),
      "utf8"
    )

    const jsx = formatJsxForCopy(rawSvg, {
      componentName: "AnalyticsIcon",
      accentColor: "#6366f1",
      size: 40,
    })

    expect(jsx).toContain("export function AnalyticsIcon(")
    expect(jsx).toContain("width={40}")
    expect(jsx).toContain("height={40}")
    expect(jsx).toContain('"--icon-accent": "#6366f1"')
    expect(jsx).toContain('className="nc-icon-wrapper"')
    expect(jsx).toContain("clipPath=")
    expect(jsx).toContain("stopColor=")
    expect(jsx).toContain("stopOpacity=")
    expect(jsx).toContain("style={{ stopColor:")
  })

  it("transpiles cleanly as TSX for every Nucleo icon", () => {
    for (const icon of NUCLEO_ICONS) {
      const rawSvg = fs.readFileSync(
        path.join(NUCLEO_PUBLIC_DIR, `${icon.name}.svg`),
        "utf8"
      )
      const jsx = formatJsxForCopy(rawSvg, {
        componentName: icon.componentName,
        accentColor: "#297ff0",
        size: 24,
      })

      const transpiled = ts.transpileModule(jsx, {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2020,
        },
        reportDiagnostics: true,
      })

      expect(transpiled.diagnostics).toEqual([])
    }
  })
})

describe("scopeSvgIds", () => {
  it("prefixes id and url(#...) references uniquely", () => {
    const rawSvg = fs.readFileSync(
      path.join(NUCLEO_PUBLIC_DIR, "bolt.svg"),
      "utf8"
    )

    const scoped = scopeSvgIds(rawSvg, "dialog_1")
    expect(scoped).toContain('id="dialog_1_')
    expect(scoped).toContain("url(#dialog_1_")
  })
})

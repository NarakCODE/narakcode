"use client"

import { useEffect, useMemo, useState } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import {
  CheckIcon,
  Code2Icon,
  CopyIcon,
  DownloadIcon,
  FileCode2Icon,
  FileCodeIcon,
  MoonIcon,
  SunIcon,
  WrapTextIcon,
} from "lucide-react"
import { toast } from "sonner"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  fetchIconSvg,
  formatJsxForCopy,
  formatSvgForCopy,
} from "../lib/svg-transform"
import type { IconItem } from "../types"
import { IconSvgPreview } from "./icon-svg-preview"

type PreviewSurface = "light" | "dark"

type IconDetailDialogProps = {
  icon: IconItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  iconSize: number
}

function HighlightedCodeContent({
  code,
  language,
  wrap = false,
  lineNumbers = true,
}: {
  code: string
  language: string
  wrap?: boolean
  lineNumbers?: boolean
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent
      wrap={wrap}
      lineNumbers={lineNumbers}
      className="max-h-56"
    >
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

/**
 * Interactive inspector dialog for previewing an icon across surfaces
 * and copying SVG, React JSX, or downloading.
 */
export function IconDetailDialog({
  icon,
  open,
  onOpenChange,
  iconSize,
}: IconDetailDialogProps) {
  const [rawSvg, setRawSvg] = useState<string | null>(null)
  const [surface, setSurface] = useState<PreviewSurface>("dark")
  const [copiedAction, setCopiedAction] = useState<"svg" | "jsx" | null>(null)
  const [wrapJsx, setWrapJsx] = useState(false)
  const [wrapSvg, setWrapSvg] = useState(true)
  const [wrapUsage, setWrapUsage] = useState(false)

  useEffect(() => {
    if (!open || !icon) {
      return
    }

    let cancelled = false
    fetchIconSvg(icon.src)
      .then((svg) => {
        if (!cancelled) {
          setRawSvg(svg)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRawSvg(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [open, icon])

  const formattedSvg = useMemo(() => {
    if (!rawSvg) {
      return ""
    }
    return formatSvgForCopy(rawSvg, { size: iconSize })
  }, [rawSvg, iconSize])

  const formattedJsx = useMemo(() => {
    if (!rawSvg || !icon) {
      return ""
    }
    return formatJsxForCopy(rawSvg, {
      componentName: icon.componentName,
      size: iconSize,
    })
  }, [rawSvg, icon, iconSize])

  const usageSnippet = useMemo(() => {
    if (!icon) {
      return ""
    }
    return `import { ${icon.componentName} } from "@/components/icons/${icon.name}"

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <${icon.componentName} />

      <${icon.componentName}
        width={${iconSize}}
        height={${iconSize}}
      />
    </div>
  )
}`
  }, [icon, iconSize])

  const handleCopySvg = async () => {
    if (!icon || !formattedSvg) {
      return
    }

    const copied = await copyToClipboardWithEvent(formattedSvg, {
      name: "copy_icon_svg",
      properties: {
        icon: icon.name,
        library: icon.library,
        size: iconSize,
      },
    })

    if (copied) {
      setCopiedAction("svg")
      toast.success("Copied SVG to clipboard")
      setTimeout(() => setCopiedAction(null), 1500)
    } else {
      toast.error("Failed to copy SVG")
    }
  }

  const handleCopyJsx = async () => {
    if (!icon || !formattedJsx) {
      return
    }

    const copied = await copyToClipboardWithEvent(formattedJsx, {
      name: "copy_icon_jsx",
      properties: {
        icon: icon.name,
        component_name: icon.componentName,
        library: icon.library,
        size: iconSize,
      },
    })

    if (copied) {
      setCopiedAction("jsx")
      toast.success("Copied React component")
      setTimeout(() => setCopiedAction(null), 1500)
    } else {
      toast.error("Failed to copy React component")
    }
  }

  const handleDownloadSvg = () => {
    if (!icon || !formattedSvg) {
      return
    }

    trackEvent({
      name: "download_icon_svg",
      properties: {
        icon: icon.name,
        library: icon.library,
        size: iconSize,
      },
    })

    const blob = new Blob([formattedSvg], {
      type: "image/svg+xml;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${icon.name}.svg`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${icon.name}.svg`)
  }

  if (!icon) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] overflow-y-auto pt-12 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">{icon.title}</DialogTitle>

        {/* Interactive preview stage */}
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-accent/25 px-3 py-2">
            {/* Surface toggles */}
            <div className="flex items-center gap-1 rounded-lg border border-line bg-background p-0.5">
              <Button
                type="button"
                size="xs"
                variant={surface === "light" ? "secondary" : "ghost"}
                onClick={() => setSurface("light")}
              >
                <SunIcon />
                <span>Light</span>
              </Button>
              <Button
                type="button"
                size="xs"
                variant={surface === "dark" ? "secondary" : "ghost"}
                onClick={() => setSurface("dark")}
              >
                <MoonIcon />
                <span>Dark</span>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "relative flex h-64 items-center justify-center bg-size-[14px_14px] bg-center transition-colors",
              surface === "light" &&
                "bg-zinc-50 bg-[radial-gradient(rgb(0_0_0/0.14)_1px,transparent_1px)] text-zinc-950",
              surface === "dark" &&
                "bg-zinc-950 bg-[radial-gradient(rgb(255_255_255/0.16)_1px,transparent_1px)] text-zinc-50"
            )}
          >
            <IconSvgPreview
              src={icon.src}
              name={icon.title}
              size={Math.min(200, Math.max(128, Math.round(iconSize * 4.5)))}
              eager
            />
          </div>
        </div>

        {/* Code & usage tabs powered by shadcn CodeBlock */}
        <Tabs defaultValue="jsx" className="w-full min-w-0">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="jsx">
              <Code2Icon />
              <span>React JSX</span>
            </TabsTrigger>
            <TabsTrigger value="svg">
              <FileCode2Icon />
              <span>SVG</span>
            </TabsTrigger>
            <TabsTrigger value="usage">
              <span>Usage</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jsx" className="min-w-0">
            <CodeBlock size="sm">
              <CodeBlockHeader>
                <CodeBlockTitle>
                  <FileCodeIcon />
                  components/icons/{icon.name}.tsx
                </CodeBlockTitle>
                <CodeBlockActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Wrap lines"
                    aria-pressed={wrapJsx}
                    className="aria-pressed:text-foreground"
                    onClick={() => setWrapJsx(!wrapJsx)}
                  >
                    <WrapTextIcon />
                  </Button>
                  <CodeBlockCopyButton
                    value={formattedJsx}
                    onClick={() => {
                      trackEvent({
                        name: "copy_icon_jsx",
                        properties: {
                          icon: icon.name,
                          component_name: icon.componentName,
                          library: icon.library,
                          size: iconSize,
                        },
                      })
                      toast.success("Copied React component")
                    }}
                  />
                </CodeBlockActions>
              </CodeBlockHeader>
              <HighlightedCodeContent
                code={formattedJsx || "// Loading SVG..."}
                language="tsx"
                wrap={wrapJsx}
                lineNumbers
              />
            </CodeBlock>
          </TabsContent>

          <TabsContent value="svg" className="min-w-0">
            <CodeBlock size="sm">
              <CodeBlockHeader>
                <CodeBlockTitle>
                  <FileCodeIcon />
                  public/icons/nucleo/{icon.name}.svg
                </CodeBlockTitle>
                <CodeBlockActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Wrap lines"
                    aria-pressed={wrapSvg}
                    className="aria-pressed:text-foreground"
                    onClick={() => setWrapSvg(!wrapSvg)}
                  >
                    <WrapTextIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Download SVG"
                    onClick={handleDownloadSvg}
                  >
                    <DownloadIcon />
                  </Button>
                  <CodeBlockCopyButton
                    value={formattedSvg}
                    onClick={() => {
                      trackEvent({
                        name: "copy_icon_svg",
                        properties: {
                          icon: icon.name,
                          library: icon.library,
                          size: iconSize,
                        },
                      })
                      toast.success("Copied SVG to clipboard")
                    }}
                  />
                </CodeBlockActions>
              </CodeBlockHeader>
              <HighlightedCodeContent
                code={formattedSvg || "<!-- Loading SVG... -->"}
                language="html"
                wrap={wrapSvg}
                lineNumbers={false}
              />
            </CodeBlock>
          </TabsContent>

          <TabsContent value="usage" className="min-w-0 space-y-2.5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Each Nucleo Glass icon exposes an{" "}
              <code className="code-inline">--icon-accent</code> CSS custom
              property for tinting its layered glass core, while standalone
              files in <code className="code-inline">public{icon.src}</code>{" "}
              also read <code className="code-inline">--nucleo-accent</code>{" "}
              when inlined.
            </p>

            <CodeBlock size="sm">
              <CodeBlockHeader>
                <CodeBlockTitle>
                  <FileCodeIcon />
                  app/example.tsx
                </CodeBlockTitle>
                <CodeBlockActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Wrap lines"
                    aria-pressed={wrapUsage}
                    className="aria-pressed:text-foreground"
                    onClick={() => setWrapUsage(!wrapUsage)}
                  >
                    <WrapTextIcon />
                  </Button>
                  <CodeBlockCopyButton value={usageSnippet} />
                </CodeBlockActions>
              </CodeBlockHeader>
              <HighlightedCodeContent
                code={usageSnippet}
                language="tsx"
                wrap={wrapUsage}
                lineNumbers
              />
            </CodeBlock>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadSvg}
            disabled={!formattedSvg}
          >
            <DownloadIcon />
            <span>Download SVG</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopyJsx}
            disabled={!formattedJsx}
          >
            {copiedAction === "jsx" ? <CheckIcon /> : <Code2Icon />}
            <span>Copy React JSX</span>
          </Button>

          <Button
            type="button"
            onClick={handleCopySvg}
            disabled={!formattedSvg}
          >
            {copiedAction === "svg" ? <CheckIcon /> : <CopyIcon />}
            <span>Copy SVG</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

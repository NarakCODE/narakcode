"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Code2Icon,
  CopyIcon,
  DownloadIcon,
  FileCode2Icon,
  FileCodeIcon,
  MoonIcon,
  SunIcon,
  WrapTextIcon,
} from "lucide-react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react"
import { toast } from "sonner"
import { Drawer as DrawerPrimitive } from "vaul"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"
import { useIsMobile } from "@/hooks/use-mobile"
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
import { Dock, type DockItem } from "@/components/ui/dock"
import { PhoneSkeleton } from "@/components/ui/phone-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { haptic } from "@/registry/lib/haptic"

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
  onPreviousIcon?: () => void
  onNextIcon?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

const SWIPE_COMMIT_DISTANCE = 72
const SWIPE_COMMIT_VELOCITY = 420
const SWIPE_PROJECTED_DISTANCE = 135

/** Exponential momentum projection matching Apple's Fluid Interfaces formula. */
function projectMomentum(velocity: number, decelerationRate = 0.992): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

function HighlightedCodeContent({
  code,
  language,
  wrap = false,
  lineNumbers = true,
  isMobile = false,
}: {
  code: string
  language: string
  wrap?: boolean
  lineNumbers?: boolean
  isMobile?: boolean
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlockContent
      wrap={wrap}
      lineNumbers={lineNumbers}
      data-vaul-no-drag={isMobile ? "" : undefined}
      className={cn(isMobile ? "max-h-48" : "max-h-56 md:max-h-72")}
    >
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

const APP_FRAME_SLOTS = [
  { id: "notes", labelWidth: "w-11", variant: "card" },
  { id: "weather", labelWidth: "w-10", variant: "circles" },
  { id: "photos", labelWidth: "w-9", variant: "grid" },
  { id: "clock", labelWidth: "w-11", variant: "dial" },
] as const

type AppFrameSlotVariant = (typeof APP_FRAME_SLOTS)[number]["variant"]

function AppSlotGlyph({ variant }: { variant: AppFrameSlotVariant }) {
  switch (variant) {
    case "card":
      return (
        <div className="flex h-full w-full flex-col gap-2 p-3">
          <div className="h-2.5 w-full rounded-full bg-[color-mix(in_oklab,var(--accent-foreground)_14%,transparent)]" />
          <div className="h-1.5 w-3/4 rounded-full bg-foreground/10" />
          <div className="h-1.5 w-1/2 rounded-full bg-foreground/7" />
        </div>
      )
    case "circles":
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <span className="size-7 rounded-full bg-[color-mix(in_oklab,var(--accent-foreground)_14%,transparent)]" />
          <span className="mt-3 -ml-3 size-6 rounded-full bg-foreground/8 backdrop-blur-xs" />
        </div>
      )
    case "grid":
      return (
        <div className="grid h-full w-full grid-cols-2 gap-1.5 p-3">
          <span className="rounded-[6px] bg-foreground/8" />
          <span className="rounded-[6px] bg-foreground/5" />
          <span className="rounded-[6px] bg-foreground/5" />
          <span className="rounded-[6px] bg-[color-mix(in_oklab,var(--accent-foreground)_12%,transparent)]" />
        </div>
      )
    case "dial":
      return (
        <div className="flex h-full w-full items-center justify-center p-3">
          <span className="flex size-full items-center justify-center rounded-full border border-foreground/10 bg-foreground/4">
            <span className="size-2 rounded-full bg-foreground/15" />
          </span>
        </div>
      )
  }
}

// Concentric corner geometry in logical iPhone points (PT_W = 440):
// R_screen ≈ 56px -> inset 16px => R_dock = 40px -> inset 16px => R_app = 24px.
const APPLE_APP_FRAME_CLASS =
  "overflow-hidden rounded-[24px] border border-foreground/6 bg-background/45 shadow-[0_4px_14px_-6px_rgb(0_0_0/0.07),inset_0_1px_0_0_rgb(255_255_255/0.24)] backdrop-blur-md"

const APPLE_APP_ACTIVE_FRAME_CLASS =
  "border-accent/45 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_72%,transparent)_0%,color-mix(in_oklab,var(--background)_62%,transparent)_100%)] shadow-[0_6px_16px_-6px_rgb(0_0_0/0.12),inset_0_1px_0_0_rgb(255_255_255/0.24),inset_0_-1px_0_0_rgb(255_255_255/0.06)]"

/**
 * Minimalist 4-column iOS home screen app frame rendered behind the floating
 * Liquid Glass dock inside the iPhone 18 Pro Max viewport.
 */
function AppleAppFrameBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[150px] z-0 flex flex-col gap-5 px-8"
    >
      {/* Upper peeking row aligned with the 4 dock columns */}
      <div className="grid grid-cols-4 gap-4 opacity-45">
        {APP_FRAME_SLOTS.map((slot) => (
          <div key={`upper-${slot.id}`} className="flex flex-col items-center">
            <div className="aspect-square w-full rounded-[24px] border border-foreground/5 bg-background/30 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.16)] backdrop-blur-sm" />
            <span
              className={cn(
                "mt-2 block h-1.5 rounded-full bg-foreground/7",
                slot.labelWidth
              )}
            />
          </div>
        ))}
      </div>

      {/* Main 4-slot Apple app row above the dock */}
      <div className="grid grid-cols-4 gap-4">
        {APP_FRAME_SLOTS.map((slot, index) => (
          <div key={slot.id} className="flex flex-col items-center">
            <div
              className={cn(
                "aspect-square w-full",
                APPLE_APP_FRAME_CLASS,
                index === 0 && APPLE_APP_ACTIVE_FRAME_CLASS
              )}
            >
              <AppSlotGlyph variant={slot.variant} />
            </div>
            <span
              className={cn(
                "mt-2 block h-1.5 rounded-full bg-foreground/8",
                slot.labelWidth
              )}
            />
          </div>
        ))}
      </div>

      {/* iOS home screen page indicator pill */}
      <div className="mx-auto flex items-center gap-1.5 rounded-full border border-foreground/6 bg-background/40 px-3 py-1.5 backdrop-blur-md">
        <span className="size-1.5 rounded-full bg-foreground/35" />
        <span className="size-1.5 rounded-full bg-foreground/15" />
        <span className="size-1.5 rounded-full bg-foreground/15" />
      </div>
    </div>
  )
}

type IconPreviewStageProps = {
  icon: IconItem
  surface: PreviewSurface
  onSurfaceChange: (surface: PreviewSurface) => void
  dockItems: DockItem[]
  isMobile: boolean
  hasPrevious: boolean
  hasNext: boolean
  onPreviousIcon?: () => void
  onNextIcon?: () => void
  className?: string
}

function IconPreviewStage({
  icon,
  surface,
  onSurfaceChange,
  dockItems,
  isMobile,
  hasPrevious,
  hasNext,
  onPreviousIcon,
  onNextIcon,
  className,
}: IconPreviewStageProps) {
  const prefersReducedMotion = useReducedMotion()
  const dragX = useMotionValue(0)
  const pendingEnterOffsetRef = useRef(0)
  const pendingFromDragRef = useRef(false)

  const rotate = useTransform(dragX, [-160, 0, 160], [-2.5, 0, 2.5])
  const dragScale = useTransform(dragX, [-180, 0, 180], [0.97, 1, 0.97])
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.55, 1, 0.55])
  const prevHintOpacity = useTransform(dragX, [12, 64], [0, 1])
  const nextHintOpacity = useTransform(dragX, [-64, -12], [1, 0])

  useEffect(() => {
    const enterOffset = pendingEnterOffsetRef.current
    const fromDrag = pendingFromDragRef.current
    pendingEnterOffsetRef.current = 0
    pendingFromDragRef.current = false

    if (enterOffset === 0) {
      dragX.set(0)
      return
    }

    dragX.set(enterOffset)
    const controls = animate(
      dragX,
      0,
      prefersReducedMotion
        ? { duration: 0.14, ease: "easeOut" }
        : {
            type: "spring",
            duration: 0.34,
            // Bounce applies only when a gesture carried physical momentum.
            bounce: fromDrag ? 0.16 : 0,
          }
    )

    return () => controls.stop()
  }, [icon.name, dragX, prefersReducedMotion])

  const triggerStep = useCallback(
    (direction: "previous" | "next", fromDrag: boolean) => {
      if (direction === "previous") {
        if (!hasPrevious || !onPreviousIcon) {
          return false
        }
        pendingEnterOffsetRef.current = prefersReducedMotion ? 0 : -40
        pendingFromDragRef.current = fromDrag
        haptic(18)
        onPreviousIcon()
        return true
      }

      if (!hasNext || !onNextIcon) {
        return false
      }
      pendingEnterOffsetRef.current = prefersReducedMotion ? 0 : 40
      pendingFromDragRef.current = fromDrag
      haptic(18)
      onNextIcon()
      return true
    },
    [hasNext, hasPrevious, onNextIcon, onPreviousIcon, prefersReducedMotion]
  )

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const projected = info.offset.x + projectMomentum(info.velocity.x)
    const passedDistance = Math.abs(info.offset.x) > SWIPE_COMMIT_DISTANCE
    const passedVelocity = Math.abs(info.velocity.x) > SWIPE_COMMIT_VELOCITY
    const passedProjection = Math.abs(projected) > SWIPE_PROJECTED_DISTANCE

    if (passedDistance || passedVelocity || passedProjection) {
      const direction =
        info.offset.x > 0 || (info.offset.x === 0 && info.velocity.x > 0)
          ? "previous"
          : "next"

      if (triggerStep(direction, true)) {
        return
      }
    }

    animate(
      dragX,
      0,
      prefersReducedMotion
        ? { duration: 0.14, ease: "easeOut" }
        : {
            type: "spring",
            duration: 0.42,
            bounce: 0.2,
            velocity: info.velocity.x,
          }
    )
  }

  const canSwipeHorizontally = isMobile && (hasPrevious || hasNext)
  const showNavButtons = hasPrevious || hasNext

  const previewPhone = (
    <PhoneSkeleton
      fillContainer
      scale={4.2}
      island="mini"
      crop="bottom"
      paper={surface === "dark" ? "#0C0F14" : "#F3F5F7"}
      ink={surface === "dark" ? "#475564" : "#94A3B0"}
      guide={surface === "dark" ? "#222B35" : "#C8D3DC"}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-end px-4 pb-4">
        <img
          src="/images/iphone-wallpaper.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 transition-colors",
            surface === "dark" ? "bg-black/20" : "bg-white/15"
          )}
        />
        <AppleAppFrameBackdrop />
        <Dock
          items={dockItems}
          activeId={icon.name}
          ariaLabel={`${icon.title} dock preview`}
          glassRadius={40}
          glassTone={surface}
          glassBackdrop="none"
          className="pointer-events-none mt-0 w-full justify-between gap-4 rounded-[40px] p-4 [&_button]:aspect-square [&_button]:flex-1 [&_button]:rounded-[24px] [&_button]:p-0"
        />
      </div>
    </PhoneSkeleton>
  )

  return (
    <div
      className={cn(
        "flex min-w-0 shrink-0 flex-col overflow-hidden rounded-xl border border-line",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-accent/25 px-3 py-2">
        <div
          data-vaul-no-drag={isMobile ? "" : undefined}
          className="flex items-center gap-1 rounded-lg border border-line bg-background p-0.5"
        >
          <Button
            type="button"
            size="xs"
            variant={surface === "light" ? "secondary" : "ghost"}
            className="relative transition-transform duration-100 ease-out before:absolute before:-inset-1.5 before:content-[''] active:scale-[0.97]"
            onClick={() => {
              haptic(12)
              onSurfaceChange("light")
            }}
          >
            <SunIcon />
            <span>Light</span>
          </Button>
          <Button
            type="button"
            size="xs"
            variant={surface === "dark" ? "secondary" : "ghost"}
            className="relative transition-transform duration-100 ease-out before:absolute before:-inset-1.5 before:content-[''] active:scale-[0.97]"
            onClick={() => {
              haptic(12)
              onSurfaceChange("dark")
            }}
          >
            <MoonIcon />
            <span>Dark</span>
          </Button>
        </div>

        {showNavButtons && (
          <div
            data-vaul-no-drag={isMobile ? "" : undefined}
            className="flex items-center gap-1"
          >
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label="Previous icon"
              disabled={!hasPrevious}
              className="relative transition-transform duration-100 ease-out before:absolute before:-inset-2 before:content-[''] active:scale-[0.95]"
              onClick={() => triggerStep("previous", false)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label="Next icon"
              disabled={!hasNext}
              className="relative transition-transform duration-100 ease-out before:absolute before:-inset-2 before:content-[''] active:scale-[0.95]"
              onClick={() => triggerStep("next", false)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        )}
      </div>

      <div
        data-vaul-no-drag={canSwipeHorizontally ? "" : undefined}
        className={cn(
          "relative flex min-h-60 flex-1 items-stretch justify-center overflow-hidden bg-size-[14px_14px] bg-center px-1 pt-2 pb-0.5 transition-colors sm:min-h-68",
          surface === "light" &&
            "bg-zinc-50 bg-[radial-gradient(rgb(0_0_0/0.14)_1px,transparent_1px)] text-zinc-950 [--accent-foreground:oklch(0.21_0.006_285.885)] [--accent:oklch(0.967_0.001_286.375)] [--background:oklch(1_0_0)] [--border:oklch(0.92_0.004_286.32)] [--foreground:oklch(0.141_0.005_285.823)] [--muted-foreground:oklch(0.552_0.016_285.938)] [--muted:oklch(0.967_0.001_286.375)]",
          surface === "dark" &&
            "bg-zinc-950 bg-[radial-gradient(rgb(255_255_255/0.16)_1px,transparent_1px)] text-zinc-50 [--accent-foreground:oklch(0.985_0_0)] [--accent:oklch(0.274_0.006_286.033)] [--background:oklch(0.141_0.005_285.823)] [--border:oklch(0.274_0.006_286.033)] [--foreground:oklch(0.985_0_0)] [--muted-foreground:oklch(0.705_0.015_286.067)] [--muted:oklch(0.274_0.006_286.033)]"
        )}
      >
        {canSwipeHorizontally ? (
          <>
            {hasPrevious && (
              <motion.div
                aria-hidden="true"
                style={{ opacity: prevHintOpacity }}
                className="pointer-events-none absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full border border-border/60 bg-background/80 p-2 text-foreground shadow-sm backdrop-blur-md"
              >
                <ChevronLeftIcon className="size-4" />
              </motion.div>
            )}
            {hasNext && (
              <motion.div
                aria-hidden="true"
                style={{ opacity: nextHintOpacity }}
                className="pointer-events-none absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full border border-border/60 bg-background/80 p-2 text-foreground shadow-sm backdrop-blur-md"
              >
                <ChevronRightIcon className="size-4" />
              </motion.div>
            )}

            <motion.div
              drag="x"
              dragDirectionLock
              dragMomentum={false}
              dragConstraints={{
                left: hasNext ? -200 : 0,
                right: hasPrevious ? 200 : 0,
              }}
              dragElastic={{
                left: hasNext ? 0.25 : 0.14,
                right: hasPrevious ? 0.25 : 0.14,
              }}
              onDragEnd={handleDragEnd}
              style={{
                x: dragX,
                rotate: prefersReducedMotion ? 0 : rotate,
                scale: prefersReducedMotion ? 1 : dragScale,
                opacity: dragOpacity,
                touchAction: "pan-y",
              }}
              className="h-full w-full cursor-grab active:cursor-grabbing"
            >
              {previewPhone}
            </motion.div>
          </>
        ) : (
          previewPhone
        )}
      </div>
    </div>
  )
}

type IconCodeTabsProps = {
  icon: IconItem
  iconSize: number
  formattedJsx: string
  formattedSvg: string
  usageSnippet: string
  wrapJsx: boolean
  onToggleWrapJsx: () => void
  wrapSvg: boolean
  onToggleWrapSvg: () => void
  wrapUsage: boolean
  onToggleWrapUsage: () => void
  onDownloadSvg: () => void
  isMobile: boolean
}

function IconCodeTabs({
  icon,
  iconSize,
  formattedJsx,
  formattedSvg,
  usageSnippet,
  wrapJsx,
  onToggleWrapJsx,
  wrapSvg,
  onToggleWrapSvg,
  wrapUsage,
  onToggleWrapUsage,
  onDownloadSvg,
  isMobile,
}: IconCodeTabsProps) {
  return (
    <Tabs defaultValue="jsx" className="flex min-w-0 flex-1 flex-col">
      <TabsList
        data-vaul-no-drag={isMobile ? "" : undefined}
        className="w-full sm:w-fit"
      >
        <TabsTrigger value="jsx" className={cn(isMobile && "min-h-10")}>
          <Code2Icon />
          <span>React JSX</span>
        </TabsTrigger>
        <TabsTrigger value="svg" className={cn(isMobile && "min-h-10")}>
          <FileCode2Icon />
          <span>SVG</span>
        </TabsTrigger>
        <TabsTrigger value="usage" className={cn(isMobile && "min-h-10")}>
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
            <CodeBlockActions data-vaul-no-drag={isMobile ? "" : undefined}>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Wrap lines"
                aria-pressed={wrapJsx}
                className="relative before:absolute before:-inset-2 before:content-[''] aria-pressed:text-foreground"
                onClick={onToggleWrapJsx}
              >
                <WrapTextIcon />
              </Button>
              <CodeBlockCopyButton
                value={formattedJsx}
                className="relative before:absolute before:-inset-2 before:content-['']"
                onClick={() => {
                  haptic(20)
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
            isMobile={isMobile}
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
            <CodeBlockActions data-vaul-no-drag={isMobile ? "" : undefined}>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Wrap lines"
                aria-pressed={wrapSvg}
                className="relative before:absolute before:-inset-2 before:content-[''] aria-pressed:text-foreground"
                onClick={onToggleWrapSvg}
              >
                <WrapTextIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Download SVG"
                className="relative before:absolute before:-inset-2 before:content-['']"
                onClick={onDownloadSvg}
              >
                <DownloadIcon />
              </Button>
              <CodeBlockCopyButton
                value={formattedSvg}
                className="relative before:absolute before:-inset-2 before:content-['']"
                onClick={() => {
                  haptic(20)
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
            isMobile={isMobile}
          />
        </CodeBlock>
      </TabsContent>

      <TabsContent value="usage" className="min-w-0 space-y-2.5">
        <p className="text-paragraph-small-relaxed text-text-secondary">
          Each Nucleo Glass icon exposes an{" "}
          <code className="code-inline">--icon-accent</code> CSS custom property
          for tinting its layered glass core, while standalone files in{" "}
          <code className="code-inline">public{icon.src}</code> also read{" "}
          <code className="code-inline">--nucleo-accent</code> when inlined.
        </p>

        <CodeBlock size="sm">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileCodeIcon />
              app/example.tsx
            </CodeBlockTitle>
            <CodeBlockActions data-vaul-no-drag={isMobile ? "" : undefined}>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Wrap lines"
                aria-pressed={wrapUsage}
                className="relative before:absolute before:-inset-2 before:content-[''] aria-pressed:text-foreground"
                onClick={onToggleWrapUsage}
              >
                <WrapTextIcon />
              </Button>
              <CodeBlockCopyButton
                value={usageSnippet}
                className="relative before:absolute before:-inset-2 before:content-['']"
              />
            </CodeBlockActions>
          </CodeBlockHeader>
          <HighlightedCodeContent
            code={usageSnippet}
            language="tsx"
            wrap={wrapUsage}
            lineNumbers
            isMobile={isMobile}
          />
        </CodeBlock>
      </TabsContent>
    </Tabs>
  )
}

type IconDetailActionsProps = {
  formattedSvg: string
  formattedJsx: string
  copiedAction: "svg" | "jsx" | null
  onDownloadSvg: () => void
  onCopyJsx: () => void
  onCopySvg: () => void
  isMobile: boolean
}

function IconDetailActions({
  formattedSvg,
  formattedJsx,
  copiedAction,
  onDownloadSvg,
  onCopyJsx,
  onCopySvg,
  isMobile,
}: IconDetailActionsProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={isMobile ? "icon" : "default"}
        aria-label={isMobile ? "Download SVG" : undefined}
        data-vaul-no-drag={isMobile ? "" : undefined}
        className={cn(
          "transition-transform duration-100 ease-out active:scale-[0.97]",
          isMobile && "min-h-11 min-w-11 shrink-0"
        )}
        onClick={onDownloadSvg}
        disabled={!formattedSvg}
      >
        <DownloadIcon />
        {!isMobile && <span>Download SVG</span>}
      </Button>

      <Button
        type="button"
        variant="outline"
        data-vaul-no-drag={isMobile ? "" : undefined}
        className={cn(
          "transition-transform duration-100 ease-out active:scale-[0.97]",
          isMobile && "min-h-11 flex-1"
        )}
        onClick={onCopyJsx}
        disabled={!formattedJsx}
      >
        {copiedAction === "jsx" ? <CheckIcon /> : <Code2Icon />}
        <span>{isMobile ? "Copy JSX" : "Copy React JSX"}</span>
      </Button>

      <Button
        type="button"
        data-vaul-no-drag={isMobile ? "" : undefined}
        className={cn(
          "transition-transform duration-100 ease-out active:scale-[0.97]",
          isMobile && "min-h-11 flex-1"
        )}
        onClick={onCopySvg}
        disabled={!formattedSvg}
      >
        {copiedAction === "svg" ? <CheckIcon /> : <CopyIcon />}
        <span>Copy SVG</span>
      </Button>
    </>
  )
}

/**
 * Interactive inspector for previewing an icon across surfaces and copying
 * SVG, React JSX, or downloading. Renders as a Vaul gesture bottom sheet on
 * mobile viewports and a side-by-side dialog on larger screens.
 */
export function IconDetailDialog({
  icon,
  open,
  onOpenChange,
  iconSize,
  onPreviousIcon,
  onNextIcon,
  hasPrevious = false,
  hasNext = false,
}: IconDetailDialogProps) {
  const isMobile = useIsMobile()
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

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      const target = event.target as HTMLElement | null
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return
      }

      if (event.key === "ArrowLeft" && hasPrevious && onPreviousIcon) {
        event.preventDefault()
        onPreviousIcon()
      } else if (event.key === "ArrowRight" && hasNext && onNextIcon) {
        event.preventDefault()
        onNextIcon()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [hasNext, hasPrevious, onNextIcon, onPreviousIcon, open])

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
      haptic(25)
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
      haptic(25)
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

    haptic(25)
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

  const dockIconSize = Math.min(54, Math.max(44, iconSize))

  const dockItems = useMemo<DockItem[]>(() => {
    if (!icon) {
      return []
    }

    const createSkeletonItem = (
      slot: number,
      variant: AppFrameSlotVariant
    ): DockItem => ({
      id: `skeleton-${slot}`,
      label: "Placeholder",
      disabled: true,
      icon: (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-full animate-pulse items-center justify-center rounded-[24px]",
            APPLE_APP_FRAME_CLASS
          )}
        >
          <AppSlotGlyph variant={variant} />
        </span>
      ),
    })

    return [
      {
        id: icon.name,
        label: icon.title,
        icon: (
          <span
            className={cn(
              "flex size-full items-center justify-center rounded-[24px]",
              APPLE_APP_FRAME_CLASS,
              APPLE_APP_ACTIVE_FRAME_CLASS
            )}
          >
            <IconSvgPreview
              src={icon.src}
              name={icon.title}
              size={dockIconSize}
              eager
            />
          </span>
        ),
      },
      createSkeletonItem(2, "circles"),
      createSkeletonItem(3, "grid"),
      createSkeletonItem(4, "dial"),
    ]
  }, [dockIconSize, icon])

  if (!icon) {
    return null
  }

  const previewStage = (
    <IconPreviewStage
      icon={icon}
      surface={surface}
      onSurfaceChange={setSurface}
      dockItems={dockItems}
      isMobile={isMobile}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
      onPreviousIcon={onPreviousIcon}
      onNextIcon={onNextIcon}
      className={isMobile ? undefined : "md:w-[360px] lg:w-[400px]"}
    />
  )

  const codeTabs = (
    <IconCodeTabs
      icon={icon}
      iconSize={iconSize}
      formattedJsx={formattedJsx}
      formattedSvg={formattedSvg}
      usageSnippet={usageSnippet}
      wrapJsx={wrapJsx}
      onToggleWrapJsx={() => setWrapJsx((prev) => !prev)}
      wrapSvg={wrapSvg}
      onToggleWrapSvg={() => setWrapSvg((prev) => !prev)}
      wrapUsage={wrapUsage}
      onToggleWrapUsage={() => setWrapUsage((prev) => !prev)}
      onDownloadSvg={handleDownloadSvg}
      isMobile={isMobile}
    />
  )

  const actionButtons = (
    <IconDetailActions
      formattedSvg={formattedSvg}
      formattedJsx={formattedJsx}
      copiedAction={copiedAction}
      onDownloadSvg={handleDownloadSvg}
      onCopyJsx={handleCopyJsx}
      onCopySvg={handleCopySvg}
      isMobile={isMobile}
    />
  )

  if (isMobile) {
    return (
      <DrawerPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        repositionInputs={false}
      >
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:backdrop-blur-none" />
          <DrawerPrimitive.Content
            aria-describedby={undefined}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[26px] border-t border-white/25 bg-background/92 shadow-[0_-16px_48px_-12px_rgb(0_0_0/0.35)] backdrop-blur-2xl backdrop-saturate-180 outline-none dark:border-white/12",
              "[@media(prefers-contrast:more)]:border-foreground/40 [@media(prefers-contrast:more)]:bg-background",
              "[@media(prefers-reduced-motion:reduce)]:transition-opacity [@media(prefers-reduced-motion:reduce)]:duration-200",
              "[@media(prefers-reduced-transparency:reduce)]:bg-background [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
            )}
          >
            <DrawerPrimitive.Title className="sr-only">
              {icon.title}
            </DrawerPrimitive.Title>

            <div className="flex min-h-9 w-full shrink-0 cursor-grab items-center justify-center pt-2 pb-1 active:cursor-grabbing">
              <div
                aria-hidden="true"
                className="h-1 w-9 rounded-full bg-foreground/20"
              />
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-4">
              {previewStage}
              {codeTabs}
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-line/80 bg-background/85 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] backdrop-blur-xl [@media(prefers-reduced-transparency:reduce)]:bg-background [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
              {actionButtons}
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] overflow-y-auto pt-12 sm:max-w-2xl md:max-w-4xl lg:max-w-5xl"
      >
        <DialogTitle className="sr-only">{icon.title}</DialogTitle>

        <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-stretch">
          {previewStage}
          {codeTabs}
        </div>

        <DialogFooter>{actionButtons}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

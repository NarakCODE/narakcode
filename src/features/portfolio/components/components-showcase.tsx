import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { GridItem } from "@/app/(app)/(blocks)/components/showcase/grid-item"
import { Button } from "@/components/base/ui/button"
import { RemountOnThemeChange } from "@/components/remount-on-theme-change"
import { getDocsByCategory } from "@/features/doc/data/documents"
import AppleHelloEffectAllDemo from "@/registry/examples/apple-hello-effect-languages-demo"
import BrandAssetsMenuDemo from "@/registry/examples/brand-assets-menu-demo"
import CodeBlockCommandDemo from "@/registry/examples/code-block-command-demo"
import CopyButtonDemo from "@/registry/examples/copy-button-demo"
import ElasticSliderDemo from "@/registry/examples/elastic-slider-demo"
import FluidGradientTextDemo from "@/registry/examples/fluid-gradient-text-demo-01"
import GitHubContributionsDemo1 from "@/registry/examples/github-contributions-demo-01"
import IconSwapDemo from "@/registry/examples/icon-swap-demo"
import MiddleTruncationDemo from "@/registry/examples/middle-truncation-demo"
import ShimmeringTextDemo2 from "@/registry/examples/shimmering-text-demo-02"
import SlideToUnlockDemo1 from "@/registry/examples/slide-to-unlock-demo-01"
import TestimonialSpotlightDemo from "@/registry/examples/testimonial-spotlight-demo-01"
import TextFlipDemo from "@/registry/examples/text-flip-demo"
import ThemeSwitcherDemo from "@/registry/examples/theme-switcher-demo"
import ThemeToggleEffectDemo from "@/registry/examples/theme-toggle-effect-demo/theme-toggle-effect-demo"
import TwemojiDemo from "@/registry/examples/twemoji-demo"
import WheelPickerDemo from "@/registry/examples/wheel-picker-demo"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"

export function ComponentsShowcase() {
  const components = getDocsByCategory("components")

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>
          Components
          <PanelTitleSup>[{components.length}]</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="grid grid-cols-1 gap-1 p-1 md:grid-cols-3">
        <GridItem className="md:row-span-2">
          <AppleHelloEffectAllDemo />
        </GridItem>

        <GridItem>
          <RemountOnThemeChange>
            <SlideToUnlockDemo1 />
          </RemountOnThemeChange>
        </GridItem>

        <GridItem>
          <ThemeSwitcherDemo />
        </GridItem>

        <GridItem className="md:row-span-2">
          <ElasticSliderDemo />
        </GridItem>

        <GridItem>
          <ThemeToggleEffectDemo />
        </GridItem>

        <GridItem className="**:data-rwp-wrapper:rounded-xl md:row-span-2">
          <WheelPickerDemo />
        </GridItem>

        <GridItem className="md:row-span-2">
          <MiddleTruncationDemo />
        </GridItem>

        <GridItem>
          <TestimonialSpotlightDemo />
        </GridItem>

        <GridItem className="p-0 md:col-span-2 md:row-span-2">
          <GitHubContributionsDemo1 />
        </GridItem>

        <GridItem>
          <TextFlipDemo />
        </GridItem>

        <GridItem>
          <CopyButtonDemo />
        </GridItem>

        <GridItem>
          <BrandAssetsMenuDemo />
        </GridItem>

        <GridItem className="[--code:var(--surface)]">
          <CodeBlockCommandDemo />
        </GridItem>

        <GridItem>
          <IconSwapDemo />
        </GridItem>

        <GridItem>
          <TwemojiDemo />
        </GridItem>

        <GridItem className="p-0 py-4 md:col-span-2 md:row-span-2">
          <FluidGradientTextDemo />
        </GridItem>

        <GridItem>
          <ShimmeringTextDemo2 />
        </GridItem>
      </div>

      <div className="screen-line-bottom h-px" />

      <div className="flex justify-center py-2">
        <Button
          className="gap-2 border-none pr-2.5 pl-3"
          size="sm"
          nativeButton={false}
          render={<Link href="/components" />}
        >
          All Components
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

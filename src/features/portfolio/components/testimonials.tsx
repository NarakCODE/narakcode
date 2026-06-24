"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { useInView, usePageInView } from "motion/react"

import { Button } from "@/components/base/ui/button"
import type { MarqueeContentProps } from "@/components/kibo-ui/marquee"
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/transformed/components/testimonial"
import { TestimonialSpotlight } from "@/registry/transformed/components/testimonial-spotlight"
import { Twemoji } from "@/registry/transformed/components/twemoji/twemoji"
import {
  TESTIMONIALS_1,
  TESTIMONIALS_2,
} from "@/features/portfolio/data/testimonials"
import type { Testimonial as TestimonialType } from "@/features/portfolio/types/testimonials"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

const ID = "testimonials"

const FEATURED_TESTIMONIALS = [...TESTIMONIALS_1, ...TESTIMONIALS_2]
  .filter((item) => item.isFeatured)
  .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)
  const play = isPageInView && isInView

  return (
    <Panel ref={ref} id={ID}>
      <PanelHeader>
        <PanelTitle>
          Trusted by
          <span className="block sm:hidden" /> top builders on{" "}
          <span aria-label="X">𝕏</span>
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="grid gap-1 sm:grid-cols-2">
        {FEATURED_TESTIMONIALS.map((item) => (
          <TestimonialSpotlight
            key={item.url}
            className="bg-background inset-ring-foreground/20 [--spotlight-size:50%]"
          >
            <TestimonialItem {...item} />
          </TestimonialSpotlight>
        ))}

        <TestimonialList
          className="sm:col-span-2"
          data={TESTIMONIALS_1}
          play={play}
        />

        <TestimonialList
          className="sm:col-span-2"
          data={TESTIMONIALS_2}
          direction="right"
          play={play}
        />
      </PanelContent>

      {/* <div className="absolute right-2 bottom-2 z-10 rounded-lg bg-background">
        <Button
          className="size-7 border-none shadow-sm ring-1 ring-foreground/10 dark:ring-foreground/15"
          variant="ghost"
          size="icon-sm"
          asChild
        >
          <a
            href="/testimonials"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View more testimonials"
          >
            <ArrowUpRightIcon />
          </a>
        </Button>
      </div> */}

      <div className="screen-line-top flex justify-center py-2">
        <Button
          className="gap-2 pr-2.5 pl-3"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/testimonials" />}
        >
          All builders
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

function TestimonialList({
  data,
  direction,
  play,
  className,
}: {
  data: TestimonialType[]
  direction?: MarqueeContentProps["direction"]
  play?: boolean
  className?: string
}) {
  return (
    <Marquee className={className}>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />

      <MarqueeContent
        className="[&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
        play={play}
        pauseOnHover={false}
        direction={direction}
        speed={40}
        delay={0.5}
      >
        {data
          .filter((item) => !item.isFeatured)
          .map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-0.5 h-full max-w-xs min-w-2xs rounded-xl bg-background inset-ring-1 inset-ring-border transition-[background-color] ease-out hover:bg-accent-muted"
              style={item.style}
            >
              <TestimonialItem {...item} />
            </MarqueeItem>
          ))}
      </MarqueeContent>
    </Marquee>
  )
}

function TestimonialItem({
  authorAvatar,
  authorName,
  authorTagline,
  url,
  quote,
  icon,
  // isVerified,
}: TestimonialType) {
  return (
    <Testimonial className="group/testimonial relative">
      <TestimonialQuote className="font-serif text-base">
        <p>
          <Twemoji className="grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/testimonial:grayscale-0">
            {quote}
          </Twemoji>
        </p>
      </TestimonialQuote>

      <TestimonialAuthor>
        <TestimonialAvatar>
          <TestimonialAvatarImg
            className="grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/testimonial:grayscale-0"
            src={authorAvatar}
            alt={authorName}
          />
          <TestimonialAvatarRing />
        </TestimonialAvatar>

        <TestimonialAuthorName>
          <a href={url} target="_blank" rel="noopener">
            <span className="absolute inset-0" aria-hidden />
            {authorName}
          </a>
          {/* {isVerified && (
            <TestimonialVerifiedBadge className="text-info">
              <VerifiedIcon />
            </TestimonialVerifiedBadge>
          )} */}
        </TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>

      {icon && (
        <div
          className="pointer-events-none absolute right-3 bottom-3 flex size-8 items-center justify-center [&_svg]:size-4 [&_svg]:text-muted-foreground/80"
          aria-hidden
        >
          {icon}
        </div>
      )}
    </Testimonial>
  )
}

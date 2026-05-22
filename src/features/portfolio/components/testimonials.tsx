"use client"

import { useRef } from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { useInView, usePageInView } from "motion/react"

import { Button } from "@/components/ui/button"
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
  TestimonialVerifiedBadge,
} from "@/registry/components/testimonial"
import { TestimonialSpotlight } from "@/registry/transformed/components/testimonial-spotlight"
import { Twemoji } from "@/registry/transformed/components/twemoji/twemoji"
import { Panel } from "@/features/portfolio/components/panel"
import { VerifiedIcon } from "@/features/portfolio/components/verified-icon"
import {
  TESTIMONIALS_1,
  TESTIMONIALS_2,
} from "@/features/portfolio/data/testimonials"
import type { Testimonial as TestimonialType } from "@/features/portfolio/types/testimonials"

const FEATURED_TESTIMONIALS = [...TESTIMONIALS_1, ...TESTIMONIALS_2]
  .filter((item) => item.isFeatured)
  .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))

export function Testimonials() {
  const panelRef = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(panelRef)
  const play = isPageInView && isInView

  return (
    <Panel
      ref={panelRef}
      id="testimonials"
      className="before:content-none [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
    >
      <h2 className="sr-only">Testimonials</h2>

      <div className="grid gap-2 py-2">
        <div className="grid gap-2 px-2 sm:grid-cols-2">
          {FEATURED_TESTIMONIALS.map((item) => (
            <a
              key={item.url}
              className="flex"
              href={item.url}
              target="_blank"
              rel="noopener"
            >
              <TestimonialSpotlight
                className="flex-1 bg-accent-muted"
                spotlightSize="50%"
              >
                <TestimonialItem {...item} />
              </TestimonialSpotlight>
            </a>
          ))}
        </div>

        <TestimonialList data={TESTIMONIALS_1} play={play} />
        <TestimonialList data={TESTIMONIALS_2} direction="right" play={play} />
      </div>

      <div className="absolute right-0 bottom-0 z-10 -translate-x-2 -translate-y-2 rounded-lg bg-background">
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
      </div>

      <div className="flex h-px" />
    </Panel>
  )
}

function TestimonialList({
  data,
  direction,
  play,
}: {
  data: TestimonialType[]
  direction?: "right" | "left"
  play?: boolean
}) {
  return (
    <Marquee>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />

      <MarqueeContent direction={direction} autoFill={false} play={play}>
        {data
          .filter((item) => !item.isFeatured)
          .map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-1 h-full max-w-xs min-w-2xs"
              style={item.style}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener"
                className="block h-full rounded-xl inset-ring-1 inset-ring-foreground/10 transition-[background-color] ease-out hover:bg-accent-muted"
              >
                <TestimonialItem {...item} />
              </a>
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
  quote,
  isVerified,
}: TestimonialType) {
  return (
    <Testimonial>
      <TestimonialQuote className="min-h-14 font-serif">
        <p>
          <Twemoji>{quote}</Twemoji>
        </p>
      </TestimonialQuote>

      <TestimonialAuthor>
        <TestimonialAvatar>
          <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
          <TestimonialAvatarRing />
        </TestimonialAvatar>

        <TestimonialAuthorName>
          {authorName}
          {isVerified && (
            <TestimonialVerifiedBadge className="text-info">
              <VerifiedIcon />
            </TestimonialVerifiedBadge>
          )}
        </TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>
    </Testimonial>
  )
}

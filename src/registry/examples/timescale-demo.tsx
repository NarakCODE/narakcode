import Markdown from "react-markdown"

import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/registry/components/timescale"

export default function TimescaleDemo() {
  return (
    <TimescaleIntroScroll>
      <TimescaleRoot className="mt-4">
        <TimescaleHeader>
          <TimescaleAge>Age</TimescaleAge>
          <TimescaleYear>Years</TimescaleYear>
        </TimescaleHeader>

        <TimescaleViewport>
          <TimescaleTrack>
            <TimescaleRail />

            {MILESTONES.map((milestone) => (
              <TimescaleItem key={milestone.year}>
                <TimescaleTick />

                <TimescaleAge>{milestone.year - BIRTH_YEAR}</TimescaleAge>
                <TimescaleYear>{milestone.year}</TimescaleYear>

                {milestone.content && (
                  <TimescaleContent className="typeset typeset-timescale">
                    <Markdown>{milestone.content}</Markdown>
                  </TimescaleContent>
                )}
              </TimescaleItem>
            ))}
          </TimescaleTrack>
        </TimescaleViewport>
      </TimescaleRoot>
    </TimescaleIntroScroll>
  )
}

const BIRTH_YEAR = 2000

type Milestone = {
  year: number
  content?: string
}

const MILESTONES: Milestone[] = [
  {
    year: 2000,
    content: "Started the journey in Phnom Penh, Cambodia.",
  },
  { year: 2001 },
  { year: 2002 },
  { year: 2003 },
  { year: 2004 },
  { year: 2005 },
  {
    year: 2006,
    content: "First time exploring desktop computers and tinkering with software.",
  },
  { year: 2007 },
  { year: 2008 },
  { year: 2009 },
  { year: 2010 },
  { year: 2011 },
  { year: 2012 },
  { year: 2013 },
  {
    year: 2014,
    content: "Wrote my first lines of HTML and CSS, and built a simple static webpage.",
  },
  { year: 2015 },
  { year: 2016 },
  {
    year: 2017,
    content: "Dove into JavaScript, algorithms, and full-stack web fundamentals.",
  },
  { year: 2018 },
  {
    year: 2019,
    content: "Started building interactive web applications with React and TypeScript.",
  },
  { year: 2020 },
  {
    year: 2021,
    content: "Focused on UI engineering, design systems, and fluid interface motion.",
  },
  { year: 2022 },
  {
    year: 2023,
    content: "Launched [narakcode.dev](https://narakcode.dev) to share articles, experiments, and developer tools.",
  },
  {
    year: 2024,
    content: "Started publishing reusable React, Tailwind CSS, and motion components.",
  },
  {
    year: 2025,
    content: `Built the [NarakCODE](https://narakcode.dev/components) component registry with interactive previews and custom UI primitives.

Added developer utilities, curated icon explorer, and multilingual technical writing.`,
  },
  {
    year: 2026,
    content: `Continuously crafting tactile web interfaces, animations, and open-source UI components at [narakcode.dev](https://narakcode.dev).`,
  },
]

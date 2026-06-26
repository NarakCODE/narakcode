"use client"

import { useState } from "react"

import { LineNav } from "@/registry/components/line-nav"

export default function LineNavDemo() {
  const [activeHref, setActiveHref] = useState("#elastic-slider")

  return (
    <LineNav
      className="w-60"
      items={ITEMS}
      activeHref={activeHref}
      scrollActiveIntoView={false}
      onItemClick={(item) => setActiveHref(item.href)}
    />
  )
}

const ITEMS = [
  { title: "Apple Hello Effect", href: "#apple-hello-effect" },
  { title: "Code Block Command", href: "#code-block-command" },
  { title: "Copy Button", href: "#copy-button" },
  { title: "Dot Grid Spotlight", href: "#dot-grid-spotlight" },
  { title: "Elastic Slider", href: "#elastic-slider" },
  { title: "Fluid Gradient Text", href: "#fluid-gradient-text" },
  { title: "Shimmering Text", href: "#shimmering-text" },
  { title: "Slide to Unlock", href: "#slide-to-unlock" },
  { title: "Theme Switcher", href: "#theme-switcher" },
  { title: "TOC Minimap", href: "#toc-minimap" },
]

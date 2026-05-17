"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"

const ICONS = {
  sun: SunIcon,
  moon: MoonIcon,
  monitor: MonitorIcon,
} as const

type IconKey = keyof typeof ICONS

export default function IconSwapDemo() {
  const [icon, setIcon] = useState<IconKey>("sun")

  const Icon = ICONS[icon]

  return (
    <div className="flex flex-col items-center gap-8">
      <Button variant="outline" size="icon-sm">
        <IconSwap>
          <IconSwapItem key={icon}>
            <Icon />
          </IconSwapItem>
        </IconSwap>
      </Button>

      <div className="flex rounded-xl p-1 ring-1 ring-line">
        {Object.keys(ICONS).map((key) => (
          <Button
            key={key}
            className="border-none capitalize"
            size="xs"
            variant={icon === key ? "secondary" : "ghost"}
            onClick={() => setIcon(key as IconKey)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  )
}

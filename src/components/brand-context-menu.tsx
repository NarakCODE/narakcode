"use client"

import { useTiks } from "@rexa-developer/tiks/react"
import { Download, SquareDashed, Type } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { copyText } from "@/utils/copy"

import { ChanhDaiMark, getMarkSVG } from "./chanhdai-mark"
import { getWordmarkSVG } from "./chanhdai-wordmark"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ui/context-menu"

export function BrandContextMenu({ children }: { children: React.ReactNode }) {
  const { success } = useTiks()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-fit dark:liquid-glass-border dark:ring-0">
        <ContextMenuItem
          onClick={() => {
            copyText(getMarkSVG())
            toast.success("Mark as SVG copied")
            success()
          }}
        >
          <ChanhDaiMark />
          Copy Mark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(getWordmarkSVG())
            toast.success("Logotype as SVG copied")
            success()
          }}
        >
          <Type />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem asChild>
          <Link href="/blog/chanhdai-brand">
            <SquareDashed />
            Brand Guidelines
          </Link>
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <a href="https://assets.chanhdai.com/chanhdai-brand.zip" download>
            <Download />
            Download Brand Assets
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

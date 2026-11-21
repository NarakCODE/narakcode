"use client"

import { copyText } from "@/utils/copy"
import {
  ArrowUpRightIcon,
  MailIcon,
  PhoneIcon,
  TriangleDashedIcon,
  TypeIcon,
} from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "@/components/ui/toast"
import { FastLink } from "@/components/fast-link"
import { useTheme } from "@/components/theme-provider"
import { USER } from "@/features/portfolio/data/user"

import { ChanhDaiMark, getMarkSVG } from "./chanhdai-mark"
import { getWordmarkSVG } from "./chanhdai-wordmark"

export function BrandContextMenu({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem render={<a href="/" target="_blank" />}>
          <ArrowUpRightIcon />
          Open Link in New Tab
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => {
            const svg = getMarkSVG(resolvedTheme === "light" ? "#000" : "#fff")
            copyText(svg)
            toast.add({ type: "success", title: "Copied Mark as SVG" })
          }}
        >
          <ChanhDaiMark />
          Copy Mark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            const svg = getWordmarkSVG(
              resolvedTheme === "light" ? "#000" : "#fff"
            )
            copyText(svg)
            toast.add({ type: "success", title: "Copied Logotype as SVG" })
          }}
        >
          <TypeIcon />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuItem render={<FastLink href="/blog/chanhdai-brand" />}>
          <TriangleDashedIcon />
          Brand Guidelines
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => {
            copyText(atob(USER.emailB64))
            toast.add({ type: "success", title: "Copied Email" })
          }}
        >
          <MailIcon />
          Copy Email
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(atob(USER.phoneNumberB64))
            toast.add({ type: "success", title: "Copied Phone" })
          }}
        >
          <PhoneIcon />
          Copy Phone
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

"use client"

import { copyText } from "@/utils/copy"
import { MailIcon, PhoneIcon, TriangleDashedIcon, TypeIcon } from "lucide-react"
import { toast } from "sonner"

import { FastLink } from "@/components/fast-link"
import { useTheme } from "@/components/theme-provider"
import { USER } from "@/features/portfolio/data/user"

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
  const { resolvedTheme } = useTheme()

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            const svg = getMarkSVG(resolvedTheme === "light" ? "#000" : "#fff")
            copyText(svg)
            toast.success("Copied Mark as SVG")
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
            toast.success("Copied Logotype as SVG")
          }}
        >
          <TypeIcon />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <FastLink href="/blog/chanhdai-brand">
            <TriangleDashedIcon />
            Brand Guidelines
          </FastLink>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => {
            copyText(atob(USER.emailB64))
            toast.success("Copied Email")
          }}
        >
          <MailIcon />
          Copy Email
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(atob(USER.phoneNumberB64))
            toast.success("Copied Phone")
          }}
        >
          <PhoneIcon />
          Copy Phone
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

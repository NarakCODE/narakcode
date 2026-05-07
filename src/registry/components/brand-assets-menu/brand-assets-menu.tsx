import { Download, SquareDashed, Type } from "lucide-react"
import { toast } from "sonner"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export type BrandAssetsMenuProps = {
  logomark: React.ReactElement
  logomarkSVG: string
  logotypeSVG: string
  brandGuidelinesURL: string
  brandAssetsURL: string
  children: React.ReactElement
}

export function BrandAssetsMenu({
  logomark,
  logomarkSVG,
  logotypeSVG,
  brandGuidelinesURL,
  brandAssetsURL,
  children,
}: BrandAssetsMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-fit">
        <ContextMenuItem
          onClick={() => {
            copyText(logomarkSVG)
            toast.success("Logomark as SVG copied")
          }}
        >
          {logomark}
          Copy Logomark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(logotypeSVG)
            toast.success("Logotype as SVG copied")
          }}
        >
          <Type />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem asChild>
          <a
            href={brandGuidelinesURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SquareDashed />
            Brand Guidelines
          </a>
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <a
            href={brandAssetsURL}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Download />
            Download Brand Assets
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

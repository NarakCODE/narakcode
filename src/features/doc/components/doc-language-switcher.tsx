import type { Route } from "next"
import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FastLink } from "@/components/fast-link"

type DocLanguageSwitcherProps = {
  href: Route
  label: string
  ariaLabel: string
}

export function DocLanguageSwitcher({
  href,
  label,
  ariaLabel,
}: DocLanguageSwitcherProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="h-7 gap-1.5 border-none px-2 text-sm"
            variant="secondary"
            size="sm"
            nativeButton={false}
            render={<FastLink href={href} aria-label={ariaLabel} />}
          >
            <LanguagesIcon aria-hidden="true" />
            <span>{label}</span>
          </Button>
        }
      />
      <TooltipContent>{ariaLabel}</TooltipContent>
    </Tooltip>
  )
}

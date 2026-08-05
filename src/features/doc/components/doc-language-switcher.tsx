import type { Route } from "next"
import Link from "next/link"
import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"

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
            className="h-7 gap-1.5 border-none px-2 text-[0.8125rem] active:scale-none"
            variant="secondary"
            size="sm"
            asChild
          >
            <Link href={href} aria-label={ariaLabel}>
              <LanguagesIcon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </Button>
        }
      />
      <TooltipContent>{ariaLabel}</TooltipContent>
    </Tooltip>
  )
}

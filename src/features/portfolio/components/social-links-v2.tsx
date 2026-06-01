import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Panel, PanelContent } from "@/features/portfolio/components/panel"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links-v2"

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <PanelContent>
        <ul className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((item) => (
            <li key={item.name}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg border",
                        "bg-background hover:bg-muted dark:border-input dark:hover:bg-input/50",
                        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-foreground [&_svg:not([class*='size-'])]:size-5"
                      )}
                      href={addQueryParams(item.href, UTM_PARAMS)}
                      target="_blank"
                      rel="noopener"
                    >
                      {item.icon}
                      <span className="sr-only">{item.title}</span>
                    </a>
                  }
                />
                <TooltipContent>{item.title}</TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  )
}

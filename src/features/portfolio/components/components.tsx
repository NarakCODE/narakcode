import type { Route } from "next"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FastLink } from "@/components/fast-link"
import {
  ComponentItem,
  ComponentItemDot,
  ComponentItemTitle,
} from "@/app/(app)/(pages)/components/component-item"
import { getComponentDocs } from "@/features/doc/data/documents"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "components"

export function Components() {
  const components = getComponentDocs()

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components</a>
          <PanelTitleSup>({components.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-line" />
          <div className="border-r border-line max-md:hidden" />
        </div>

        <ul className="grid grid-cols-1 overflow-x-clip sm:grid-cols-2 md:grid-cols-3">
          {components.slice(0, 9).map((c) => (
            <li
              key={c.slug}
              className={cn(
                "max-sm:screen-line-bottom",
                "sm:max-md:nth-[2n+1]:screen-line-bottom",
                "md:nth-[3n+1]:screen-line-bottom"
              )}
            >
              <ComponentItem href={`/components/${c.slug}` as Route}>
                <ComponentItemTitle as="h3">
                  {c.metadata.title}
                </ComponentItemTitle>
                {(c.metadata.new || c.metadata.updated) && (
                  <ComponentItemDot type={c.metadata.new ? "new" : "updated"} />
                )}
              </ComponentItem>
            </li>
          ))}
        </ul>
      </div>

      <div className="screen-line-top -mt-px flex justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<FastLink href="/components" />}
        >
          All components
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

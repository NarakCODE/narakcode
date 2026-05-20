import { Markdown } from "@/components/markdown"
import { Prose } from "@/components/ui/typography"
import { USER } from "@/features/portfolio/data/user"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  return (
    <Panel id="about">
      <PanelHeader className="pl-2">
        <PanelTitle>
          {/* <span
            className="mr-2 inline-block font-mono text-base font-normal text-muted-foreground"
            aria-hidden="true"
          >
            01
          </span> */}
          <span className="mr-2 font-mono text-base font-normal text-muted-foreground">
            01
          </span>
          About
        </PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  )
}

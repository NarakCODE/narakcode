import { Prose } from "@/components/ui/typography"
import { Markdown } from "@/components/markdown"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { Testimonials } from "@/features/portfolio/components/testimonials"
import { USER } from "@/features/portfolio/data/user"

const ID = "about"

export function About() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>About</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="screen-line-bottom">
        <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>

      <Testimonials />
      <GitHubContributions />
      <TechStack />
    </Panel>
  )
}

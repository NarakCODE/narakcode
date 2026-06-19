import { Prose } from "@/components/ui/typography"
import { Markdown } from "@/components/markdown"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { HelloTitle } from "@/features/portfolio/components/hello-title"
import {
  Panel,
  PanelContent,
  PanelHeader,
} from "@/features/portfolio/components/panel"
import { Testimonials } from "@/features/portfolio/components/testimonials"
import { USER } from "@/features/portfolio/data/user"

const ID = "hello"

export function Hello() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <HelloTitle />
      </PanelHeader>

      <PanelContent className="screen-line-bottom py-6">
        <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>

      <Testimonials />
      <GitHubContributions />
    </Panel>
  )
}

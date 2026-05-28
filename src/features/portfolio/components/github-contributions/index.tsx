import { Suspense } from "react"

import { Panel } from "@/features/portfolio/components/panel"
import { getGitHubContributions } from "@/features/portfolio/data/github-contributions"

import { GitHubContributionFallback, GitHubContributionGraph } from "./graph"

export function GitHubContributions() {
  const contributions = getGitHubContributions()

  return (
    <Panel className="before:content-none">
      <h3 className="sr-only">GitHub Contributions</h3>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>

      <div className="flex h-px" />
    </Panel>
  )
}

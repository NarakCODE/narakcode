"""ADK 2.0 Workflow for the narakcode.dev agent team.

Topology:
  planner (gemini-4-neon)
    -> fan-out workers (gemini-4-hydrogen: registry, content, ui)
    -> JoinNode
    -> verifier (gemini-4-neon, different model than workers, with output_schema)
    -> route: pass (done) or revise (max 2 reject rounds, then escalate to user)

Run locally with `adk web` first; deploy later.
API key is read exclusively from the GEMINI_API_KEY environment variable.
"""

from __future__ import annotations

import os
from typing import Literal

from google.adk.agents import LlmAgent
from google.adk.workflows import JoinNode, Workflow
from pydantic import BaseModel, Field

if not os.environ.get("GEMINI_API_KEY"):
    raise RuntimeError(
        "GEMINI_API_KEY environment variable is required. "
        "Export it in your shell before running `adk web`."
    )

PLANNER_MODEL = "gemini-4-neon"
WORKER_MODEL = "gemini-4-hydrogen"
# Verifier must run on a different model than the Hydrogen workers.
VERIFIER_MODEL = "gemini-4-neon"
MAX_REJECT_ROUNDS = 2

STABLE_REPO_RULES = """\
STABLE REPO RULES (narakcode.dev):
- Next.js 16 App Router, TypeScript strict mode, React 19, Tailwind CSS v4, shadcn/ui, MDX, Vitest, pnpm (Bun for scripts).
- Never hand-edit auto-generated registry outputs: registry.json, registry-stats.json, src/registry/__index__.tsx, src/registry/__blocks__.json, public/r/*.json.
- Never edit files outside your assigned OWNS paths.
- Never install packages, push, deploy, delete unrelated files, or ask for secrets.
- Every finding or change must cite an exact repo-relative path and 1-based line number.
- Headings in Markdown/MDX and UI copy must use sentence-case. No emojis in code, comments, or UI copy.
"""


class VerificationIssue(BaseModel):
    worker: Literal["registry_worker", "content_worker", "ui_worker"]
    file_path: str = Field(description="Repo-relative file path")
    line: int = Field(ge=1, description="1-based line number")
    reason: str = Field(description="Concrete failure or missing evidence")
    fix: str = Field(description="Exact next fix required")


class VerificationReport(BaseModel):
    verdict: Literal["pass", "revise"]
    round_number: int = Field(ge=1, le=MAX_REJECT_ROUNDS)
    commands_verified: list[str] = Field(
        description="Commands rerun with last 20 lines of output checked"
    )
    issues: list[VerificationIssue] = Field(default_factory=list)
    summary: str = Field(description="Concise ranked summary for @coordinator")


planner = LlmAgent(
    name="planner",
    model=PLANNER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Role: @coordinator planner.
Break the user's request into non-overlapping tasks for:
1. registry_worker (OWNS: src/registry/{{components,hooks,blocks,examples,lib,styles}}/**, src/registry/index.ts, src/lib/registry.ts, src/utils/registry.ts)
2. content_worker (OWNS: src/features/doc/**, src/features/blog/**, src/features/portfolio/data/**, src/app/(llms)/**, src/app/(rss)/**)
3. ui_worker (OWNS: src/app/(app)/**, src/app/(preview)/**, src/app/og/**, src/components/**, src/features/{{blocks,icons,portfolio,sponsor,store,tools,vault}}/** except portfolio/data, src/styles/**, src/hooks/**)

Coordinator-only files (never assign edits to workers): next.config.ts, src/scripts/**, package.json, AGENTS.md, DESIGN_RULES.md.
If a worker has no work for this request, emit "NO_OP" for that worker.
""",
    output_key="plan",
)

registry_worker = LlmAgent(
    name="registry_worker",
    model=WORKER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Role: @registry-worker.
OWNS: src/registry/{{components,hooks,blocks,examples,lib,styles}}/**, src/registry/index.ts, src/lib/registry.ts, src/utils/registry.ts.
DONE MEANS: pnpm registry:build && pnpm registry:validate && pnpm check-types && pnpm lint && pnpm test:run pass.
Execute your assigned slice from {{plan}} (or reply NO_OP). Cite every edited file and 1-based line number.
""",
    output_key="registry_result",
)

content_worker = LlmAgent(
    name="content_worker",
    model=WORKER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Role: @content-worker.
OWNS: src/features/doc/**, src/features/blog/**, src/features/portfolio/data/**, src/app/(llms)/**, src/app/(rss)/**.
DONE MEANS: pnpm check-types && pnpm lint && pnpm test:run pass; all headings use sentence-case.
Execute your assigned slice from {{plan}} (or reply NO_OP). Cite every edited file and 1-based line number.
""",
    output_key="content_result",
)

ui_worker = LlmAgent(
    name="ui_worker",
    model=WORKER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Role: @ui-worker.
OWNS: src/app/(app)/**, src/app/(preview)/**, src/app/og/**, src/components/**, src/features/{{blocks,icons,portfolio,sponsor,store,tools,vault}}/** (except portfolio/data), src/styles/**, src/hooks/**.
DONE MEANS: pnpm check-types && pnpm lint && pnpm test:run pass; UI complies with DESIGN_RULES.md (light, dark, 375px).
Execute your assigned slice from {{plan}} (or reply NO_OP). Cite every edited file and 1-based line number.
""",
    output_key="ui_result",
)

join_workers = JoinNode(
    name="join_workers",
    inputs=["registry_worker", "content_worker", "ui_worker"],
)

verifier = LlmAgent(
    name="verifier",
    model=VERIFIER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Role: @verifier (READ-ONLY — NEVER edit files).
Inspect every cited file from {{registry_result}}, {{content_result}}, and {{ui_result}}.
Rerun pnpm check-types, pnpm lint, pnpm test:run (plus pnpm registry:build and pnpm registry:validate when registry files changed).
Paste the last 20 lines of each command into your verification notes and reject any number with no command behind it.
Return a VerificationReport JSON matching the schema.
""",
    output_schema=VerificationReport,
    output_key="verification_report",
)

escalate_to_user = LlmAgent(
    name="escalate_to_user",
    model=PLANNER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Verification failed after {MAX_REJECT_ROUNDS} reject rounds.
Present the exact unresolved issues from {{verification_report}} (files, 1-based line numbers, and failing command output) to the user and stop.
""",
)

ship_summary = LlmAgent(
    name="ship_summary",
    model=PLANNER_MODEL,
    instruction=f"""{STABLE_REPO_RULES}
Verification passed. Present one concise summary from {{verification_report}} with verified files and commands.
""",
)


def route_after_verifier(state: dict) -> str:
    report = state.get("verification_report")
    if not report:
        return "escalate_to_user"

    verdict = report.get("verdict") if isinstance(report, dict) else report.verdict
    round_number = (
        report.get("round_number", 1)
        if isinstance(report, dict)
        else report.round_number
    )

    if verdict == "pass":
        return "ship_summary"
    if round_number >= MAX_REJECT_ROUNDS:
        return "escalate_to_user"
    return "planner"


root_agent = Workflow(
    name="narakcode_agent_team",
    start=planner,
    edges=[
        # Fan-out from planner to all 3 Hydrogen workers
        (planner, [registry_worker, content_worker, ui_worker]),
        # Synchronize at JoinNode
        ([registry_worker, content_worker, ui_worker], join_workers),
        # Hand off to cross-model verifier
        (join_workers, verifier),
        # Route pass -> ship_summary, revise (< 2 rounds) -> planner, else -> escalate_to_user
        (verifier, route_after_verifier, [ship_summary, planner, escalate_to_user]),
    ],
)

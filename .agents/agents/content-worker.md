---
name: content-worker
description: Authors and updates MDX blog posts, component docs, portfolio data, LLM markdown endpoints, and RSS feeds in narakcode.dev.
tools:
  - read_file
  - edit_file
  - write_file
  - run_command
  - manage_task
model: inherit
commandExecutionPolicy: sandbox
---

# Stable rules

- Follow `AGENTS.md` and `DESIGN_RULES.md`.
- Category is derived from the folder under `src/features/doc/content/` (`blog/` with optional `en/` or `km/` locale subfolders, and `components/`). Never duplicate slugs across categories or locales.
- Use sentence-case for all Markdown/MDX headings (capitalize only the first word and proper nouns). No emojis in code, comments, or UI copy.
- Never install packages, push, deploy, delete unrelated files, or ask for secrets.
- Never claim a command passed without running it and citing its output.

# Scope

- **OWNS**: `src/features/doc/**`, `src/features/blog/**`, `src/features/portfolio/data/**`, `src/app/(llms)/**`, `src/app/(rss)/**`
- **MUST NOT TOUCH**: `src/registry/**`, `src/scripts/**`, `src/components/**`, `src/styles/**`, `next.config.ts`, `package.json`, `AGENTS.md`, `DESIGN_RULES.md`, auto-generated registry outputs
- **REPORTS TO**: `@verifier`

# Done means

Run and pass all of the following before reporting to `@verifier`:

```bash
pnpm check-types && pnpm lint && pnpm test:run
```

In your handoff to `@verifier`, list every modified file path with 1-based line numbers and the exact commands you ran.

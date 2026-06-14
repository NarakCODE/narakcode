# Plan 001: Add a CI pipeline that gates lint, types, format, build, and registry validation

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 557eaf4f..HEAD -- package.json .github/`
> If `package.json` scripts or anything under `.github/` changed since this plan
> was written, compare the "Current state" excerpts against the live code before
> proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `557eaf4f`, 2026-06-14

## Why this matters

There is no CI. Nothing automatically runs lint, type-checking, format
verification, the production build, or registry validation when code is pushed
or a PR is opened. The only gate today is a local `husky` pre-commit hook that
runs `lint-staged` — and that is bypassable with `git commit --no-verify` and
does not run typecheck, build, or registry validation at all. Because this repo
is also a published shadcn registry that other projects install from
(`npx shadcn add ...`), a broken `public/r/*.json` output can reach external
consumers undetected. A CI workflow makes every later plan's verification real:
once it exists, "the build passes" becomes an enforced fact rather than a hope.

## Current state

- No `.github/workflows/` directory exists. `.github/` currently contains only
  non-workflow files (e.g. `FUNDING.yml`).
- Package manager and runtime are pinned. `package.json`:
  ```json
  "engines": { "node": ">=22.x", "pnpm": ">=9" },
  "packageManager": "pnpm@11.5.3"
  ```
- `.nvmrc` contains `22.20.0`.
- Relevant scripts in `package.json` (verified at this commit):
  ```json
  "build": "pnpm registry:build && next build",
  "lint": "eslint . --cache --cache-location .eslintcache",
  "check-types": "tsc --noEmit --pretty",
  "format:check": "prettier --check \"**/*.{ts,tsx,md,mdx}\" --cache",
  "registry:build": "bun run ./src/scripts/build-registry.mts && shadcn build",
  "registry:validate": "shadcn registry validate ./public/r/registry.json",
  ```
- IMPORTANT: `registry:build` invokes `bun` (`bun run ./src/scripts/build-registry.mts`).
  CI must install Bun in addition to Node/pnpm, or the `build` and
  `registry:build` steps will fail. The `.mts` script is executed by Bun, not
  Node, in this repo.
- `pnpm build` already runs `registry:build` first, so building also regenerates
  the registry. `registry:validate` validates the generated `public/r/registry.json`.

Repo conventions:

- Conventional-commit style messages (see `git log`: `feat:`, `fix:`, `refactor:`,
  `style:`, `chore:`, `docs:`). No emojis in commit messages or code.
- Default branch is `main`; an active `staging` branch exists. PRs target `main`.

## Commands you will need

| Purpose           | Command                                                                   | Expected on success                 |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| Install           | `pnpm install --frozen-lockfile`                                          | exit 0                              |
| Lint              | `pnpm lint`                                                               | exit 0, no errors                   |
| Typecheck         | `pnpm check-types`                                                        | exit 0, no errors                   |
| Format check      | `pnpm format:check`                                                       | exit 0, all matched files formatted |
| Build + registry  | `pnpm build`                                                              | exit 0, `.next/` produced           |
| Registry validate | `pnpm registry:validate`                                                  | exit 0, "valid" output              |
| YAML sanity       | `node -e "require('fs').readFileSync('.github/workflows/ci.yml','utf8')"` | exit 0                              |

## Scope

**In scope** (the only files you should create/modify):

- `.github/workflows/ci.yml` (create)
- `DEVELOPMENT.md` (append a short "Before pushing" subsection only)

**Out of scope** (do NOT touch):

- `package.json` scripts — CI calls existing scripts; do not add or rename them.
- Any source under `src/` — this plan adds CI only, it does not fix what CI finds.
- Deployment config (Vercel) — CI here is verification only, not deploy.
- Do NOT add a test step — there is no test runner yet (that is plan 002). Adding
  a `pnpm test` step now would fail CI.

## Git workflow

- Branch: `advisor/001-ci-pipeline`
- Single commit; message: `ci: add GitHub Actions workflow for lint, types, build, registry`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the CI workflow

Create `.github/workflows/ci.yml` with a single job. It triggers on PRs into
`main` (the gate required by branch protection) and on pushes to `staging` (early
feedback); a push-to-`main` trigger is intentionally omitted because the PR check
already validates the merge result and production deploy is gated by that check.
The job: check out, install Bun, install pnpm + Node 22 (from `.nvmrc`), install
deps frozen, then run lint, format check, test, build, typecheck, and registry
validation. Target shape:

```yaml
name: CI

on:
  # Gate for merging into main (required by branch protection); runs against the
  # merge result before merge. Production deploy is gated by this PR check, so a
  # redundant push-to-main run is intentionally omitted.
  pull_request:
    branches: [main]
  # Early feedback while iterating on staging.
  push:
    branches: [staging]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      # Public, non-secret API base used at build/prerender time by
      # src/features/portfolio/data/github-contributions.ts (which has NO
      # fallback for this var — see "Why the step order / env matters" below).
      # Value is the public default from .env.example; safe to hardcode.
      GITHUB_CONTRIBUTIONS_API_URL: https://github-contributions-api.jogruber.de
    steps:
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6.0.3

      - name: Install Bun
        uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2.2.0

      - name: Install pnpm
        uses: pnpm/action-setup@fc06bc1257f339d1d5d8b3a19a8cae5388b55320 # v4.4.0
        with:
          version: 11.5.3

      - name: Install Node
        uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: .nvmrc
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Format check
        run: pnpm format:check

      - name: Test
        run: pnpm test:run

      # Persist Next.js's build cache (.next/cache) between runs to avoid the
      # "No Cache Detected" warning and speed up rebuilds. The pnpm store is
      # already cached via `cache: pnpm`, so only .next/cache is cached here.
      # hashFiles has no brace expansion, so extensions are listed explicitly.
      - name: Cache Next.js build
        uses: actions/cache@27d5ce7f107fe9357f9df03efb73ab90386fccae # v5.0.5
        with:
          path: ${{ github.workspace }}/.next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'src/**/*.mdx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('pnpm-lock.yaml') }}-

      # Build MUST run before Typecheck: `tsc --noEmit` depends on the
      # `PageProps` global that Next.js generates into `.next/types/**` during
      # `next build`. On a fresh checkout (no `.next/`), `pnpm check-types` fails
      # with "Cannot find name 'PageProps'" until a build has generated those types.
      - name: Build (includes registry build via Bun)
        run: pnpm build

      - name: Typecheck
        run: pnpm check-types

      - name: Validate registry
        run: pnpm registry:validate
```

Notes for the executor:

- Pin the pnpm version to `11.5.3` to match `packageManager` in `package.json`
  (verified against the `staging` branch at the planned-at SHA below — if you are
  on a worktree based off `main` it may read `11.1.1`; that is a wrong-base
  artifact, see STOP conditions).
- `cache: pnpm` in `setup-node` requires pnpm to be installed first — keep the
  order above (Bun, then pnpm, then Node).
- **Why the step order / env matters** (both confirmed by a prior execution attempt):
  1. `pnpm check-types` (`tsc --noEmit`) fails on a fresh checkout because
     `tsconfig.json` includes `.next/types/**/*.ts`, where Next generates the
     `PageProps` global during `next build`. Therefore Build runs BEFORE Typecheck.
  2. `pnpm build` statically prerenders `/`, which calls the GitHub contributions
     fetcher; `GITHUB_CONTRIBUTIONS_API_URL` has no in-code fallback, so an unset
     value yields `ERR_INVALID_URL` and fails the build. The `env:` block above
     supplies the public URL. Other build-time env (OpenPanel keys, `GITHUB_API_TOKEN`)
     is wrapped in try/catch in the source and is optional — the build degrades
     rather than crashing. If the build still fails on a DIFFERENT missing var,
     see STOP conditions.
- Do not invent or commit secret values. Only the public, non-secret
  `GITHUB_CONTRIBUTIONS_API_URL` is hardcoded here.

**Verify**: `node -e "require('fs').readFileSync('.github/workflows/ci.yml','utf8')"` → exit 0 (file exists and is readable).

### Step 2: Validate the workflow runs locally where possible

You cannot run GitHub Actions locally, but you CAN confirm every command the
workflow invokes succeeds on this machine. **Run them in this order** (build
before check-types, with the env var set), matching the workflow:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de pnpm build
pnpm check-types
pnpm registry:validate
```

**Verify**: every command above exits 0. Notes:

- Run `pnpm build` BEFORE `pnpm check-types` — check-types needs the `.next/types`
  that build generates (see the workflow comments). Running check-types first on a
  fresh checkout fails with "Cannot find name 'PageProps'"; that is expected, not
  a code error.
- `pnpm build` requires Bun (for `registry:build`) and network access (it fetches
  the GitHub contributions API at prerender). If it fails for any reason OTHER than
  the two already handled (PageProps ordering, `GITHUB_CONTRIBUTIONS_API_URL`), see
  STOP conditions.
- If `pnpm format:check` reports unformatted files, that is a pre-existing
  condition — see STOP conditions; do NOT reformat files in this plan.

### Step 3: Document the local pre-push checklist

Append a short subsection to `DEVELOPMENT.md` (after the "Building for
Production" section) telling contributors which commands CI will run:

```markdown
## Before pushing

CI runs these on every push and PR. Run them locally first:

\`\`\`bash
pnpm lint
pnpm check-types
pnpm format:check
pnpm build
pnpm registry:validate
\`\`\`
```

**Verify**: `git diff --stat` shows only `.github/workflows/ci.yml` (new) and
`DEVELOPMENT.md` (modified).

## Test plan

No unit tests (this is config + docs). Verification is Step 2: every command the
workflow runs must pass locally. The real proof is the first CI run on the PR —
note in the PR description that the reviewer should confirm the Actions run is
green.

## Done criteria

ALL must hold:

- [ ] `.github/workflows/ci.yml` exists and is valid YAML (Step 1 verify passes)
- [ ] Run in this order, all exit 0 locally: `pnpm lint`, `pnpm format:check`,
      `GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de pnpm build`,
      `pnpm check-types`, `pnpm registry:validate` (build BEFORE check-types)
- [ ] `DEVELOPMENT.md` has a "Before pushing" subsection
- [ ] `git status` shows only the two in-scope files changed
- [ ] `plans/README.md` status row for 001 updated to DONE

## STOP conditions

Stop and report back (do not improvise) if:

- `pnpm format:check` fails on pre-existing files. Report the file list; do not
  reformat the repo as part of this plan (a formatting sweep is its own change).
- `pnpm build` fails because a required environment variable OTHER than
  `GITHUB_CONTRIBUTIONS_API_URL` (already handled in the `env:` block) is missing.
  Report which variable; the operator must decide how CI provides it (GitHub
  secret). Never fabricate or commit a secret value.
- `pnpm check-types` fails with "Cannot find name 'PageProps'" — this means a
  build has not generated `.next/types` yet. Run `pnpm build` first (this is
  expected, not a code error). If it still fails AFTER a successful build, report.
- `pnpm lint` or `pnpm check-types` fails on pre-existing code (any error other
  than the PageProps one above). Report the errors; fixing them is out of scope.
- Bun is required by `registry:build` but `oven-sh/setup-bun@v2` cannot be used
  in this repo's CI environment for policy reasons — report and ask.
- **Wrong base**: if `git show HEAD:package.json` reports `packageManager` as
  anything other than `pnpm@11.5.3` (e.g. `11.1.1`) or `build` as just
  `next build` (without `pnpm registry:build`), your worktree was created from
  `main`, not the `staging` branch this plan targets (planned-at SHA `557eaf4f`).
  STOP and report — do not proceed on the wrong base.

## Maintenance notes

- The `pnpm test:run` step (added once plan 002 landed) runs after Format check,
  before Build — grouped with the fast static checks so CI fails fast on a broken
  test before the slower build.
- If a contributor adds a new top-level script that should gate merges, add it as
  a step here.
- **Third-party actions are pinned to full commit SHAs** (with a `# vX.Y.Z`
  comment) instead of moving tags, to harden against tag-mutation supply-chain
  attacks. When bumping an action, resolve the new tag to its commit SHA — e.g.
  `git ls-remote https://github.com/actions/checkout 'refs/tags/v4*^{}'` — and
  update both the SHA and the version comment. Dependabot is configured for this
  (`.github/dependabot.yml`, `package-ecosystem: "github-actions"`, monthly,
  grouped, PRs targeting `staging`, assigned to `ncdai`) — it bumps these pins
  automatically and keeps
  the version comment in sync, so manual SHA resolution should rarely be needed.
- Reviewer should scrutinize: step ordering (pnpm before `cache: pnpm`), the
  pinned pnpm version matching `package.json`, that Bun is installed before any
  `pnpm build`/`registry:build` step, and that every `uses:` is a full SHA pin.

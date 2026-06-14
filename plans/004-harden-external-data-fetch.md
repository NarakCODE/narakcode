# Plan 004: Harden external data fetches against non-OK responses

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat d23bfc1b..HEAD -- src/features/portfolio/data/github-contributions.ts src/features/portfolio/components/profile-activity-mosaic-cover/index.tsx src/registry/components/github-contributions/lib/get-cached-contributions.ts`
> If any changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as a
> STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `d23bfc1b`, 2026-06-14 (refreshed; the three target files
  are unchanged since `557eaf4f`)

## Why this matters

Two GitHub-contributions fetchers call `res.json()` without first checking
`res.ok`. When the upstream API returns a non-200 (downtime, rate limit, 5xx),
the error body is parsed as if it were the success shape and
`data.contributions` is `undefined`, which is then returned and rendered. The
result is a silently broken contribution graph with no fallback and no signal.
A sibling fetcher in the same codebase already does this correctly — this plan
brings the two unguarded ones up to that standard.

Separately, both app-side fetchers interpolate
`process.env.GITHUB_CONTRIBUTIONS_API_URL` into the request URL with **no
fallback**. When that env var is unset, the URL becomes `undefined/v4/...` and
`fetch` throws `ERR_INVALID_URL` before any `res.ok` check can run — this is what
fails the production build / CI when the var isn't provided (the workflow in plan
001 currently hardcodes the value as a workaround). The registry copy already
guards this with `|| "https://github-contributions-api.jogruber.de"`. This plan
mirrors that fallback into both app-side fetchers so the build no longer depends
on the env var being set.

Note on de-duplication (originally folded in as part of this finding): the two
app-side contribution fetchers were examined for merging.
`src/features/portfolio/data/github-contributions.ts` fetches last-year data for
the contribution graph; `src/features/portfolio/components/profile-activity-mosaic-cover/index.tsx`
fetches a multi-year window and builds a 480-cell grid. They have different query
shapes, return shapes, cache keys, and revalidate windows, so they are NOT
duplicates and should NOT be merged. The real, narrow fixes are error handling
and the missing URL fallback.

## Current state

Pattern to match for the `res.ok` handling — its error check is already correct,
but note it is ALSO missing the URL fallback (Step 3 fixes only that one line;
do NOT touch its `res.ok` throw)
(`src/features/portfolio/components/profile-activity-mosaic-cover/index.tsx`, lines 72–82):

```ts
const res = await fetch(
  `${process.env.GITHUB_CONTRIBUTIONS_API_URL}/v4/${username}?${yearQueries}` // <-- no URL fallback
)
if (!res.ok) {
  throw new Error(`Failed to fetch GitHub Contributions: ${res.statusText}`)
}
const { contributions } = (await res.json()) as GitHubContributionsResponse
```

(Also correct already: `src/features/portfolio/data/insights.ts` returns `null`
on `!res.ok` and uses a hardcoded URL — leave it entirely.)

The fallback to mirror, from the registry copy
(`src/registry/components/github-contributions/lib/get-cached-contributions.ts:102`):
`process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de"`.

Target 1 — `src/features/portfolio/data/github-contributions.ts` (full file):

```ts
import "server-only"

import { unstable_cache } from "next/cache"

import { GITHUB_USERNAME } from "@/config/site"
import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = { contributions: Activity[] }

export const getGitHubContributions = unstable_cache(
  async () => {
    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL}/v4/${GITHUB_USERNAME}?y=last` // <-- no URL fallback
    )
    const data = (await res.json()) as GitHubContributionsResponse // <-- no res.ok check
    return data.contributions
  },
  ["github-contributions"],
  { revalidate: 86400 }
)
```

This feeds `src/features/portfolio/components/github-contributions/index.tsx`,
which passes the promise into a `<Suspense>` boundary where the child calls
`use(contributions)` (React 19 streaming). The child renders the activity graph;
returning an empty array degrades gracefully to an empty graph.

Target 2 — `src/registry/components/github-contributions/lib/get-cached-contributions.ts`
(full file):

```ts
import { unstable_cache } from "next/cache"

import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = { contributions: Activity[] }

export const getCachedContributions = unstable_cache(
  async (username: string) => {
    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL || `https://github-contributions-api.jogruber.de`}/v4/${username}?y=last`
    )
    const data = (await res.json()) as GitHubContributionsResponse // <-- no res.ok check
    return data.contributions
  },
  ["github-contributions"],
  { revalidate: 86400 }
)
```

IMPORTANT: Target 2 is a **distributed registry component** — consumers install
it via `npx shadcn add`. It has a copy under `src/registry/transformed/` that is
**autogenerated**. You edit the source under `src/registry/components/...` and
regenerate; you never hand-edit the `transformed/` copy.

## Decision: degrade vs. throw

These two fetchers are consumed through a `<Suspense>` boundary (no error
boundary is set up around them). Throwing would surface as an unhandled error in
that subtree. To degrade gracefully and match the "empty graph" fallback intent,
**return an empty array on a non-OK response** (do not throw). This differs from
the mosaic-cover fetcher (which throws) on purpose: the mosaic build step indexes
into the array and an empty array there is handled differently; for these two,
empty-array is the safe, visible-but-not-crashing outcome.

## Commands you will need

| Purpose           | Command                  | Expected on success                             |
| ----------------- | ------------------------ | ----------------------------------------------- |
| Install           | `pnpm install`           | exit 0                                          |
| Typecheck         | `pnpm check-types`       | exit 0                                          |
| Lint              | `pnpm lint`              | exit 0                                          |
| Registry build    | `pnpm registry:build`    | exit 0; regenerates `transformed/` + `public/r` |
| Registry validate | `pnpm registry:validate` | exit 0                                          |
| Build             | `pnpm build`             | exit 0                                          |

## Scope

**In scope**:

- `src/features/portfolio/data/github-contributions.ts` (add `res.ok` guard + URL fallback)
- `src/features/portfolio/components/profile-activity-mosaic-cover/index.tsx`
  (**URL fallback ONLY** — do NOT change its existing `res.ok` throw or anything else)
- `src/registry/components/github-contributions/lib/get-cached-contributions.ts`
  (add `res.ok` guard; it already has the URL fallback)
- Regenerated outputs from `pnpm registry:build` (commit them, do not hand-edit):
  `src/registry/transformed/components/github-contributions/lib/get-cached-contributions.ts`,
  `public/r/*.json`, `src/registry/registry.autogenerated.json` (only if the build changes them).

**Out of scope** (do NOT touch):

- `insights.ts` — already correct (guards `res.ok`, hardcoded URL).
- The `res.ok` throw in `profile-activity-mosaic-cover/index.tsx` — only its fetch
  URL changes; leave the error handling and grid logic alone.
- The de-duplication idea — explicitly rejected above; do not merge the fetchers.
- `src/registry/transformed/...` by hand — only via `registry:build`.
- `.github/workflows/ci.yml` — the `GITHUB_CONTRIBUTIONS_API_URL` env entry there
  becomes redundant after this plan, but removing it is a separate follow-up (see
  Maintenance notes); do not touch CI here.

## Git workflow

- Branch: `advisor/004-harden-external-data-fetch`
- Commit message: `fix: harden GitHub contributions fetchers (res.ok guard + URL fallback)`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Guard Target 1 + add URL fallback

In `src/features/portfolio/data/github-contributions.ts`:

1. Add the URL fallback to the fetch (mirror the registry copy), so an unset env
   var no longer produces an invalid URL:

```ts
const res = await fetch(
  `${process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de"}/v4/${GITHUB_USERNAME}?y=last`
)
```

2. After the `fetch`, guard the response:

```ts
if (!res.ok) {
  return []
}
const data = (await res.json()) as GitHubContributionsResponse
return data.contributions ?? []
```

(The `?? []` also guards a 200 with an unexpected body.)

**Verify**: `pnpm check-types` → exit 0.

### Step 2: Guard Target 2 (registry source)

Apply the same guard in
`src/registry/components/github-contributions/lib/get-cached-contributions.ts`:

```ts
if (!res.ok) {
  return []
}
const data = (await res.json()) as GitHubContributionsResponse
return data.contributions ?? []
```

**Verify**: `pnpm check-types` → exit 0.

### Step 3: Add URL fallback to the mosaic-cover fetcher

In `src/features/portfolio/components/profile-activity-mosaic-cover/index.tsx`,
change ONLY the fetch URL to add the same fallback (leave the `if (!res.ok) throw`
and everything else untouched):

```ts
const res = await fetch(
  `${process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de"}/v4/${username}?${yearQueries}`
)
```

**Verify**: `pnpm check-types` → exit 0; `git diff src/features/portfolio/components/profile-activity-mosaic-cover/index.tsx`
shows only the one URL line changed.

### Step 4: Regenerate the registry

```bash
pnpm registry:build
pnpm registry:validate
```

This regenerates the `transformed/` mirror and `public/r` outputs from your
edited source.

**Verify**: `registry:validate` exits 0. `git status` shows the regenerated
`transformed/.../get-cached-contributions.ts` now contains the same guard.

### Step 5: Full build (no env var set — this proves the fallback works)

Run the build WITHOUT `GITHUB_CONTRIBUTIONS_API_URL` set (and with no `.env.local`
defining it) to confirm the fallback removed the build-time env dependency:

```bash
env -u GITHUB_CONTRIBUTIONS_API_URL pnpm build
```

**Verify**: `pnpm build` → exit 0 (no `ERR_INVALID_URL`); `pnpm lint` → exit 0.
Note: the build still performs a live fetch to the public fallback API, so it
needs network access; if the API itself is unreachable, the `res.ok`/`?? []`
guards degrade the graph to empty rather than crashing the data-layer fetcher
(the mosaic-cover fetcher still throws on a non-OK response by design).

## Test plan

- If plan 002 (Vitest) has landed, this is hard to unit-test directly because the
  fetchers are wrapped in `unstable_cache` and use `server-only`. Do NOT spend
  effort mocking `next/cache` for this small change. Instead, the verification is
  the typecheck + build + registry validate gates above.
- Manual sanity (optional, requires network): with a deliberately wrong
  `GITHUB_CONTRIBUTIONS_API_URL` in `.env.local`, the contribution graph should
  render empty rather than crash. Do not commit the changed env value.

## Done criteria

ALL must hold:

- [ ] `github-contributions.ts` and the registry `get-cached-contributions.ts`
      both check `res.ok` and return `[]` on non-OK, with `?? []` guard
- [ ] All three fetchers (data-layer, mosaic-cover, registry copy) interpolate the
      URL with the `|| "https://github-contributions-api.jogruber.de"` fallback
- [ ] `mosaic-cover/index.tsx` diff is the single URL line only (its `res.ok` throw unchanged)
- [ ] `pnpm registry:build && pnpm registry:validate` exit 0
- [ ] The regenerated `transformed/` copy reflects the `res.ok` guard
- [ ] `env -u GITHUB_CONTRIBUTIONS_API_URL pnpm build` exits 0 (no `ERR_INVALID_URL`)
- [ ] `pnpm check-types`, `pnpm lint` exit 0
- [ ] No files outside the in-scope list changed by hand (`git status`)
- [ ] `plans/README.md` status row for 004 updated to DONE

## STOP conditions

Stop and report back (do not improvise) if:

- `pnpm registry:build` requires Bun and Bun is unavailable — report (the
  `registry:build` script runs `bun run ./src/scripts/build-registry.mts`).
- `registry:build` changes far more files than the one contributions component
  (i.e. it appears to regenerate unrelated entries) — report the diff before
  committing; do not commit a sprawling regeneration you can't explain.
- The `transformed/` copy does NOT pick up your change after `registry:build` —
  that means the build pipeline doesn't transform this file the way assumed; stop
  and report rather than hand-editing `transformed/`.
- `env -u GITHUB_CONTRIBUTIONS_API_URL pnpm build` STILL fails with `ERR_INVALID_URL`
  after Steps 1 and 3 — a fetcher that interpolates the env URL was missed. Search
  `grep -rn "GITHUB_CONTRIBUTIONS_API_URL" src` for any site without the `||` fallback,
  report it, and do not work around it by re-adding the env var.

## Maintenance notes

- Any future external `fetch` in a data/loader file should follow the
  `if (!res.ok) ...` pattern from `profile-activity-mosaic-cover/index.tsx` and
  include a URL fallback rather than interpolating a bare env var.
- **Follow-up after this lands**: the `env: GITHUB_CONTRIBUTIONS_API_URL` block in
  `.github/workflows/ci.yml` (added by plan 001 to work around the missing
  fallback) is now redundant — the build defaults to the public API on its own.
  You may remove that env entry in a small CI cleanup commit. Keeping it is also
  fine (it lets CI point at a custom API host); it is no longer required.
- The fallback URL string is now inlined in three files. If it needs to change,
  update all three (or extract a shared const for the two app-side files — the
  registry copy must stay self-contained for distribution and keep its inline value).
- If an error boundary is later added around the contribution graph, revisit
  whether throwing (with a visible error state) is preferable to the silent
  empty-array degrade chosen here.
- Reviewer should scrutinize: that the `transformed/` change came from
  `registry:build` and was not hand-edited, and that the degrade choice
  (empty array, not throw) is acceptable for the distributed component's consumers.

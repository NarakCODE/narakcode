# Plan 002: Establish a test runner and characterization tests for pure logic

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 557eaf4f..HEAD -- src/utils/ src/features/doc/data/documents.ts package.json`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch, treat
> it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M (start S — first tests are quick once the runner is wired)
- **Risk**: LOW
- **Depends on**: none (but pairs with 001 — add the test step to CI after this lands)
- **Category**: tests
- **Planned at**: commit `557eaf4f`, 2026-06-14

## Why this matters

The repo has zero automated tests and no test runner. The only verification is
`pnpm build`. That means any refactor — including the other plans in this set —
ships with no safety net, and pure logic that is easy to get subtly wrong (URL
manipulation, registry-URL construction, doc sorting and neighbour lookup) has no
regression guard. This plan installs a runner and writes the first
characterization tests against pure, dependency-free functions. It deliberately
starts with the cheapest, highest-confidence targets so the test suite exists and
is green before anyone needs it for a risky change.

## Current state

No `*.test.*`/`*.spec.*` files exist; `package.json` has no `test` script and no
test-runner dependency. TypeScript is strict (`tsconfig.json`). Scripts run with
both Node and Bun (`registry:build` uses `bun`), but app code is Node/Next.

Pure functions chosen as first targets (all verified at this commit):

`src/utils/url.ts`:

```ts
export function urlToName(url: string) {
  return url.replace(/(^\w+:|^)\/\//, "")
}
export function addQueryParams(
  urlString: string,
  query: Record<string, string>
): string {
  try {
    const url = new URL(urlString)
    for (const [key, value] of Object.entries(query))
      url.searchParams.set(key, value)
    return url.toString()
  } catch {
    return urlString // returns input unchanged on invalid URL
  }
}
```

`src/utils/registry.ts` (depends on `registryConfig` from `@/config/registry`):

```ts
export function getRegistryItemUrl(item: string) {
  return registryConfig.namespaceUrl.replace("{name}", item)
}
export function getRegistryItemUrls(...items: string[]) {
  return items.map(getRegistryItemUrl)
}
export function getRegistryItemNamespace(item: string) {
  return `${registryConfig.namespace}/${item}`
}
```

`src/features/doc/data/documents.ts` — `findNeighbour` is pure (operates on an
array argument, no fs):

```ts
export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length
  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      }
    }
  }
  return { previous: null, next: null }
}
```

(Do NOT try to unit-test `getAllDocs`/`getDocBySlug` here — they read the
filesystem and use React `cache()`; that is a future integration-test target, not
this plan.)

Conventions: kebab-case filenames; TypeScript strict; path alias `@/` → `src/`
(see `tsconfig.json` `paths`).

## Commands you will need

| Purpose   | Command            | Expected on success           |
| --------- | ------------------ | ----------------------------- |
| Install   | `pnpm install`     | exit 0                        |
| Test      | `pnpm test`        | all tests pass                |
| Test once | `pnpm test -- run` | runs once (non-watch), passes |
| Typecheck | `pnpm check-types` | exit 0                        |
| Lint      | `pnpm lint`        | exit 0                        |

## Steps

### Step 1: Add Vitest

Install Vitest as a dev dependency and add scripts. Use Vitest (it works without
a bundler, supports TS + ESM, and matches the repo's modern toolchain).

```bash
pnpm add -D vitest
```

Add to `package.json` scripts (do not remove existing scripts):

```json
"test": "vitest",
"test:run": "vitest run"
```

Create `vitest.config.ts` at repo root so the `@/` alias resolves:

```ts
import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
})
```

**Verify**: `pnpm test:run` → exits 0 with "No test files found" (runner works,
no tests yet). If it errors on config, fix before continuing.

### Step 2: Test `src/utils/url.ts`

Create `src/utils/url.test.ts`:

- `urlToName`: strips `https://`, `http://`, and protocol-relative `//`; leaves a
  bare host unchanged. Cases: `"https://chanhdai.com"` → `"chanhdai.com"`,
  `"http://x.com/y"` → `"x.com/y"`, `"//cdn.x.com"` → `"cdn.x.com"`,
  `"chanhdai.com"` → `"chanhdai.com"`.
- `addQueryParams`: adds/overwrites params on a valid URL; returns the input
  unchanged when given an invalid URL string. Cases:
  `addQueryParams("https://x.com", { a: "1" })` → contains `a=1`;
  `addQueryParams("not a url", { a: "1" })` → `"not a url"`.

**Verify**: `pnpm test:run -- src/utils/url.test.ts` → all pass.

### Step 3: Test `src/utils/registry.ts`

Create `src/utils/registry.test.ts`. Because these functions read
`registryConfig`, import the real config and assert structurally rather than
hard-coding the namespace string:

- `getRegistryItemNamespace("foo")` → starts with the configured namespace and
  ends with `/foo`.
- `getRegistryItemUrl("foo")` → does not contain the literal `{name}` and does
  contain `foo`.
- `getRegistryItemUrls("a", "b")` → array of length 2, each transformed.

**Verify**: `pnpm test:run -- src/utils/registry.test.ts` → all pass.

### Step 4: Test `findNeighbour` from documents.ts

Create `src/features/doc/data/documents.test.ts`. Import only `findNeighbour`.
Build small fixture arrays of `{ slug }` objects cast to the expected type:

- middle item → previous and next both set;
- first item → previous null, next set;
- last item → previous set, next null;
- single-item array → both null;
- slug not present → both null.

**Verify**: `pnpm test:run -- src/features/doc/data/documents.test.ts` → all pass.

### Step 5: Confirm the whole suite and types

**Verify**:

- `pnpm test:run` → all tests pass (at least the three files above), zero failures.
- `pnpm check-types` → exit 0 (test files must typecheck under strict mode).
- `pnpm lint` → exit 0.

## Test plan

- New files: `src/utils/url.test.ts`, `src/utils/registry.test.ts`,
  `src/features/doc/data/documents.test.ts`.
- These ARE the tests (this plan bootstraps the suite). Each covers happy path
  plus the named edge cases above.
- Structural pattern for future tests: colocate `*.test.ts` next to the source
  file, import via `@/` alias, use Vitest `describe`/`it`/`expect`.
- Verification: `pnpm test:run` → all pass.

## Done criteria

ALL must hold:

- [ ] `vitest` is in `devDependencies`; `package.json` has `test` and `test:run` scripts
- [ ] `vitest.config.ts` exists and resolves the `@/` alias
- [ ] `pnpm test:run` exits 0 with the three new test files all passing
- [ ] `pnpm check-types` exits 0 and `pnpm lint` exits 0
- [ ] `git status` shows only: `package.json`, `pnpm-lock.yaml`, `vitest.config.ts`,
      and the three new `*.test.ts` files
- [ ] `plans/README.md` status row for 002 updated to DONE

## STOP conditions

Stop and report back (do not improvise) if:

- The `@/` alias does not resolve in Vitest after the config in Step 1 (report the
  error; do not start rewriting imports to relative paths).
- A test reveals an actual bug in the function under test (e.g. `urlToName`
  mishandles a case). Do NOT change the source to make the test pass — write the
  test to document current behaviour, mark the surprising case with a `// NOTE:`
  comment, and report it as a finding.
- `pnpm check-types` fails because Vitest globals/types are not picked up — report;
  the fix is a tsconfig include or `import { describe, it, expect } from "vitest"`,
  but confirm which before sprawling changes.

## Maintenance notes

- After this lands, add a `pnpm test:run` step to `.github/workflows/ci.yml`
  (created in plan 001) between Typecheck and Build.
- Next test targets worth adding later (not this plan): the registry build output
  shape (`registry:validate` already gates structure), MDX frontmatter parsing in
  `documents.ts` (needs an fs fixture dir), and the RSS XML escaping fixed in
  plan 006.
- Reviewer should scrutinize: that tests assert behaviour (not just that a
  function is callable), and that no source file was modified to pass a test.

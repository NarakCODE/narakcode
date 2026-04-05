# Task Todo

## 2026-04-05

- [in_progress] Add shadcn-compatible Liquid Glass registry component
  Result: Reviewed the existing registry structure and local button conventions to match the new component API to the repo’s current shadcn patterns.

- [pending] Register the Liquid Glass component and demo in the registry manifest
  Result:

- [pending] Rebuild generated registry artifacts and verify CLI installation output
  Result:

- [in_progress] Fix shadcn registry installation flow
  Result: Root cause found. The published registry endpoint was missing `public/r/registry.json`, which current shadcn registry docs require as the entrypoint.

- [completed] Update the registry build pipeline to publish a root `registry.json`
  Result: `src/scripts/build-registry.mts` now writes the manifest to `public/r/registry.json`, and `package.json` builds item files from that public manifest.

- [completed] Update install documentation to reference the registry root where needed
  Result: Added the registry root URL to the components page and fixed stale shadcn install commands in the Pin List article.

- [completed] Verify registry build output and installation behavior
  Result: `pnpm run registry:internal:build` and `pnpm run registry:build` both succeeded, and `public/r/registry.json` is now present alongside the item JSON files.

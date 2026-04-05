# Lessons

## 2026-04-05

- Cause: The registry build pipeline only generated per-item JSON files in `public/r` and never published a root `registry.json`, so registry installation flows based on the current shadcn docs could not discover the registry entrypoint.
  Prevention: Keep the source manifest and the published registry endpoint aligned by generating `public/r/registry.json` as part of the internal registry build, then run the public registry build from that file.

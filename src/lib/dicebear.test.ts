import { describe, expect, it } from "vitest"

import { getDiceBearAvatarDataUri, getDiceBearAvatarUrl } from "./dicebear"

describe("dicebear", () => {
  it("generates an inline SVG data URI for a seed", () => {
    const uri = getDiceBearAvatarDataUri("Narak")

    expect(uri.startsWith("data:image/svg+xml;")).toBe(true)
    expect(decodeURIComponent(uri)).toContain("<svg")
  })

  it("produces deterministic output per seed and varies across seeds", () => {
    expect(getDiceBearAvatarDataUri("Alice")).toBe(
      getDiceBearAvatarDataUri("Alice")
    )
    expect(getDiceBearAvatarDataUri("Alice")).not.toBe(
      getDiceBearAvatarDataUri("Bob")
    )
  })

  it("builds a DiceBear 10.x glass SVG URL with encoded seed", () => {
    expect(getDiceBearAvatarUrl("Narak CODE")).toBe(
      "https://api.dicebear.com/10.x/glass/svg?seed=Narak+CODE"
    )
  })
})

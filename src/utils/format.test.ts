import {
  formatCompactNumber,
  formatDate,
  formatDuration,
  formatNumber,
} from "@/utils/format"
import { describe, expect, it } from "vitest"

describe("formatNumber", () => {
  it("formats numbers using en-US grouping", () => {
    expect(formatNumber(1234567)).toBe("1,234,567")
    expect(formatNumber(0)).toBe("0")
  })
})

describe("formatCompactNumber", () => {
  it("formats numbers using short compact notation", () => {
    expect(formatCompactNumber(1500)).toBe("1.5K")
    expect(formatCompactNumber(1200000)).toBe("1.2M")
  })
})

describe("formatDuration", () => {
  it("formats hours, minutes and seconds", () => {
    expect(formatDuration(3661)).toBe("1h 1m 1s")
  })

  it("omits zero-valued units, including intermediate ones", () => {
    expect(formatDuration(3605)).toBe("1h 5s")
    expect(formatDuration(360)).toBe("6m")
  })

  it("rounds up across the minute boundary", () => {
    expect(formatDuration(59.6)).toBe("1m")
  })

  it("returns 0s for zero", () => {
    expect(formatDuration(0)).toBe("0s")
  })
})

describe("formatDate", () => {
  it("formats standard date strings consistently in UTC", () => {
    expect(formatDate("2025-06-01", "dd.MM.yyyy")).toBe("01.06.2025")
    expect(formatDate("2025-06-01T00:00:00.000Z", "dd.MM.yyyy")).toBe(
      "01.06.2025"
    )
  })

  it("formats date objects consistently in UTC", () => {
    const d = new Date("2025-06-01T00:00:00.000Z")
    expect(formatDate(d, "dd.MM.yyyy")).toBe("01.06.2025")
  })
})

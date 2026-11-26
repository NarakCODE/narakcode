import { describe, expect, it } from "vitest"

import { buildDeliveredGoogleAccount, GEMINI_SEAT_LISTINGS } from "./data"
import {
  calculateDepreciationQuote,
  DEFAULT_PRICING_CONFIG,
  MS_PER_DAY,
  MS_PER_WEEK,
  PLAN_DAYS,
  PLAN_WEEKS,
} from "./pricing-engine"

describe("store weekly pricing & Google account delivery", () => {
  it("keeps full $5.00 price during week 0 and drops only by full elapsed weeks", () => {
    const account = GEMINI_SEAT_LISTINGS[0]
    const activatedMs = new Date(account.activated_at).getTime()

    // Within the same week (day 0 vs day 6), price must stay constant at $5.00
    const day0 = calculateDepreciationQuote(
      account.activated_at,
      DEFAULT_PRICING_CONFIG,
      activatedMs
    )
    const day6 = calculateDepreciationQuote(
      account.activated_at,
      DEFAULT_PRICING_CONFIG,
      activatedMs + 6 * MS_PER_DAY
    )

    expect(day0.elapsed_weeks).toBe(0)
    expect(day0.billable_weeks).toBe(PLAN_WEEKS)
    expect(day0.final_usd).toBe(5)
    expect(day6.elapsed_weeks).toBe(0)
    expect(day6.billable_weeks).toBe(PLAN_WEEKS)
    expect(day6.final_usd).toBe(5)

    // After 10 full weeks, price drops based on 42 remaining weeks out of 52
    const week10 = calculateDepreciationQuote(
      account.activated_at,
      DEFAULT_PRICING_CONFIG,
      activatedMs + 10 * MS_PER_WEEK
    )

    expect(week10.elapsed_weeks).toBe(10)
    expect(week10.billable_weeks).toBe(PLAN_WEEKS - 10)
    expect(week10.final_usd).toBe(4.04)

    // Deep into the year (48 weeks elapsed), price clamps at the $0.50 floor
    const week48 = calculateDepreciationQuote(
      account.activated_at,
      DEFAULT_PRICING_CONFIG,
      activatedMs + 48 * MS_PER_WEEK
    )

    expect(week48.elapsed_weeks).toBe(48)
    expect(week48.billable_weeks).toBe(4)
    expect(week48.floor_applied).toBe(true)
    expect(week48.final_usd).toBe(DEFAULT_PRICING_CONFIG.min_floor_price_usd)
  })

  it("delivers complete Google account credentials on purchase success", () => {
    const accountListing = GEMINI_SEAT_LISTINGS[1]
    const account = buildDeliveredGoogleAccount(
      accountListing,
      "ORD-TEST99AB",
      1
    )

    expect(account.email).toMatch(/@gmail\.com$/)
    expect(account.password).toContain("99AB")
    expect(account.recovery_email).toMatch(/@narakcode\.dev$/)
    expect(account.backup_codes).toHaveLength(4)
    expect(account.login_url).toBe("https://accounts.google.com")

    const expectedExpiry = new Date(
      new Date(accountListing.activated_at).getTime() + PLAN_DAYS * MS_PER_DAY
    ).toISOString()
    expect(account.expires_at).toBe(expectedExpiry)
  })
})

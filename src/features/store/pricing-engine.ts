export type PricingCadence = "weekly" | "daily" | "monthly"
export type MarginFormula = "proportional" | "fixed_profit"
export type RoundingMode = "exact_cent" | "quarter_dollar"

export interface PricingConfig {
  default_retail_price_usd: number
  unit_cost_usd: number
  min_floor_price_usd: number
  khr_exchange_rate: number
  pricing_cadence: PricingCadence
  margin_formula: MarginFormula
  rounding_mode: RoundingMode
  round_khr_to_100: boolean
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  default_retail_price_usd: 5.0,
  unit_cost_usd: 4.0,
  min_floor_price_usd: 0.5,
  khr_exchange_rate: 4070,
  pricing_cadence: "weekly",
  margin_formula: "proportional",
  rounding_mode: "exact_cent",
  round_khr_to_100: false,
}

export const MS_PER_DAY = 86_400_000
export const DAYS_PER_WEEK = 7
export const MS_PER_WEEK = DAYS_PER_WEEK * MS_PER_DAY
export const PLAN_WEEKS = 52
export const PLAN_DAYS = 365
export const PLAN_MONTHS = 12
export const DAYS_PER_MONTH_CYCLE = 30

export interface DepreciationQuote {
  activated_at: string
  evaluated_at: string
  expires_at: string
  elapsed_days: number
  elapsed_weeks: number
  billable_days: number
  billable_weeks: number
  total_weeks: number
  billable_months: number
  raw_price_usd: number
  rounded_price_usd: number
  final_usd: number
  final_khr: number
  floor_applied: boolean
  next_drop_at: string | null
  seconds_until_next_drop: number
  next_drop_amount_usd: number
  discount_percent_off_default: number
  effective_monthly_rate: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function roundToCents(value: number): number {
  return Math.round((value + 1e-9) * 100) / 100
}

function applyUsdRounding(value: number, mode: RoundingMode): number {
  if (mode === "quarter_dollar") {
    return roundToCents(Math.round((value + 1e-9) * 4) / 4)
  }
  return roundToCents(value)
}

function computeRawUsd(
  config: PricingConfig,
  billableDays: number,
  billableWeeks: number,
  billableMonths: number
): number {
  const ratio =
    config.pricing_cadence === "weekly"
      ? billableWeeks / PLAN_WEEKS
      : config.pricing_cadence === "daily"
        ? billableDays / PLAN_DAYS
        : billableMonths / PLAN_MONTHS

  if (config.margin_formula === "fixed_profit") {
    const fixedProfit = config.default_retail_price_usd - config.unit_cost_usd
    return config.unit_cost_usd * ratio + fixedProfit
  }

  return config.default_retail_price_usd * ratio
}

function computePriceCore(
  activatedAtMs: number,
  nowMs: number,
  config: PricingConfig
) {
  const elapsedDays = Math.floor((nowMs - activatedAtMs) / MS_PER_DAY)
  const elapsedWeeks = Math.max(
    0,
    Math.floor((nowMs - activatedAtMs) / MS_PER_WEEK)
  )
  const billableDays = clamp(PLAN_DAYS - elapsedDays, 0, PLAN_DAYS)
  const billableWeeks = clamp(PLAN_WEEKS - elapsedWeeks, 0, PLAN_WEEKS)
  const billableMonths = clamp(
    PLAN_MONTHS - Math.floor(elapsedDays / DAYS_PER_MONTH_CYCLE),
    0,
    PLAN_MONTHS
  )

  const rawPriceUsd = computeRawUsd(
    config,
    billableDays,
    billableWeeks,
    billableMonths
  )
  const roundedPriceUsd = applyUsdRounding(rawPriceUsd, config.rounding_mode)
  const finalUsd = roundToCents(
    Math.max(config.min_floor_price_usd, roundedPriceUsd)
  )
  const floorApplied = roundedPriceUsd < config.min_floor_price_usd

  return {
    elapsedDays,
    elapsedWeeks,
    billableDays,
    billableWeeks,
    billableMonths,
    rawPriceUsd,
    roundedPriceUsd,
    finalUsd,
    floorApplied,
  }
}

/**
 * Computes a deterministic depreciation quote for a 12-month Gemini account
 * based on elapsed weeks (or configured cadence) since owner activation.
 */
export function calculateDepreciationQuote(
  activatedAt: Date | string | number,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
  now: Date | string | number = Date.now()
): DepreciationQuote {
  const activatedAtMs =
    typeof activatedAt === "number"
      ? activatedAt
      : new Date(activatedAt).getTime()
  const nowMs = typeof now === "number" ? now : new Date(now).getTime()

  if (!Number.isFinite(activatedAtMs) || !Number.isFinite(nowMs)) {
    throw new Error("Invalid timestamp provided to depreciation pricing engine")
  }

  const core = computePriceCore(activatedAtMs, nowMs, config)

  const stepDays =
    config.pricing_cadence === "weekly"
      ? DAYS_PER_WEEK
      : config.pricing_cadence === "daily"
        ? 1
        : DAYS_PER_MONTH_CYCLE
  const maxCycles =
    config.pricing_cadence === "weekly"
      ? PLAN_WEEKS
      : config.pricing_cadence === "daily"
        ? PLAN_DAYS
        : PLAN_MONTHS

  const currentCycle =
    core.elapsedDays < 0 ? 0 : Math.floor(core.elapsedDays / stepDays)
  const nextCycle = currentCycle + 1

  let nextDropAt: string | null = null
  let secondsUntilNextDrop = 0
  let nextDropAmountUsd = 0

  if (currentCycle < maxCycles) {
    const nextThresholdMs = activatedAtMs + nextCycle * stepDays * MS_PER_DAY
    nextDropAt = new Date(nextThresholdMs).toISOString()
    secondsUntilNextDrop = Math.max(
      0,
      Math.ceil((nextThresholdMs - nowMs) / 1000)
    )
    const nextCore = computePriceCore(activatedAtMs, nextThresholdMs, config)
    nextDropAmountUsd = Math.max(
      0,
      roundToCents(core.finalUsd - nextCore.finalUsd)
    )
  }

  const rawKhr = core.finalUsd * config.khr_exchange_rate
  const finalKhr = config.round_khr_to_100
    ? Math.round(rawKhr / 100) * 100
    : Math.round(rawKhr)

  const discountPercentOffDefault =
    config.default_retail_price_usd > 0
      ? clamp(
          roundToCents(
            ((config.default_retail_price_usd - core.finalUsd) /
              config.default_retail_price_usd) *
              100
          ),
          0,
          100
        )
      : 0

  const effectiveMonthsRemaining =
    config.pricing_cadence === "monthly"
      ? core.billableMonths
      : config.pricing_cadence === "weekly"
        ? (core.billableWeeks / PLAN_WEEKS) * PLAN_MONTHS
        : (core.billableDays / PLAN_DAYS) * PLAN_MONTHS

  const effectiveMonthlyRate =
    effectiveMonthsRemaining > 0
      ? roundToCents(core.finalUsd / effectiveMonthsRemaining)
      : 0

  const expiresAtIso = new Date(
    activatedAtMs + PLAN_DAYS * MS_PER_DAY
  ).toISOString()

  return {
    activated_at: new Date(activatedAtMs).toISOString(),
    evaluated_at: new Date(nowMs).toISOString(),
    expires_at: expiresAtIso,
    elapsed_days: core.elapsedDays,
    elapsed_weeks: core.elapsedWeeks,
    billable_days: core.billableDays,
    billable_weeks: core.billableWeeks,
    total_weeks: PLAN_WEEKS,
    billable_months: core.billableMonths,
    raw_price_usd: roundToCents(core.rawPriceUsd),
    rounded_price_usd: core.roundedPriceUsd,
    final_usd: core.finalUsd,
    final_khr: finalKhr,
    floor_applied: core.floorApplied,
    next_drop_at: nextDropAt,
    seconds_until_next_drop: secondsUntilNextDrop,
    next_drop_amount_usd: nextDropAmountUsd,
    discount_percent_off_default: discountPercentOffDefault,
    effective_monthly_rate: effectiveMonthlyRate,
  }
}

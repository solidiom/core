/**
 * Meter status derivation logic — pure function, no JSX dependencies.
 */

export type MeterStatus = "safe" | "caution" | "danger"

/**
 * Derives the meter status based on value relative to low/high/optimum thresholds.
 *
 * Follows the HTML meter element's algorithm:
 * - If optimum is in the "high" segment (>= high), then:
 *   - value >= high → safe
 *   - value >= low → caution
 *   - value < low → danger
 * - If optimum is in the "low" segment (<= low), then:
 *   - value <= low → safe
 *   - value <= high → caution
 *   - value > high → danger
 * - If optimum is in the middle (between low and high), then:
 *   - value between low and high → safe
 *   - otherwise → caution
 * - If no thresholds are specified → safe
 */
export function deriveMeterStatus(
  value: number,
  low?: number,
  high?: number,
  optimum?: number,
): MeterStatus {
  if (low === undefined && high === undefined) return "safe"

  const effectiveLow = low
  const effectiveHigh = high

  if (optimum !== undefined) {
    if (effectiveHigh !== undefined && optimum >= effectiveHigh) {
      // Optimum is high — higher values are better
      if (value >= effectiveHigh) return "safe"
      if (effectiveLow !== undefined && value < effectiveLow) return "danger"
      return "caution"
    }
    if (effectiveLow !== undefined && optimum <= effectiveLow) {
      // Optimum is low — lower values are better
      if (value <= effectiveLow) return "safe"
      if (effectiveHigh !== undefined && value > effectiveHigh) return "danger"
      return "caution"
    }
  }

  // Optimum is in the middle or not specified — middle is best
  if (effectiveLow !== undefined && effectiveHigh !== undefined) {
    if (value >= effectiveLow && value <= effectiveHigh) return "safe"
    return "caution"
  }

  // Only one threshold specified
  if (effectiveLow !== undefined) {
    return value >= effectiveLow ? "safe" : "caution"
  }
  if (effectiveHigh !== undefined) {
    return value <= effectiveHigh ? "safe" : "caution"
  }

  return "safe"
}

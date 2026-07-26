/**
 * Meter status derivation logic — pure function, no JSX dependencies.
 */
export type MeterStatus = "safe" | "caution" | "danger";
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
export declare function deriveMeterStatus(value: number, low?: number, high?: number, optimum?: number): MeterStatus;
//# sourceMappingURL=derive-status.d.ts.map
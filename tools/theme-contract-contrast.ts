/**
 * tools/theme-contract-contrast — WCAG 2.x relative luminance and contrast ratio.
 *
 * THEME-001e. A minimal, dependency-free implementation used by the validator to catch
 * an obviously inverted or unreadable pairing (foreground on surface, primary-foreground
 * on primary) at authoring time. This is a floor, not the full THEME-005 audit: THEME-005
 * owns the exhaustive cross-output contrast matrix across every intent colour, every
 * surface, and every generated profile. THEME-001 only requires that the pairs a theme
 * *must* declare are legible in both modes.
 *
 * Supports the colour forms BRAND-002 and the reference theme actually use: 3/6-digit hex
 * (`#RRGGBB`, `#RGB`) and functional `rgb()`/`rgba()`. `hsl()` is intentionally not
 * supported here — the reference theme and BRAND-002 both author in hex, and adding an
 * hsl parser is unnecessary surface area until a theme actually needs it.
 */

export interface RGB {
  r: number
  g: number
  b: number
}

const HEX_SHORT = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i
const HEX_LONG = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
const RGB_FUNC = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*[\d.]+\s*)?\)$/i

/** Parses a hex or rgb()/rgba() colour literal. Returns `undefined` if the form is unsupported. */
export function parseColor(value: string): RGB | undefined {
  const trimmed = value.trim()

  const long = HEX_LONG.exec(trimmed)
  if (long) {
    return { r: parseInt(long[1], 16), g: parseInt(long[2], 16), b: parseInt(long[3], 16) }
  }

  const short = HEX_SHORT.exec(trimmed)
  if (short) {
    return {
      r: parseInt(short[1] + short[1], 16),
      g: parseInt(short[2] + short[2], 16),
      b: parseInt(short[3] + short[3], 16),
    }
  }

  const fn = RGB_FUNC.exec(trimmed)
  if (fn) {
    return { r: Number(fn[1]), g: Number(fn[2]), b: Number(fn[3]) }
  }

  return undefined
}

function channelLuminance(channel: number): number {
  const normalized = channel / 255
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance({ r, g, b }: RGB): number {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
}

/** WCAG contrast ratio between two colours, 1 (no contrast) to 21 (max contrast). */
export function contrastRatio(a: RGB, b: RGB): number {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b))
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b))
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Contrast ratio between two colour literals, or `undefined` if either value is a form
 * this parser does not understand (the validator treats that as "cannot verify," not
 * as a pass or a failure).
 */
export function contrastBetween(a: string, b: string): number | undefined {
  const colorA = parseColor(a)
  const colorB = parseColor(b)
  if (!colorA || !colorB) return undefined
  return contrastRatio(colorA, colorB)
}

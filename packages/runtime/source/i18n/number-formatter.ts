/**
 * NumberFormatter — locale-aware number formatting utility.
 *
 * Wraps Intl.NumberFormat with caching, reactive locale/options support,
 * and a parse method that handles locale-specific separators.
 *
 * SSR-safe: falls back to 'en-US' when navigator is undefined.
 */

/** Options for creating a number formatter. */
export interface NumberFormatterOptions {
  /** BCP 47 locale string. Defaults to navigator.language or 'en-US'. */
  locale?: string | (() => string)
  /** Intl.NumberFormat options (style, currency, minimumFractionDigits, etc.) */
  formatOptions?: Intl.NumberFormatOptions | (() => Intl.NumberFormatOptions)
}

/** The return type of createNumberFormatter. */
export interface NumberFormatter {
  /** Format a number to a locale string. */
  format: (value: number) => string
  /** Format a number to parts (Intl.NumberFormatPart[]). */
  formatToParts: (value: number) => Intl.NumberFormatPart[]
  /** Parse a locale-formatted string back to a number. Handles locale-specific decimal/group separators. */
  parse: (text: string) => number
  /** Get the decimal separator for the current locale. */
  decimalSeparator: () => string
  /** Get the group separator for the current locale. */
  groupSeparator: () => string
  /** Whether the current format uses grouping. */
  usesGrouping: () => boolean
  /** Resolve the current Intl.NumberFormat instance (for advanced use). */
  resolvedFormatter: () => Intl.NumberFormat
}

/** Cache key for Intl.NumberFormat instances. */
const formatterCache = new Map<string, Intl.NumberFormat>()

/**
 * Resolves the default locale in an SSR-safe manner.
 * @returns The navigator language or 'en-US' as fallback.
 */
function getDefaultLocale(): string {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language
  }
  return "en-US"
}

/**
 * Builds a stable cache key from locale and format options.
 */
function buildCacheKey(locale: string, options: Intl.NumberFormatOptions | undefined): string {
  return `${locale}:${options ? JSON.stringify(options, Object.keys(options).sort()) : ""}`
}

/**
 * Gets or creates a cached Intl.NumberFormat instance.
 */
function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions | undefined,
): Intl.NumberFormat {
  const key = buildCacheKey(locale, options)
  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options)
    formatterCache.set(key, formatter)
  }
  return formatter
}

/**
 * Creates a locale-aware number formatter.
 *
 * Supports both static and reactive (accessor) locale and formatOptions.
 * Caches Intl.NumberFormat instances when locale+options haven't changed.
 *
 * @param options - Configuration for locale and number format.
 * @returns A NumberFormatter with format, parse, and introspection methods.
 *
 * @example
 * ```ts
 * const fmt = createNumberFormatter({ locale: "de-DE" })
 * fmt.format(1234.5) // "1.234,5"
 * fmt.parse("1.234,5") // 1234.5
 * ```
 */
export function createNumberFormatter(options: NumberFormatterOptions = {}): NumberFormatter {
  const resolveLocale = (): string => {
    const loc = options.locale
    if (typeof loc === "function") return loc()
    if (typeof loc === "string") return loc
    return getDefaultLocale()
  }

  const resolveFormatOptions = (): Intl.NumberFormatOptions | undefined => {
    const opts = options.formatOptions
    if (typeof opts === "function") return opts()
    return opts
  }

  const resolvedFormatter = (): Intl.NumberFormat => {
    return getFormatter(resolveLocale(), resolveFormatOptions())
  }

  const format = (value: number): string => {
    return resolvedFormatter().format(value)
  }

  const formatToParts = (value: number): Intl.NumberFormatPart[] => {
    return resolvedFormatter().formatToParts(value)
  }

  const decimalSeparator = (): string => {
    const parts = resolvedFormatter().formatToParts(1.1)
    const decimalPart = parts.find((p) => p.type === "decimal")
    return decimalPart?.value ?? "."
  }

  const groupSeparator = (): string => {
    const parts = resolvedFormatter().formatToParts(10000)
    const groupPart = parts.find((p) => p.type === "group")
    return groupPart?.value ?? ""
  }

  const usesGrouping = (): boolean => {
    const parts = resolvedFormatter().formatToParts(10000)
    return parts.some((p) => p.type === "group")
  }

  const parse = (text: string): number => {
    const formatter = resolvedFormatter()
    const resolvedOptions = formatter.resolvedOptions()
    const isPercent = resolvedOptions.style === "percent"

    const decSep = decimalSeparator()
    const grpSep = groupSeparator()

    // Strip group separators
    let cleaned = text
    if (grpSep) {
      cleaned = cleaned.split(grpSep).join("")
    }

    // Replace locale decimal separator with standard dot
    if (decSep && decSep !== ".") {
      cleaned = cleaned.replace(decSep, ".")
    }

    // Strip everything except digits, minus sign, and dot
    cleaned = cleaned.replace(/[^\d.\-]/g, "")

    // Handle negative: ensure minus is only at the start
    const isNegative = cleaned.includes("-")
    cleaned = cleaned.replace(/-/g, "")
    if (isNegative) {
      cleaned = "-" + cleaned
    }

    const result = Number.parseFloat(cleaned)

    if (Number.isNaN(result)) return NaN

    // Percent style: Intl formats 0.5 as "50%", so parse "50%" back to 0.5
    if (isPercent) {
      return result / 100
    }

    return result
  }

  return {
    format,
    formatToParts,
    parse,
    decimalSeparator,
    groupSeparator,
    usesGrouping,
    resolvedFormatter,
  }
}

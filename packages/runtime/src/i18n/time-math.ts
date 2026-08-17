/**
 * TimeMath — time representation and arithmetic utility.
 *
 * Provides construction, conversion, arithmetic, comparison, clamping,
 * and segment operations for time values. All arithmetic wraps at day
 * boundaries (24h).
 *
 * Pure utility — no reactivity, no signals.
 */

/** Represents a time value (hours, minutes, seconds, milliseconds). */
export interface TimeValue {
  hour: number // 0-23
  minute: number // 0-59
  second: number // 0-59
  millisecond: number // 0-999
}

/** Hour cycle preference. */
export type HourCycle = "12" | "24"

/** AM/PM period. */
export type DayPeriod = "AM" | "PM"

/** Options for time formatting. */
export interface TimeFormatterOptions {
  /** Hour cycle. Default: derived from locale. */
  hourCycle?: HourCycle
  /** Locale for formatting. Default: 'en-US'. */
  locale?: string
  /** Whether to show seconds. Default: false. */
  showSeconds?: boolean
  /** Whether to show milliseconds. Default: false. */
  showMilliseconds?: boolean
}

/** Segment values for segmented time editing. */
export interface TimeSegments {
  hour: string
  minute: string
  second: string
  millisecond: string
  period?: string // 'AM' | 'PM' (only for 12-hour cycle)
}

/** The return type of createTimeMath. */
export interface TimeMath {
  // ─── Construction ──────────────────────────────────────────────────────

  /** Create a TimeValue from hours, minutes, optional seconds and ms. */
  createTime: (hour: number, minute: number, second?: number, millisecond?: number) => TimeValue
  /** Create a TimeValue from total milliseconds since midnight. */
  fromMilliseconds: (ms: number) => TimeValue
  /** Create a TimeValue from a Date object. */
  fromDate: (date: Date) => TimeValue
  /** Parse a time string (HH:MM, HH:MM:SS, HH:MM:SS.mmm). Returns null if invalid. */
  parse: (text: string) => TimeValue | null
  /** Create a TimeValue representing now. */
  now: () => TimeValue

  // ─── Conversion ────────────────────────────────────────────────────────

  /** Convert to total milliseconds since midnight. */
  toMilliseconds: (time: TimeValue) => number
  /** Convert to total seconds since midnight. */
  toSeconds: (time: TimeValue) => number
  /** Convert to total minutes since midnight (rounded). */
  toMinutes: (time: TimeValue) => number
  /** Format to ISO time string (HH:MM:SS or HH:MM:SS.mmm). */
  toISOString: (time: TimeValue) => string
  /** Format to display string based on options. */
  format: (time: TimeValue, options?: TimeFormatterOptions) => string
  /** Get the 12-hour display hour (1-12). */
  get12Hour: (time: TimeValue) => number
  /** Get the day period (AM/PM). */
  getDayPeriod: (time: TimeValue) => DayPeriod

  // ─── Arithmetic ────────────────────────────────────────────────────────

  /** Add hours (wraps at 24). */
  addHours: (time: TimeValue, hours: number) => TimeValue
  /** Add minutes (wraps, carries to hours). */
  addMinutes: (time: TimeValue, minutes: number) => TimeValue
  /** Add seconds (wraps, carries to minutes/hours). */
  addSeconds: (time: TimeValue, seconds: number) => TimeValue
  /** Add milliseconds (wraps, carries up). */
  addMilliseconds: (time: TimeValue, ms: number) => TimeValue
  /** Set a specific field, clamping to valid range. */
  set: (time: TimeValue, field: keyof TimeValue, value: number) => TimeValue
  /** Cycle a field up/down by 1, wrapping at boundaries. */
  cycle: (time: TimeValue, field: keyof TimeValue, direction: 1 | -1) => TimeValue

  // ─── Comparison ────────────────────────────────────────────────────────

  /** Whether two times are equal. */
  isEqual: (a: TimeValue, b: TimeValue) => boolean
  /** Compare: -1 if a < b, 0 if equal, 1 if a > b. */
  compare: (a: TimeValue, b: TimeValue) => -1 | 0 | 1
  /** Whether time is between min and max (inclusive). */
  isBetween: (time: TimeValue, min: TimeValue, max: TimeValue) => boolean

  // ─── Clamping ──────────────────────────────────────────────────────────

  /** Clamp time to [min, max] range. */
  clamp: (time: TimeValue, min?: TimeValue, max?: TimeValue) => TimeValue

  // ─── 12h/24h conversion ────────────────────────────────────────────────

  /** Convert 12-hour + period to 24-hour TimeValue. */
  from12Hour: (hour12: number, minute: number, period: DayPeriod, second?: number) => TimeValue
  /** Toggle AM/PM (adds or subtracts 12 hours). */
  togglePeriod: (time: TimeValue) => TimeValue

  // ─── Segments (for segmented editing) ──────────────────────────────────

  /** Get segment values for use with createSegmentedEditing. */
  toSegments: (time: TimeValue, hourCycle?: HourCycle) => TimeSegments
  /** Construct a TimeValue from segment values. */
  fromSegments: (segments: TimeSegments, hourCycle?: HourCycle) => TimeValue
}

/** Total milliseconds in a day. */
const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Field maximum values (exclusive upper bounds). */
const FIELD_MAX: Record<keyof TimeValue, number> = {
  hour: 24,
  minute: 60,
  second: 60,
  millisecond: 1000,
}

/**
 * Wraps a millisecond value to stay within [0, MS_PER_DAY).
 */
function wrapMs(ms: number): number {
  return ((ms % MS_PER_DAY) + MS_PER_DAY) % MS_PER_DAY
}

/**
 * Pads a number to the given width with leading zeros.
 */
function pad(value: number, width: number): string {
  return String(value).padStart(width, "0")
}

/**
 * Clamps a value to [min, max].
 */
function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Detects the default hour cycle for a locale using Intl.DateTimeFormat.
 */
function detectHourCycle(locale: string): HourCycle {
  try {
    const formatter = new Intl.DateTimeFormat(locale, { hour: "numeric" })
    const resolved = formatter.resolvedOptions()
    // hourCycle: 'h11', 'h12' → 12-hour; 'h23', 'h24' → 24-hour
    if (resolved.hourCycle === "h23" || resolved.hourCycle === "h24") {
      return "24"
    }
    if (resolved.hourCycle === "h11" || resolved.hourCycle === "h12") {
      return "12"
    }
    // Fallback: check hour12 property
    if ("hour12" in resolved) {
      return (resolved as { hour12?: boolean }).hour12 ? "12" : "24"
    }
  } catch {
    // Fallback to 12-hour for en-US default
  }
  return "12"
}

/**
 * Creates a stateless time math utility.
 *
 * Provides construction, conversion, arithmetic, comparison, clamping,
 * and segment operations for time values. All arithmetic wraps at day
 * boundaries (24 hours).
 *
 * @returns A TimeMath instance with all time manipulation methods.
 *
 * @example
 * ```ts
 * const tm = createTimeMath()
 * const t = tm.createTime(14, 30)
 * tm.format(t, { hourCycle: "12" }) // "2:30 PM"
 * tm.addHours(t, 12) // { hour: 2, minute: 30, second: 0, millisecond: 0 }
 * ```
 */
export function createTimeMath(): TimeMath {
  // ─── Construction ──────────────────────────────────────────────────────

  const createTime = (
    hour: number,
    minute: number,
    second: number = 0,
    millisecond: number = 0,
  ): TimeValue => ({
    hour: clampNumber(Math.floor(hour), 0, 23),
    minute: clampNumber(Math.floor(minute), 0, 59),
    second: clampNumber(Math.floor(second), 0, 59),
    millisecond: clampNumber(Math.floor(millisecond), 0, 999),
  })

  const fromMilliseconds = (ms: number): TimeValue => {
    const wrapped = wrapMs(ms)
    const totalSeconds = Math.floor(wrapped / 1000)
    const millisecond = Math.floor(wrapped % 1000)
    const second = totalSeconds % 60
    const totalMinutes = Math.floor(totalSeconds / 60)
    const minute = totalMinutes % 60
    const hour = Math.floor(totalMinutes / 60)
    return { hour, minute, second, millisecond }
  }

  const fromDate = (date: Date): TimeValue => ({
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
  })

  const parse = (text: string): TimeValue | null => {
    if (!text || typeof text !== "string") return null

    const trimmed = text.trim()

    // Try 12-hour format: H:MM AM, H:MM:SS AM, HH:MM PM, etc.
    const match12 = trimmed.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/,
    )
    if (match12) {
      const hour12 = parseInt(match12[1]!, 10)
      const minute = parseInt(match12[2]!, 10)
      const second = match12[3] !== undefined ? parseInt(match12[3]!, 10) : 0
      const period = match12[4]!.toUpperCase() as DayPeriod

      if (hour12 < 1 || hour12 > 12 || minute > 59 || second > 59) return null

      let hour = hour12
      if (period === "AM") {
        hour = hour12 === 12 ? 0 : hour12
      } else {
        hour = hour12 === 12 ? 12 : hour12 + 12
      }

      return { hour, minute, second, millisecond: 0 }
    }

    // Try 24-hour format: HH:MM, HH:MM:SS, HH:MM:SS.mmm
    const match24 = trimmed.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/,
    )
    if (match24) {
      const hour = parseInt(match24[1]!, 10)
      const minute = parseInt(match24[2]!, 10)
      const second = match24[3] !== undefined ? parseInt(match24[3]!, 10) : 0
      const millisecond = match24[4] !== undefined
        ? parseInt(match24[4]!.padEnd(3, "0"), 10)
        : 0

      if (hour > 23 || minute > 59 || second > 59 || millisecond > 999) return null

      return { hour, minute, second, millisecond }
    }

    return null
  }

  const now = (): TimeValue => fromDate(new Date())

  // ─── Conversion ────────────────────────────────────────────────────────

  const toMilliseconds = (time: TimeValue): number =>
    time.hour * 3600000 + time.minute * 60000 + time.second * 1000 + time.millisecond

  const toSeconds = (time: TimeValue): number =>
    time.hour * 3600 + time.minute * 60 + time.second

  const toMinutes = (time: TimeValue): number =>
    Math.round((time.hour * 3600 + time.minute * 60 + time.second) / 60)

  const toISOString = (time: TimeValue): string => {
    const base = `${pad(time.hour, 2)}:${pad(time.minute, 2)}:${pad(time.second, 2)}`
    if (time.millisecond > 0) {
      return `${base}.${pad(time.millisecond, 3)}`
    }
    return base
  }

  const format = (time: TimeValue, options?: TimeFormatterOptions): string => {
    const locale = options?.locale ?? "en-US"
    const hourCycle = options?.hourCycle ?? detectHourCycle(locale)
    const showSeconds = options?.showSeconds ?? false
    const showMilliseconds = options?.showMilliseconds ?? false

    if (hourCycle === "12") {
      const displayHour = get12Hour(time)
      const period = getDayPeriod(time)
      let result = `${displayHour}:${pad(time.minute, 2)}`
      if (showSeconds || showMilliseconds) {
        result += `:${pad(time.second, 2)}`
      }
      if (showMilliseconds) {
        result += `.${pad(time.millisecond, 3)}`
      }
      return `${result} ${period}`
    }

    // 24-hour format
    let result = `${pad(time.hour, 2)}:${pad(time.minute, 2)}`
    if (showSeconds || showMilliseconds) {
      result += `:${pad(time.second, 2)}`
    }
    if (showMilliseconds) {
      result += `.${pad(time.millisecond, 3)}`
    }
    return result
  }

  const get12Hour = (time: TimeValue): number => {
    const h = time.hour % 12
    return h === 0 ? 12 : h
  }

  const getDayPeriod = (time: TimeValue): DayPeriod =>
    time.hour < 12 ? "AM" : "PM"

  // ─── Arithmetic ────────────────────────────────────────────────────────

  const addHours = (time: TimeValue, hours: number): TimeValue => {
    const totalMs = toMilliseconds(time) + hours * 3600000
    return fromMilliseconds(totalMs)
  }

  const addMinutes = (time: TimeValue, minutes: number): TimeValue => {
    const totalMs = toMilliseconds(time) + minutes * 60000
    return fromMilliseconds(totalMs)
  }

  const addSeconds = (time: TimeValue, seconds: number): TimeValue => {
    const totalMs = toMilliseconds(time) + seconds * 1000
    return fromMilliseconds(totalMs)
  }

  const addMilliseconds = (time: TimeValue, ms: number): TimeValue => {
    const totalMs = toMilliseconds(time) + ms
    return fromMilliseconds(totalMs)
  }

  const set = (time: TimeValue, field: keyof TimeValue, value: number): TimeValue => {
    const max = FIELD_MAX[field] - 1
    const clamped = clampNumber(Math.floor(value), 0, max)
    return { ...time, [field]: clamped }
  }

  const cycle = (time: TimeValue, field: keyof TimeValue, direction: 1 | -1): TimeValue => {
    const max = FIELD_MAX[field]
    const current = time[field]
    const next = ((current + direction) % max + max) % max
    return { ...time, [field]: next }
  }

  // ─── Comparison ────────────────────────────────────────────────────────

  const isEqual = (a: TimeValue, b: TimeValue): boolean =>
    a.hour === b.hour &&
    a.minute === b.minute &&
    a.second === b.second &&
    a.millisecond === b.millisecond

  const compare = (a: TimeValue, b: TimeValue): -1 | 0 | 1 => {
    const msA = toMilliseconds(a)
    const msB = toMilliseconds(b)
    if (msA < msB) return -1
    if (msA > msB) return 1
    return 0
  }

  const isBetween = (time: TimeValue, min: TimeValue, max: TimeValue): boolean => {
    const ms = toMilliseconds(time)
    return ms >= toMilliseconds(min) && ms <= toMilliseconds(max)
  }

  // ─── Clamping ──────────────────────────────────────────────────────────

  const clamp = (time: TimeValue, min?: TimeValue, max?: TimeValue): TimeValue => {
    let result = time
    if (min && compare(result, min) < 0) {
      result = { ...min }
    }
    if (max && compare(result, max) > 0) {
      result = { ...max }
    }
    return result
  }

  // ─── 12h/24h conversion ────────────────────────────────────────────────

  const from12Hour = (
    hour12: number,
    minute: number,
    period: DayPeriod,
    second: number = 0,
  ): TimeValue => {
    let hour: number
    if (period === "AM") {
      hour = hour12 === 12 ? 0 : hour12
    } else {
      hour = hour12 === 12 ? 12 : hour12 + 12
    }
    return createTime(hour, minute, second)
  }

  const togglePeriod = (time: TimeValue): TimeValue => {
    if (time.hour < 12) {
      return { ...time, hour: time.hour + 12 }
    }
    return { ...time, hour: time.hour - 12 }
  }

  // ─── Segments ──────────────────────────────────────────────────────────

  const toSegments = (time: TimeValue, hourCycle?: HourCycle): TimeSegments => {
    const cycle = hourCycle ?? "24"

    if (cycle === "12") {
      const displayHour = get12Hour(time)
      return {
        hour: String(displayHour),
        minute: pad(time.minute, 2),
        second: pad(time.second, 2),
        millisecond: pad(time.millisecond, 3),
        period: getDayPeriod(time),
      }
    }

    return {
      hour: pad(time.hour, 2),
      minute: pad(time.minute, 2),
      second: pad(time.second, 2),
      millisecond: pad(time.millisecond, 3),
    }
  }

  const fromSegments = (segments: TimeSegments, hourCycle?: HourCycle): TimeValue => {
    const cycle = hourCycle ?? "24"
    const minute = parseInt(segments.minute, 10) || 0
    const second = parseInt(segments.second, 10) || 0
    const millisecond = parseInt(segments.millisecond, 10) || 0

    if (cycle === "12" && segments.period) {
      const hour12 = parseInt(segments.hour, 10) || 12
      const period = segments.period.toUpperCase() as DayPeriod
      return from12Hour(hour12, minute, period, second)
    }

    const hour = parseInt(segments.hour, 10) || 0
    return createTime(hour, minute, second, millisecond)
  }

  return {
    createTime,
    fromMilliseconds,
    fromDate,
    parse,
    now,
    toMilliseconds,
    toSeconds,
    toMinutes,
    toISOString,
    format,
    get12Hour,
    getDayPeriod,
    addHours,
    addMinutes,
    addSeconds,
    addMilliseconds,
    set,
    cycle,
    isEqual,
    compare,
    isBetween,
    clamp,
    from12Hour,
    togglePeriod,
    toSegments,
    fromSegments,
  }
}

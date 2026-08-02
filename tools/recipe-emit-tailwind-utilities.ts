/**
 * tools/recipe-emit-tailwind-utilities — declaration → Tailwind utility mapping (RECIPE-003).
 *
 * The canonical contract stores declarations, not utility-class strings, because the
 * inversion is not mechanical in general (docs/contracts/recipe-contract.md §2.2): a
 * class like `bg-primary/90` cannot be inverted back into a declaration, so declarations
 * stay canonical and Tailwind output is generated *from* them, one direction only.
 *
 * This module is the one-direction mapping. It is scoped to exactly the declaration
 * shapes the 13 shipped definitions in `tools/recipe-contract-definitions.ts` use — see
 * that file's property/value inventory — not a general CSS-to-Tailwind compiler. A
 * property or literal value with no entry here falls back to Tailwind's arbitrary-value
 * syntax (`[padding:0.5rem_1rem]`) rather than silently dropping the declaration, so a
 * gap in this table is visible in the generated output instead of invisible in it.
 *
 * Token-valued declarations (`{ token: "primary" }`) are not handled here — those
 * resolve to a Tailwind theme colour name via `resolveValue(..., "tailwind", ...)` in
 * tools/recipe-emit-core.ts before this module ever sees them. This module only maps
 * literal values (lengths, keywords) and the small set of properties whose Tailwind
 * utility depends on knowing it is a colour utility (e.g. `background-color` → `bg-`).
 */

/** A property this module knows how to spell as a Tailwind utility. */
export type MappedProperty = keyof typeof PROPERTY_UTILITY_PREFIX

/**
 * Utility class prefix for a property whose value has already been resolved to a
 * literal or a theme colour name. `null` means the property has no simple `prefix-value`
 * utility form and needs the property-specific mapper below (e.g. shorthand `padding`,
 * `transition`, `transform`).
 */
const PROPERTY_UTILITY_PREFIX = {
  "background-color": "bg",
  color: "text",
  "border-color": "border",
  "border-bottom-color": "border-b",
  "outline-color": "outline",
  width: "w",
  height: "h",
  "min-width": "min-w",
  "max-width": "max-w",
  "border-radius": "rounded",
  "border-width": "border",
  "border-bottom-width": "border-b",
  "font-size": "text",
  "font-weight": "font",
  "line-height": "leading",
  "letter-spacing": "tracking",
  opacity: "opacity",
  "z-index": "z",
  gap: "gap",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  "box-shadow": "shadow",
  "padding-bottom": "pb",
  "margin-left": "ml",
} as const

/** Keyword values with a fixed Tailwind utility that ignores the property prefix table. */
const KEYWORD_UTILITIES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  display: { flex: "flex", "inline-flex": "inline-flex", block: "block", none: "hidden" },
  position: { relative: "relative", fixed: "fixed", absolute: "absolute", static: "static" },
  "align-items": { center: "items-center", "flex-start": "items-start", stretch: "items-stretch" },
  "justify-content": {
    "space-between": "justify-between",
    center: "justify-center",
    "flex-start": "justify-start",
  },
  "flex-direction": { column: "flex-col", row: "flex-row" },
  overflow: { hidden: "overflow-hidden", visible: "overflow-visible" },
  cursor: {
    pointer: "cursor-pointer",
    "not-allowed": "cursor-not-allowed",
    progress: "cursor-progress",
  },
  "pointer-events": { none: "pointer-events-none", auto: "pointer-events-auto" },
  "white-space": { nowrap: "whitespace-nowrap" },
  "text-decoration-line": { underline: "underline", none: "no-underline" },
  "border-style": { solid: "border-solid", none: "border-none", dashed: "border-dashed" },
  "border-bottom-style": { solid: "border-b" },
  outline: { none: "outline-none" },
}

/**
 * Tailwind's default spacing scale (rem → step), used for width/height/padding/margin/
 * gap/inset literals. `0.25rem` increments map to Tailwind's `1` unit; values outside
 * the scale fall through to the arbitrary-value form.
 */
const SPACING_SCALE: Readonly<Record<string, string>> = {
  "0": "0",
  "0.125rem": "0.5",
  "0.25rem": "1",
  "0.375rem": "1.5",
  "0.5rem": "2",
  "0.625rem": "2.5",
  "0.75rem": "3",
  "1rem": "4",
  "1.25rem": "5",
  "1.5rem": "6",
  "1.75rem": "7",
  "2rem": "8",
  "2.25rem": "9",
  "2.5rem": "10",
  "2.75rem": "11",
  "3rem": "12",
  "8rem": "32",
  "18rem": "72",
  "24rem": "96",
  "32rem": "128",
}

/**
 * Named Tailwind font-size steps.
 *
 * **Every named step here also sets `line-height`.** Tailwind's `text-sm` compiles to
 * `font-size: 0.875rem; line-height: calc(1.25 / 0.875)`, so emitting the named form for
 * a declaration that did not declare a line-height injects a property the canonical
 * definition never asked for — see `fontSizeUtility` below, which is why this table is
 * consulted only when a paired `line-height` is present.
 *
 * `0.8125rem` has no named Tailwind step, so it is spelled as an arbitrary value; that
 * entry is the precedent `fontSizeUtility` generalizes.
 */
const FONT_SIZE_SCALE: Readonly<Record<string, string>> = {
  "0.75rem": "xs",
  "0.8125rem": "[0.8125rem]",
  "0.875rem": "sm",
  "1rem": "base",
  "1.125rem": "lg",
}

/**
 * Maps a `font-size` declaration, honouring the contract's rule that an emitter must not
 * set a property the declaration did not declare.
 *
 * Tailwind's named `text-*` utilities bundle an opinionated `line-height`. The `css` and
 * `unocss` profiles emit a bare `font-size` and inherit the browser default, so a named
 * utility silently desynchronizes the Tailwind profile from the other two — the gap
 * recorded in docs/contracts/recipe-contract.md §10, observed as button "link"+"md"
 * computing `height: 20px` under Tailwind against `16px` elsewhere.
 *
 * Resolution depends on whether the same declaration group also declares `line-height`:
 *
 *   - **Paired** — the bundled line-height is a property the definition *did* declare, and
 *     the group's own `line-height` entry emits a `leading-*` utility that overrides it
 *     with the declared value. The named step is safe and stays, so `alert`, `badge`, and
 *     `tooltip` (the three scopes that already pair the two) emit byte-identical output.
 *   - **Unpaired** — the named step would introduce an undeclared `line-height`. Emit the
 *     arbitrary form, which sets `font-size` alone and leaves line-height inherited,
 *     matching the `css` and `unocss` profiles exactly.
 */
function fontSizeUtility(value: string, siblings: Readonly<Record<string, string>>): string[] {
  const named = FONT_SIZE_SCALE[value]
  const hasPairedLineHeight = Object.hasOwn(siblings, "line-height")
  if (named !== undefined && hasPairedLineHeight) return [`text-${named}`]
  return [`text-${arbitraryValue(value)}`]
}

const FONT_WEIGHT_SCALE: Readonly<Record<string, string>> = {
  "400": "normal",
  "500": "medium",
  "600": "semibold",
}

const LEADING_SCALE: Readonly<Record<string, string>> = {
  "1rem": "4",
  "1.25rem": "5",
  "1.4": "[1.4]",
}

/**
 * Tailwind v4 theme radius names this profile's `theme.css` registers
 * (`--radius-<name>`, utility `rounded-<name>`), keyed by the theme name a
 * `border-radius` token resolves to via `resolveValue(..., "tailwind", ...)`.
 */
const RADIUS_THEME_NAMES: ReadonlySet<string> = new Set([
  "radius",
  "radius-sm",
  "radius-lg",
  "radius-full",
])

const Z_INDEX_SCALE: Readonly<Record<string, string>> = { "50": "50", "100": "100" }

const BORDER_WIDTH_SCALE: Readonly<Record<string, string>> = { "1px": "", "2px": "2" }

const OPACITY_SCALE: Readonly<Record<string, string>> = {
  "0": "0",
  "0.5": "50",
  "0.7": "70",
  "0.9": "90",
  "1": "100",
}

const OUTLINE_OFFSET_SCALE: Readonly<Record<string, string>> = { "2px": "2" }
const UNDERLINE_OFFSET_SCALE: Readonly<Record<string, string>> = { "4px": "4" }

/** Emits an arbitrary-value utility for a value this table has no scale entry for. */
function arbitrary(prefix: string, value: string): string {
  return `${prefix}-[${value.replace(/\s+/g, "_")}]`
}

/** Splits a CSS shorthand box value (`padding`, `margin`) into its resolved sides. */
function boxSides(value: string): { top: string; right: string; bottom: string; left: string } {
  const parts = value.trim().split(/\s+/)
  const [top, right = top, bottom = top, left = right] = parts
  return { top, right, bottom, left }
}

function spacingToken(value: string): string {
  return SPACING_SCALE[value] ?? `[${value}]`
}

/**
 * Maps `padding`/`margin` shorthand to Tailwind's `p-*`/`m-*` (and axis/side variants
 * when sides differ), spelling any value outside the spacing scale as an arbitrary value
 * rather than silently approximating it.
 *
 * Emits the all-sides shorthand (`p-*`/`m-*`) when every side is equal. This module
 * feeds two consumers: `applyRuleFor`'s stylesheet/`@apply` path (real CSS selectors —
 * Tailwind's own utility-group ordering is irrelevant there because a compound's
 * selector is already more specific than the base size selector it overrides) and
 * `renderVariantsModule`'s class-string path (multiple utility classes on one element,
 * where Tailwind's compiled stylesheet order — not class-list order — decides which
 * wins a shared property, which used to make a `p-0` compound lose to a `py-2 px-4`
 * size class regardless of cva()'s declaration order). The class-string path now wraps
 * its output in `tailwind-merge`'s `twMerge()` (see `renderVariantsModule` in
 * `tools/recipe-emit-tailwind.ts`), which resolves that conflict directly — so this
 * function is free to emit whichever form reads most naturally.
 */
function boxUtility(base: "p" | "m", value: string): string[] {
  const { top, right, bottom, left } = boxSides(value)
  if (top === right && right === bottom && bottom === left) return [`${base}-${spacingToken(top)}`]
  if (top === bottom && right === left) {
    return [`${base}y-${spacingToken(top)}`, `${base}x-${spacingToken(right)}`]
  }
  return [
    `${base}t-${spacingToken(top)}`,
    `${base}r-${spacingToken(right)}`,
    `${base}b-${spacingToken(bottom)}`,
    `${base}l-${spacingToken(left)}`,
  ]
}

/** Maps a `transform: translate(...)`/`translateX(...)` literal to a Tailwind utility set. */
function transformUtility(value: string): string[] {
  const translateXOnly = value.match(/^translateX\((-?[\w.%]+(?:rem|px|%)?)\)$/)
  if (translateXOnly) return [`translate-x-${spacingToken(translateXOnly[1]!)}`]

  const centered = value.match(/^translate\(-50%, -50%\)(?:\s+scale\((\d*\.?\d+)\))?$/)
  if (centered) {
    const classes = ["-translate-x-1/2", "-translate-y-1/2"]
    if (centered[1]) classes.push(`scale-${Math.round(Number(centered[1]) * 100)}`)
    return classes
  }

  return [`[transform:${value.replace(/\s+/g, "_")}]`]
}

/** Maps a `transition` shorthand listing properties to Tailwind's `transition-*` utilities. */
function transitionUtility(value: string): string[] {
  const properties = value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((property): property is string => !!property)

  const known = new Set(properties)
  if (known.size === 1 && known.has("opacity")) return ["transition-opacity"]
  if (known.size === 1 && known.has("color")) return ["transition-colors"]
  if (known.size === 1 && known.has("transform")) return ["transition-transform"]
  if (known.has("background-color") && known.has("color") && known.has("border-color")) {
    return ["transition-colors"]
  }
  if (known.has("opacity") && known.has("background-color")) return ["transition-all"]
  if (known.has("opacity") && known.has("transform")) return ["transition-all"]
  if (known.has("background-color") && known.has("border-color")) return ["transition-colors"]
  return ["transition-all"]
}

/**
 * Maps one resolved declaration (property + already-token-substituted value) to one or
 * more Tailwind utility classes.
 *
 * `value` has already passed through `resolveValue(..., "tailwind", ...)`: a token
 * reference is a bare theme colour name (`"primary"`) by the time it reaches here, not
 * `{ token: "primary" }`. This function therefore only ever sees strings.
 *
 * `siblings` is the full declaration group `property` belongs to. Most properties map in
 * isolation, but `font-size` cannot: whether Tailwind's named `text-*` step is safe
 * depends on whether the same group declares a `line-height` for it to override. See
 * `fontSizeUtility`. Defaults to an empty group so a caller mapping a lone declaration
 * gets the conservative (arbitrary-value) spelling rather than an injected line-height.
 */
export function declarationToUtilities(
  property: string,
  value: string,
  siblings: Readonly<Record<string, string>> = {},
): string[] {
  if (property === "padding") return boxUtility("p", value)
  if (property === "margin") return boxUtility("m", value)
  if (property === "transform") return transformUtility(value)
  if (property === "transition") return transitionUtility(value)
  if (property === "inset" && value === "0") return ["inset-0"]

  const keywordMap = KEYWORD_UTILITIES[property]
  if (keywordMap?.[value]) return [keywordMap[value]]

  if (property === "font-size") return fontSizeUtility(value, siblings)
  if (property === "font-weight") {
    return [`font-${FONT_WEIGHT_SCALE[value] ?? arbitraryValue(value)}`]
  }
  if (property === "line-height")
    return [`leading-${LEADING_SCALE[value] ?? arbitraryValue(value)}`]
  if (property === "opacity") return [`opacity-${OPACITY_SCALE[value] ?? arbitraryValue(value)}`]
  if (property === "z-index") return [`z-${Z_INDEX_SCALE[value] ?? arbitraryValue(value)}`]
  if (property === "outline-offset") {
    return [`outline-offset-${OUTLINE_OFFSET_SCALE[value] ?? arbitraryValue(value)}`]
  }
  if (property === "outline" && value === "2px solid") return ["outline-2"]
  if (property === "border-width" || property === "border-bottom-width") {
    const prefix = PROPERTY_UTILITY_PREFIX[property as MappedProperty]
    const step = BORDER_WIDTH_SCALE[value]
    if (step !== undefined) return step === "" ? [] : [`${prefix}-${step}`]
    return [arbitrary(prefix, value)]
  }
  if (property === "text-underline-offset") {
    return [`underline-offset-${UNDERLINE_OFFSET_SCALE[value] ?? arbitraryValue(value)}`]
  }
  if (property === "border-radius") {
    if (RADIUS_THEME_NAMES.has(value)) return [`rounded-${value}`]
    if (value === "0.25rem") return ["rounded-sm"]
    return [arbitrary("rounded", value)]
  }

  const prefix = PROPERTY_UTILITY_PREFIX[property as MappedProperty]
  if (!prefix) return [`[${property}:${value.replace(/\s+/g, "_")}]`]

  // Colour-valued properties: a bare word with no unit is a resolved theme colour name
  // (from resolveValue's tailwind branch) or a CSS-wide keyword.
  if (COLOUR_PROPERTIES.has(property)) {
    if (value === "transparent") return [`${prefix}-transparent`]
    return [`${prefix}-${value}`]
  }

  if (
    ["width", "height", "min-width", "max-width", "gap", "top", "right", "bottom", "left"].includes(
      property,
    )
  ) {
    if (value === "auto") return [`${prefix}-auto`]
    if (value === "100%") return [`${prefix}-full`]
    if (value === "50%") return [`${prefix}-1/2`]
    return [`${prefix}-${spacingToken(value)}`]
  }

  if (property === "box-shadow") {
    return [`shadow-${value.replace(/^shadow-/, "")}`]
  }

  if (property === "padding-bottom" || property === "margin-left") {
    if (value === "auto") return [`${prefix}-auto`]
    return [`${prefix}-${spacingToken(value)}`]
  }

  if (property === "letter-spacing") return [arbitrary("tracking", value)]

  return [arbitrary(prefix, value)]
}

const COLOUR_PROPERTIES: ReadonlySet<string> = new Set([
  "background-color",
  "color",
  "border-color",
  "border-bottom-color",
  "outline-color",
])

function arbitraryValue(value: string): string {
  return `[${value}]`
}

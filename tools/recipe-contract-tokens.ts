/**
 * tools/recipe-contract-tokens — canonical semantic token identities.
 *
 * RECIPE-001b. This is the artifact the authoring rule in
 * docs/contracts/recipe-authoring-guide.md §3.5 references: token *identity* is canonical and
 * shared across profiles, token *mechanism* stays profile-local.
 *
 * Scope of this file: identities and their per-namespace spellings only. Values,
 * light/dark pairs, contrast validation, and migration are THEME-001..005. A recipe
 * definition references an identity from `SEMANTIC_TOKENS`; the emitters translate
 * that identity into the namespace spelling for their profile.
 *
 * Derived from what the four namespaces actually contain today:
 *   - `css`      — `--ui-*` custom properties used by packages/recipes-css
 *   - `tailwind` — theme colour names used by packages/recipes-tailwind, registered as
 *                  Tailwind v4 `@theme` tokens in packages/recipes-tailwind/src/styles/theme.css
 *   - `unocss`   — `--ui-*` custom properties, same runtime namespace as `css` (RECIPE-004).
 *                  UnoCSS has no theme layer of its own; its stylesheet form reuses the CSS
 *                  profile's spellings so setting `--ui-primary` once themes all three profiles.
 *   - `site`     — `--sol-*` semantic tokens from apps/site/src/assets/tokens.css (BRAND-002)
 *
 * RECIPE-002/003 closed the `css`/`tailwind` gaps that existed while the emitters were
 * pending. Remaining `null` entries in either namespace are genuine, recorded gaps —
 * mostly `site`, which is BRAND-002/THEME-002's namespace to complete, not this file's.
 */

/** Namespaces a canonical identity can be spelled in. */
export type TokenNamespace = "css" | "tailwind" | "unocss" | "site"

/** Grouping used for documentation and theme-editor organisation. */
export type TokenCategory =
  "surface" | "foreground" | "intent" | "border" | "focus" | "radius" | "shadow" | "typography"

export interface SemanticToken {
  /** Canonical identity referenced by recipe definitions. */
  id: string
  category: TokenCategory
  description: string
  /**
   * Spelling per namespace. `null` means the namespace has no equivalent — a real
   * gap that RECIPE-002/003/004 or THEME-002/003/004 must close, not an omission.
   */
  namespaces: Record<TokenNamespace, string | null>
  /**
   * Fallback literal for the `css`/`unocss` namespaces' `var(--x, fallback)` form.
   *
   * Values, not identities, are THEME-001's scope — this is not a themeable default,
   * it is the value every shipped `recipes-css` stylesheet already hardcoded as its
   * `var()` fallback before the emitter existed. The CSS/UnoCSS emitters use it so a
   * consumer who has not installed any theme still gets the same visual result as
   * the hand-written stylesheets did. Omit it only for tokens no current stylesheet
   * referenced with a literal fallback.
   */
  cssFallback?: string
}

/**
 * The canonical set.
 *
 * Additions require a THEME-001 decision — a recipe may not invent an identity.
 */
export const SEMANTIC_TOKENS: readonly SemanticToken[] = [
  // ── Surface ────────────────────────────────────────────────────────────────
  {
    id: "surface",
    category: "surface",
    description: "Default page or component background.",
    namespaces: {
      css: "--ui-surface",
      tailwind: "background",
      unocss: "--ui-surface",
      site: "--sol-surface-base",
    },
    cssFallback: "hsl(0 0% 100%)",
  },
  {
    id: "surface-raised",
    category: "surface",
    description: "Background for elevated containers: cards, popovers, menus.",
    namespaces: {
      css: "--ui-surface",
      tailwind: "popover",
      unocss: "--ui-surface",
      site: "--sol-surface-raised",
    },
    cssFallback: "hsl(0 0% 100%)",
  },
  {
    id: "surface-sunken",
    category: "surface",
    description: "Background for recessed areas: wells, inset panels.",
    namespaces: { css: null, tailwind: null, unocss: null, site: "--sol-surface-sunken" },
  },
  {
    id: "surface-overlay",
    category: "surface",
    description: "Scrim behind modal content.",
    namespaces: {
      // Matches the literal scrim colour packages/recipes-css/src/styles/dialog.css
      // already used before this identity existed.
      css: "--ui-surface-overlay",
      tailwind: "overlay",
      unocss: "--ui-surface-overlay",
      site: "--sol-surface-overlay",
    },
    cssFallback: "rgb(0 0 0 / 0.8)",
  },
  {
    id: "surface-muted",
    category: "surface",
    description: "Low-emphasis background: disabled fills, code blocks, table stripes.",
    namespaces: { css: "--ui-muted", tailwind: "muted", unocss: "--ui-muted", site: null },
    cssFallback: "hsl(210 40% 96%)",
  },
  {
    id: "surface-accent",
    category: "surface",
    description: "Hover or highlight background for interactive list rows.",
    namespaces: {
      css: "--ui-accent",
      tailwind: "accent",
      unocss: "--ui-accent",
      site: "--sol-interactive-hover",
    },
    cssFallback: "hsl(0 0% 95%)",
  },
  {
    id: "surface-input",
    category: "surface",
    description: "Background for form control tracks and unfilled inputs.",
    namespaces: {
      // Matches the literal track colour packages/recipes-css/src/styles/switch.css
      // already used before this identity existed.
      css: "--ui-surface-input",
      tailwind: "input",
      unocss: "--ui-surface-input",
      site: null,
    },
    cssFallback: "hsl(0 0% 90%)",
  },

  // ── Foreground ─────────────────────────────────────────────────────────────
  {
    id: "foreground",
    category: "foreground",
    description: "Default body text colour.",
    namespaces: {
      css: "--ui-fg",
      tailwind: "foreground",
      unocss: "--ui-fg",
      site: "--sol-foreground",
    },
    cssFallback: "hsl(222 47% 11%)",
  },
  {
    id: "foreground-muted",
    category: "foreground",
    description: "Secondary text: descriptions, placeholders, list markers.",
    namespaces: {
      css: "--ui-muted-fg",
      tailwind: "muted-foreground",
      unocss: "--ui-muted-fg",
      site: "--sol-foreground-muted",
    },
    cssFallback: "hsl(215 16% 47%)",
  },
  {
    id: "foreground-subtle",
    category: "foreground",
    description: "Lowest-emphasis text: metadata, timestamps.",
    namespaces: { css: null, tailwind: null, unocss: null, site: "--sol-foreground-subtle" },
  },
  {
    id: "foreground-inverse",
    category: "foreground",
    description: "Text on an inverted surface.",
    namespaces: { css: null, tailwind: null, unocss: null, site: "--sol-foreground-inverse" },
  },
  {
    id: "foreground-on-surface-accent",
    category: "foreground",
    description: "Text on `surface-accent`.",
    namespaces: {
      css: null,
      tailwind: "accent-foreground",
      unocss: null,
      site: null,
    },
  },
  {
    id: "foreground-on-surface-raised",
    category: "foreground",
    description: "Text on `surface-raised`.",
    namespaces: {
      css: null,
      tailwind: "popover-foreground",
      unocss: null,
      site: null,
    },
  },

  // ── Intent ─────────────────────────────────────────────────────────────────
  {
    id: "primary",
    category: "intent",
    description: "Primary action fill and active-state accent.",
    namespaces: {
      css: "--ui-primary",
      tailwind: "primary",
      unocss: "--ui-primary",
      site: "--sol-primary",
    },
    cssFallback: "hsl(222 47% 11%)",
  },
  {
    id: "primary-foreground",
    category: "intent",
    description: "Text and icons on `primary`.",
    namespaces: {
      css: "--ui-primary-fg",
      tailwind: "primary-foreground",
      unocss: "--ui-primary-fg",
      site: "--sol-primary-foreground",
    },
    cssFallback: "hsl(0 0% 100%)",
  },
  {
    id: "primary-hover",
    category: "intent",
    description: "Primary fill under pointer hover.",
    namespaces: {
      css: "--ui-primary-hover",
      tailwind: "primary-hover",
      unocss: "--ui-primary-hover",
      site: "--sol-primary-hover",
    },
    cssFallback: "hsl(222 47% 20%)",
  },
  {
    id: "secondary",
    category: "intent",
    description: "Secondary action fill.",
    namespaces: {
      css: "--ui-secondary",
      tailwind: "secondary",
      unocss: "--ui-secondary",
      site: "--sol-secondary",
    },
    cssFallback: "hsl(210 40% 96%)",
  },
  {
    id: "secondary-foreground",
    category: "intent",
    description: "Text and icons on `secondary`.",
    namespaces: {
      css: "--ui-secondary-fg",
      tailwind: "secondary-foreground",
      unocss: "--ui-secondary-fg",
      site: null,
    },
    cssFallback: "hsl(222 47% 11%)",
  },
  {
    id: "secondary-hover",
    category: "intent",
    description: "Secondary fill under pointer hover.",
    namespaces: {
      css: "--ui-secondary-hover",
      tailwind: "secondary-hover",
      unocss: "--ui-secondary-hover",
      site: null,
    },
    cssFallback: "hsl(210 40% 90%)",
  },
  {
    id: "destructive",
    category: "intent",
    description: "Destructive action fill and error accent.",
    namespaces: {
      css: "--ui-destructive",
      tailwind: "destructive",
      unocss: "--ui-destructive",
      site: "--sol-destructive",
    },
    cssFallback: "hsl(0 84% 60%)",
  },
  {
    id: "destructive-foreground",
    category: "intent",
    description: "Text and icons on `destructive`.",
    namespaces: {
      css: "--ui-destructive-fg",
      tailwind: "destructive-foreground",
      unocss: "--ui-destructive-fg",
      site: null,
    },
    cssFallback: "hsl(0 0% 100%)",
  },
  {
    id: "destructive-hover",
    category: "intent",
    description: "Destructive fill under pointer hover.",
    namespaces: {
      css: "--ui-destructive-hover",
      tailwind: "destructive-hover",
      unocss: "--ui-destructive-hover",
      site: null,
    },
    cssFallback: "hsl(0 84% 52%)",
  },
  {
    id: "success",
    category: "intent",
    description: "Success status accent.",
    namespaces: {
      css: "--ui-success-fg",
      tailwind: "success",
      unocss: "--ui-success-fg",
      site: "--sol-success",
    },
    cssFallback: "hsl(142 71% 35%)",
  },
  {
    id: "success-surface",
    category: "intent",
    description: "Success status background.",
    namespaces: {
      css: "--ui-success-bg",
      tailwind: "success-surface",
      unocss: "--ui-success-bg",
      site: null,
    },
    cssFallback: "hsl(142 71% 96%)",
  },
  {
    id: "success-border",
    category: "intent",
    description: "Success status border.",
    namespaces: {
      css: "--ui-success-border",
      tailwind: "success-border",
      unocss: "--ui-success-border",
      site: null,
    },
    cssFallback: "hsl(142 71% 80%)",
  },
  {
    id: "warning",
    category: "intent",
    description: "Warning status accent.",
    namespaces: {
      css: "--ui-warning-fg",
      tailwind: "warning",
      unocss: "--ui-warning-fg",
      site: "--sol-warning",
    },
    cssFallback: "hsl(38 92% 40%)",
  },
  {
    id: "warning-surface",
    category: "intent",
    description: "Warning status background.",
    namespaces: {
      css: "--ui-warning-bg",
      tailwind: "warning-surface",
      unocss: "--ui-warning-bg",
      site: null,
    },
    cssFallback: "hsl(38 92% 95%)",
  },
  {
    id: "warning-border",
    category: "intent",
    description: "Warning status border.",
    namespaces: {
      css: "--ui-warning-border",
      tailwind: "warning-border",
      unocss: "--ui-warning-border",
      site: null,
    },
    cssFallback: "hsl(38 92% 75%)",
  },
  {
    id: "danger",
    category: "intent",
    description: "Error status accent, distinct from the destructive action fill.",
    namespaces: {
      css: "--ui-error-fg",
      tailwind: "danger",
      unocss: "--ui-error-fg",
      site: null,
    },
    // Matches the literal used by alert's error state before this identity existed.
    cssFallback: "hsl(214 80% 30%)",
  },
  {
    id: "danger-surface",
    category: "intent",
    description: "Error status background.",
    namespaces: {
      css: "--ui-error-bg",
      tailwind: "danger-surface",
      unocss: "--ui-error-bg",
      site: null,
    },
    cssFallback: "hsl(214 95% 97%)",
  },
  {
    id: "danger-border",
    category: "intent",
    description: "Error status border.",
    namespaces: {
      css: "--ui-error-border",
      tailwind: "danger-border",
      unocss: "--ui-error-border",
      site: null,
    },
    cssFallback: "hsl(214 80% 80%)",
  },
  {
    id: "info",
    category: "intent",
    description: "Informational status accent.",
    namespaces: {
      css: "--ui-info-fg",
      tailwind: "info",
      unocss: "--ui-info-fg",
      site: null,
    },
    cssFallback: "hsl(214 80% 30%)",
  },
  {
    id: "info-surface",
    category: "intent",
    description: "Informational status background.",
    namespaces: {
      css: "--ui-info-bg",
      tailwind: "info-surface",
      unocss: "--ui-info-bg",
      site: null,
    },
    cssFallback: "hsl(214 95% 97%)",
  },
  {
    id: "info-border",
    category: "intent",
    description: "Informational status border.",
    namespaces: {
      css: "--ui-info-border",
      tailwind: "info-border",
      unocss: "--ui-info-border",
      site: null,
    },
    cssFallback: "hsl(214 80% 80%)",
  },

  // ── Border ─────────────────────────────────────────────────────────────────
  {
    id: "border",
    category: "border",
    description: "Default separator and control border.",
    namespaces: {
      css: "--ui-border",
      tailwind: "border",
      unocss: "--ui-border",
      site: "--sol-border",
    },
    cssFallback: "hsl(214 32% 91%)",
  },
  {
    id: "border-muted",
    category: "border",
    description: "Low-emphasis divider.",
    namespaces: { css: null, tailwind: null, unocss: null, site: "--sol-border-muted" },
  },
  {
    id: "border-active",
    category: "border",
    description: "Border of a selected or active control.",
    namespaces: { css: null, tailwind: null, unocss: null, site: "--sol-border-active" },
  },

  // ── Focus ──────────────────────────────────────────────────────────────────
  {
    id: "focus-ring",
    category: "focus",
    description: "Focus-visible ring colour.",
    namespaces: {
      // No shipped stylesheet declared a literal focus-ring colour before this
      // identity existed — every profile used the primary intent colour, which
      // this spelling now makes explicit and overridable independently.
      css: "--ui-focus-ring",
      tailwind: "ring",
      unocss: "--ui-focus-ring",
      site: "--sol-focus-ring",
    },
    cssFallback: "hsl(222 47% 11%)",
  },
  {
    id: "focus-ring-width",
    category: "focus",
    description: "Focus-visible ring width.",
    namespaces: { css: null, tailwind: null, unocss: null, site: "--sol-focus-ring-width" },
  },

  // ── Radius ─────────────────────────────────────────────────────────────────
  {
    id: "radius",
    category: "radius",
    description: "Default corner radius for controls and containers.",
    namespaces: {
      css: "--ui-radius",
      tailwind: "radius",
      unocss: "--ui-radius",
      site: "--sol-radius-md",
    },
    cssFallback: "0.375rem",
  },
  {
    id: "radius-sm",
    category: "radius",
    description: "Small corner radius.",
    namespaces: {
      // Matches the literal 0.25rem radius used throughout checkbox/menu/popover/
      // select/toast/tooltip/prose before this identity existed.
      css: "--ui-radius-sm",
      tailwind: "radius-sm",
      unocss: "--ui-radius-sm",
      site: "--sol-radius-sm",
    },
    cssFallback: "0.25rem",
  },
  {
    id: "radius-lg",
    category: "radius",
    description: "Large corner radius.",
    namespaces: {
      css: "--ui-radius-lg",
      tailwind: "radius-lg",
      unocss: "--ui-radius-lg",
      site: "--sol-radius-lg",
    },
    cssFallback: "0.5rem",
  },
  {
    id: "radius-full",
    category: "radius",
    description: "Fully rounded, for pills and thumbs.",
    namespaces: {
      // Matches the literal 9999px radius used by switch before this identity existed.
      css: "--ui-radius-full",
      tailwind: "radius-full",
      unocss: "--ui-radius-full",
      site: "--sol-radius-full",
    },
    cssFallback: "9999px",
  },

  // ── Shadow ─────────────────────────────────────────────────────────────────
  {
    id: "shadow-sm",
    category: "shadow",
    description: "Subtle elevation.",
    namespaces: {
      // Matches the literal shadow used by switch/tooltip before this identity existed.
      css: "--ui-shadow-sm",
      tailwind: "shadow-sm",
      unocss: "--ui-shadow-sm",
      site: "--sol-shadow-sm",
    },
    cssFallback: "0 1px 3px rgb(0 0 0 / 0.1)",
  },
  {
    id: "shadow-md",
    category: "shadow",
    description: "Standard elevation for popovers and cards.",
    namespaces: {
      // Matches the literal shadow used by menu/popover/select/toast before this
      // identity existed.
      css: "--ui-shadow-md",
      tailwind: "shadow-md",
      unocss: "--ui-shadow-md",
      site: "--sol-shadow-md",
    },
    cssFallback: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
  {
    id: "shadow-lg",
    category: "shadow",
    description: "High elevation for modals and drawers.",
    namespaces: {
      // Matches the literal shadow used by dialog before this identity existed.
      css: "--ui-shadow-lg",
      tailwind: "shadow-lg",
      unocss: "--ui-shadow-lg",
      site: "--sol-shadow-lg",
    },
    cssFallback: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  {
    id: "font-sans",
    category: "typography",
    description: "UI and body typeface stack.",
    namespaces: {
      css: "--ui-font-sans",
      tailwind: null,
      unocss: "--ui-font-sans",
      site: null,
    },
    cssFallback: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "font-mono",
    category: "typography",
    description: "Code, command, and API-symbol typeface stack.",
    namespaces: {
      css: "--ui-font-mono",
      tailwind: null,
      unocss: "--ui-font-mono",
      site: null,
    },
    cssFallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },

  // ── Type Scale (THEME-006) ─────────────────────────────────────────────
  {
    id: "font-size-xs",
    category: "typography",
    description: "Smallest text: captions, metadata, fine print.",
    namespaces: {
      css: "--ui-font-size-xs",
      tailwind: "fontSize-xs",
      unocss: "--ui-font-size-xs",
      site: "--sol-font-size-xs",
    },
    cssFallback: "0.75rem",
  },
  {
    id: "line-height-xs",
    category: "typography",
    description: "Line height for `font-size-xs`.",
    namespaces: {
      css: "--ui-line-height-xs",
      tailwind: null,
      unocss: "--ui-line-height-xs",
      site: "--sol-line-height-xs",
    },
    cssFallback: "1rem",
  },
  {
    id: "font-size-sm",
    category: "typography",
    description: "Small text: helper text, fine labels.",
    namespaces: {
      css: "--ui-font-size-sm",
      tailwind: "fontSize-sm",
      unocss: "--ui-font-size-sm",
      site: "--sol-font-size-sm",
    },
    cssFallback: "0.875rem",
  },
  {
    id: "line-height-sm",
    category: "typography",
    description: "Line height for `font-size-sm`.",
    namespaces: {
      css: "--ui-line-height-sm",
      tailwind: null,
      unocss: "--ui-line-height-sm",
      site: "--sol-line-height-sm",
    },
    cssFallback: "1.25rem",
  },
  {
    id: "font-size-base",
    category: "typography",
    description: "Default body text for UI and controls.",
    namespaces: {
      css: "--ui-font-size-base",
      tailwind: "fontSize-base",
      unocss: "--ui-font-size-base",
      site: "--sol-font-size-base",
    },
    cssFallback: "0.875rem",
  },
  {
    id: "line-height-base",
    category: "typography",
    description: "Line height for `font-size-base`.",
    namespaces: {
      css: "--ui-line-height-base",
      tailwind: null,
      unocss: "--ui-line-height-base",
      site: "--sol-line-height-base",
    },
    cssFallback: "1.25rem",
  },
  {
    id: "font-size-md",
    category: "typography",
    description: "Medium text: section subtitles, prominent labels.",
    namespaces: {
      css: "--ui-font-size-md",
      tailwind: "fontSize-md",
      unocss: "--ui-font-size-md",
      site: "--sol-font-size-md",
    },
    cssFallback: "1.125rem",
  },
  {
    id: "line-height-md",
    category: "typography",
    description: "Line height for `font-size-md`.",
    namespaces: {
      css: "--ui-line-height-md",
      tailwind: null,
      unocss: "--ui-line-height-md",
      site: "--sol-line-height-md",
    },
    cssFallback: "1.5rem",
  },
  {
    id: "font-size-lg",
    category: "typography",
    description: "Large headings: page titles, card headings.",
    namespaces: {
      css: "--ui-font-size-lg",
      tailwind: "fontSize-lg",
      unocss: "--ui-font-size-lg",
      site: "--sol-font-size-lg",
    },
    cssFallback: "1.25rem",
  },
  {
    id: "line-height-lg",
    category: "typography",
    description: "Line height for `font-size-lg`.",
    namespaces: {
      css: "--ui-line-height-lg",
      tailwind: null,
      unocss: "--ui-line-height-lg",
      site: "--sol-line-height-lg",
    },
    cssFallback: "1.5rem",
  },
  {
    id: "font-size-xl",
    category: "typography",
    description: "Hero and page-heading text.",
    namespaces: {
      css: "--ui-font-size-xl",
      tailwind: "fontSize-xl",
      unocss: "--ui-font-size-xl",
      site: "--sol-font-size-xl",
    },
    cssFallback: "1.875rem",
  },
  {
    id: "line-height-xl",
    category: "typography",
    description: "Line height for `font-size-xl`.",
    namespaces: {
      css: "--ui-line-height-xl",
      tailwind: null,
      unocss: "--ui-line-height-xl",
      site: "--sol-line-height-xl",
    },
    cssFallback: "2.25rem",
  },
]

const TOKEN_INDEX = new Map(SEMANTIC_TOKENS.map((token) => [token.id, token]))

/** Canonical identities as a set, for validator membership checks. */
export const SEMANTIC_TOKEN_IDS: ReadonlySet<string> = new Set(TOKEN_INDEX.keys())

export function semanticToken(id: string): SemanticToken | undefined {
  return TOKEN_INDEX.get(id)
}

export function isSemanticToken(id: string): boolean {
  return TOKEN_INDEX.has(id)
}

/** Namespace spelling for an identity, or `undefined` when that namespace has no equivalent. */
export function tokenSpelling(id: string, namespace: TokenNamespace): string | undefined {
  return TOKEN_INDEX.get(id)?.namespaces[namespace] ?? undefined
}

/** The `css`/`unocss` var() fallback literal for an identity, if one is recorded. */
export function tokenCssFallback(id: string): string | undefined {
  return TOKEN_INDEX.get(id)?.cssFallback
}

/**
 * Identities a namespace cannot express.
 *
 * A recipe referencing one of these is emittable only in the namespaces that have a
 * spelling; the emitter must either add the token or record a documented exception.
 */
export function unmappedTokens(namespace: TokenNamespace): SemanticToken[] {
  return SEMANTIC_TOKENS.filter((token) => token.namespaces[namespace] === null)
}

/**
 * Legacy `--ui-*` spellings with no canonical identity.
 *
 * No active aliases remain; the set is kept as empty to document that any
 * `--ui-*` usage must resolve to a canonical identity in SEMANTIC_TOKENS.
 */
export const LEGACY_TOKEN_ALIASES: Readonly<Record<string, string>> = {}

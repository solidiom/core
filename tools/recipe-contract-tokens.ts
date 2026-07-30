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
 * Derived from what the three namespaces actually contain today:
 *   - `css`      — 31 `--ui-*` custom properties used by packages/recipes-css
 *   - `tailwind` — theme colour names used by packages/recipes-tailwind, defined only
 *                  in apps/docs/src/styles.css (deleted by CUT-003 — see UNRESOLVED below)
 *   - `site`     — `--sol-*` semantic tokens from apps/site/src/assets/tokens.css (BRAND-002)
 *
 * UNRESOLVED (recorded, not fixed here): the `tailwind` namespace has no definition
 * inside packages/. After CUT-003 removes apps/docs, every Tailwind recipe references
 * undefined theme names. RECIPE-003 must ship the theme contract as a package artifact.
 */

/** Namespaces a canonical identity can be spelled in. */
export type TokenNamespace = "css" | "tailwind" | "site"

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
    namespaces: { css: "--ui-surface", tailwind: "background", site: "--sol-surface-base" },
  },
  {
    id: "surface-raised",
    category: "surface",
    description: "Background for elevated containers: cards, popovers, menus.",
    namespaces: { css: null, tailwind: "popover", site: "--sol-surface-raised" },
  },
  {
    id: "surface-sunken",
    category: "surface",
    description: "Background for recessed areas: wells, inset panels.",
    namespaces: { css: null, tailwind: null, site: "--sol-surface-sunken" },
  },
  {
    id: "surface-overlay",
    category: "surface",
    description: "Scrim behind modal content.",
    namespaces: { css: null, tailwind: null, site: "--sol-surface-overlay" },
  },
  {
    id: "surface-muted",
    category: "surface",
    description: "Low-emphasis background: disabled fills, code blocks, table stripes.",
    namespaces: { css: "--ui-muted", tailwind: "muted", site: null },
  },
  {
    id: "surface-accent",
    category: "surface",
    description: "Hover or highlight background for interactive list rows.",
    namespaces: { css: "--ui-accent", tailwind: "accent", site: "--sol-interactive-hover" },
  },
  {
    id: "surface-input",
    category: "surface",
    description: "Background for form control tracks and unfilled inputs.",
    namespaces: { css: null, tailwind: "input", site: null },
  },

  // ── Foreground ─────────────────────────────────────────────────────────────
  {
    id: "foreground",
    category: "foreground",
    description: "Default body text colour.",
    namespaces: { css: "--ui-fg", tailwind: "foreground", site: "--sol-foreground" },
  },
  {
    id: "foreground-muted",
    category: "foreground",
    description: "Secondary text: descriptions, placeholders, list markers.",
    namespaces: {
      css: "--ui-muted-fg",
      tailwind: "muted-foreground",
      site: "--sol-foreground-muted",
    },
  },
  {
    id: "foreground-subtle",
    category: "foreground",
    description: "Lowest-emphasis text: metadata, timestamps.",
    namespaces: { css: null, tailwind: null, site: "--sol-foreground-subtle" },
  },
  {
    id: "foreground-inverse",
    category: "foreground",
    description: "Text on an inverted surface.",
    namespaces: { css: null, tailwind: null, site: "--sol-foreground-inverse" },
  },
  {
    id: "foreground-on-surface-accent",
    category: "foreground",
    description: "Text on `surface-accent`.",
    namespaces: { css: null, tailwind: "accent-foreground", site: null },
  },
  {
    id: "foreground-on-surface-raised",
    category: "foreground",
    description: "Text on `surface-raised`.",
    namespaces: { css: null, tailwind: "popover-foreground", site: null },
  },

  // ── Intent ─────────────────────────────────────────────────────────────────
  {
    id: "primary",
    category: "intent",
    description: "Primary action fill and active-state accent.",
    namespaces: { css: "--ui-primary", tailwind: "primary", site: "--sol-primary" },
  },
  {
    id: "primary-foreground",
    category: "intent",
    description: "Text and icons on `primary`.",
    namespaces: {
      css: "--ui-primary-fg",
      tailwind: "primary-foreground",
      site: "--sol-primary-foreground",
    },
  },
  {
    id: "primary-hover",
    category: "intent",
    description: "Primary fill under pointer hover.",
    namespaces: { css: "--ui-primary-hover", tailwind: null, site: "--sol-primary-hover" },
  },
  {
    id: "secondary",
    category: "intent",
    description: "Secondary action fill.",
    namespaces: { css: "--ui-secondary", tailwind: "secondary", site: "--sol-secondary" },
  },
  {
    id: "secondary-foreground",
    category: "intent",
    description: "Text and icons on `secondary`.",
    namespaces: { css: "--ui-secondary-fg", tailwind: "secondary-foreground", site: null },
  },
  {
    id: "secondary-hover",
    category: "intent",
    description: "Secondary fill under pointer hover.",
    namespaces: { css: "--ui-secondary-hover", tailwind: null, site: null },
  },
  {
    id: "destructive",
    category: "intent",
    description: "Destructive action fill and error accent.",
    namespaces: { css: "--ui-destructive", tailwind: "destructive", site: "--sol-destructive" },
  },
  {
    id: "destructive-foreground",
    category: "intent",
    description: "Text and icons on `destructive`.",
    namespaces: { css: "--ui-destructive-fg", tailwind: "destructive-foreground", site: null },
  },
  {
    id: "destructive-hover",
    category: "intent",
    description: "Destructive fill under pointer hover.",
    namespaces: { css: "--ui-destructive-hover", tailwind: null, site: null },
  },
  {
    id: "success",
    category: "intent",
    description: "Success status accent.",
    namespaces: { css: "--ui-success-fg", tailwind: null, site: "--sol-success" },
  },
  {
    id: "success-surface",
    category: "intent",
    description: "Success status background.",
    namespaces: { css: "--ui-success-bg", tailwind: null, site: null },
  },
  {
    id: "success-border",
    category: "intent",
    description: "Success status border.",
    namespaces: { css: "--ui-success-border", tailwind: null, site: null },
  },
  {
    id: "warning",
    category: "intent",
    description: "Warning status accent.",
    namespaces: { css: "--ui-warning-fg", tailwind: null, site: "--sol-warning" },
  },
  {
    id: "warning-surface",
    category: "intent",
    description: "Warning status background.",
    namespaces: { css: "--ui-warning-bg", tailwind: null, site: null },
  },
  {
    id: "warning-border",
    category: "intent",
    description: "Warning status border.",
    namespaces: { css: "--ui-warning-border", tailwind: null, site: null },
  },
  {
    id: "danger",
    category: "intent",
    description: "Error status accent, distinct from the destructive action fill.",
    namespaces: { css: "--ui-error-fg", tailwind: null, site: null },
  },
  {
    id: "danger-surface",
    category: "intent",
    description: "Error status background.",
    namespaces: { css: "--ui-error-bg", tailwind: null, site: null },
  },
  {
    id: "danger-border",
    category: "intent",
    description: "Error status border.",
    namespaces: { css: "--ui-error-border", tailwind: null, site: null },
  },
  {
    id: "info",
    category: "intent",
    description: "Informational status accent.",
    namespaces: { css: "--ui-info-fg", tailwind: null, site: null },
  },
  {
    id: "info-surface",
    category: "intent",
    description: "Informational status background.",
    namespaces: { css: "--ui-info-bg", tailwind: null, site: null },
  },
  {
    id: "info-border",
    category: "intent",
    description: "Informational status border.",
    namespaces: { css: "--ui-info-border", tailwind: null, site: null },
  },

  // ── Border ─────────────────────────────────────────────────────────────────
  {
    id: "border",
    category: "border",
    description: "Default separator and control border.",
    namespaces: { css: "--ui-border", tailwind: "border", site: "--sol-border" },
  },
  {
    id: "border-muted",
    category: "border",
    description: "Low-emphasis divider.",
    namespaces: { css: null, tailwind: null, site: "--sol-border-muted" },
  },
  {
    id: "border-active",
    category: "border",
    description: "Border of a selected or active control.",
    namespaces: { css: null, tailwind: null, site: "--sol-border-active" },
  },

  // ── Focus ──────────────────────────────────────────────────────────────────
  {
    id: "focus-ring",
    category: "focus",
    description: "Focus-visible ring colour.",
    namespaces: { css: null, tailwind: "ring", site: "--sol-focus-ring" },
  },
  {
    id: "focus-ring-width",
    category: "focus",
    description: "Focus-visible ring width.",
    namespaces: { css: null, tailwind: null, site: "--sol-focus-ring-width" },
  },

  // ── Radius ─────────────────────────────────────────────────────────────────
  {
    id: "radius",
    category: "radius",
    description: "Default corner radius for controls and containers.",
    namespaces: { css: "--ui-radius", tailwind: null, site: "--sol-radius-md" },
  },
  {
    id: "radius-sm",
    category: "radius",
    description: "Small corner radius.",
    namespaces: { css: null, tailwind: null, site: "--sol-radius-sm" },
  },
  {
    id: "radius-lg",
    category: "radius",
    description: "Large corner radius.",
    namespaces: { css: null, tailwind: null, site: "--sol-radius-lg" },
  },
  {
    id: "radius-full",
    category: "radius",
    description: "Fully rounded, for pills and thumbs.",
    namespaces: { css: null, tailwind: null, site: "--sol-radius-full" },
  },

  // ── Shadow ─────────────────────────────────────────────────────────────────
  {
    id: "shadow-sm",
    category: "shadow",
    description: "Subtle elevation.",
    namespaces: { css: null, tailwind: null, site: "--sol-shadow-sm" },
  },
  {
    id: "shadow-md",
    category: "shadow",
    description: "Standard elevation for popovers and cards.",
    namespaces: { css: null, tailwind: null, site: "--sol-shadow-md" },
  },
  {
    id: "shadow-lg",
    category: "shadow",
    description: "High elevation for modals and drawers.",
    namespaces: { css: null, tailwind: null, site: "--sol-shadow-lg" },
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  {
    id: "font-sans",
    category: "typography",
    description: "UI and body typeface stack.",
    namespaces: { css: "--ui-font-sans", tailwind: null, site: null },
  },
  {
    id: "font-mono",
    category: "typography",
    description: "Code, command, and API-symbol typeface stack.",
    namespaces: { css: "--ui-font-mono", tailwind: null, site: null },
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
 * `--ui-foreground` is used once (packages/recipes-css/src/styles/badge.css) where every
 * other stylesheet uses `--ui-fg`. It is a typo-level duplicate, not a distinct token.
 */
export const LEGACY_TOKEN_ALIASES: Readonly<Record<string, string>> = {
  "--ui-foreground": "--ui-fg",
}

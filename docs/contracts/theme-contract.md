---
id: theme-contract
title: "Canonical Theme Contract"
sidebar_label: Theme Contract
description: The canonical theme definition schema, token-value model, validation rules, migration mechanism, generated output, and light/dark requirements.
doc_type: reference
audience: "Solidiom contributors, theme-generator and theme-builder authors"
tags: [themes, contract, tokens, styling, light-dark, css, tailwind, unocss]
lifecycle: current
---

> **Purpose:** the normative reference for the canonical theme definition schema and its generated output. `PRESET-001..004`'s shipped presets and `BUILDER-004/005`'s import/export/share-link mechanisms consume this shape; the CSS, Tailwind, and UnoCSS emitters here produce every installable theme artifact from it.

**Contract version:** 1
**Status:** schema, validator, migration mechanism, one reference definition (THEME-001), CSS/Tailwind/UnoCSS generation (THEME-002/003/004), and the cross-output parity/contrast/round-trip audit (THEME-005) are all shipped. `audit:theme-parity` passes cleanly with no exceptions.
**Task:** `docs/plans/website-tasks.md` §7.2 THEME-001..005
**Depends on:** BRAND-002 (`apps/site/src/assets/tokens.css`), RECIPE-001 (`docs/contracts/recipe-contract.md` §4 token model)

---

## 1. Artifacts

| Artifact                              | Purpose                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `tools/theme-contract-schema.ts`      | `ThemeDefinition` type, `THEME_SCHEMA_VERSION`, traversal/resolution helpers                                        |
| `tools/theme-contract-contrast.ts`    | Dependency-free WCAG relative luminance and contrast ratio                                                          |
| `tools/theme-contract-validate.ts`    | `validateThemeDefinition()` — the rule checker                                                                      |
| `tools/theme-contract-migrate.ts`     | `migrateThemeDocument()` — the versioned migration chain                                                            |
| `tools/theme-contract-definitions.ts` | Reference theme(s), starting with `solidiom-default`                                                                |
| `tools/theme-contract.ts`             | CLI: `pnpm run theme:contract`                                                                                      |
| `tools/theme-emit-css.ts`             | CSS variable emitter (THEME-002): `pnpm run theme:emit:css[:check]`                                                 |
| `tools/theme-emit-tailwind.ts`        | Tailwind `@theme` mapping emitter (THEME-003): `pnpm run theme:emit:tailwind[:check]`                               |
| `tools/theme-emit-unocss.ts`          | UnoCSS preflight emitter (THEME-004): `pnpm run theme:emit:unocss[:check]`                                          |
| `tools/audit-theme-parity.ts`         | Cross-output parity, contrast matrix, and round-trip audit (THEME-005): `pnpm run audit:theme-parity`               |
| `packages/themes`                     | Generated output package: `src/css/<slug>.css` (THEME-002), `src/tailwind/<slug>.css` (THEME-003)                   |
| `packages/unocss-preset`              | `presetSolidiom({ theme: "<slug>" })` splices a shipped theme's `--ui-*` preflight into a UnoCSS config (THEME-004) |

Every `.ts` artifact above has a co-located `*.test.ts`.

## 2. Definition shape

```ts
interface ThemeDefinition {
  schemaVersion: 1
  meta: {
    name: string // human-readable, shown in the theme directory and builder
    slug: string // stable, kebab-case, unique across the catalog
    description: string
    kind: "preset" | "custom"
    author?: string
  }
  modes: {
    light: Record<string, ThemeTokenValue> // mandatory
    dark: Record<string, ThemeTokenValue> // mandatory
  }
}

type ThemeTokenValue = string | { ref: string }
```

### 2.1 Token identity vs. value

A theme assigns **values** to the canonical token **identities** declared in
`tools/recipe-contract-tokens.ts` (RECIPE-001 §4). This contract does not mint new
identities — a theme that needs one is a RECIPE-001 change first. `modes.light` and
`modes.dark` are `Record<string, ThemeTokenValue>` rather than a type keyed by the
closed identity set, because a theme may validly omit an identity that has no `site`
namespace spelling yet; the _validator_ (§3.5) enforces which identities are legal,
not the type.

### 2.2 Values and references

A value is either a literal string (a colour, a length, a timing value — whatever the
token's category expects) or `{ ref: "<identity>" }`, which aliases another token's
_value in the same mode_. This lets a theme declare `primary-hover` as "the same as
`primary`" without repeating the literal, and matches how
`apps/site/src/assets/tokens.css` aliases `--focus-ring` to the primary colour.

A reference may not cross modes: `light.primary-hover` can reference `light.primary`
but never `dark.primary`. Crossing modes would make one mode's correctness depend on
the other's, which contradicts §2.3.

### 2.3 Light and dark are both mandatory and independent

`modes.light` and `modes.dark` are both required, non-empty maps — there is no "base
plus dark overrides" delta form. This mirrors BRAND-002's documented architecture: dark
mode is an independently designed surface hierarchy, not an inversion of light. The
validator's §4 rule rejects a theme whose dark mode has not actually authored a
different value for any shared colour token.

## 3. Validation rules (THEME-001)

`pnpm run theme:contract`, or call `validateThemeDefinition(definition)` directly.

| Rule             | Rejects                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| envelope         | Wrong `schemaVersion`; missing/blank `meta.name`, `meta.slug`, `meta.description`; non-kebab-case slug; invalid `meta.kind`; a missing or empty `modes.light`/`modes.dark` |
| §1 known tokens  | A token identity that is not in `recipe-contract-tokens.ts`'s canonical set                                                                                                |
| §2 baseline set  | Either mode missing one of `REQUIRED_BASELINE_TOKENS` (see §3.1 below)                                                                                                     |
| §3 references    | A `{ ref }` naming an identity undeclared in the _same_ mode, or a reference cycle                                                                                         |
| §4 independence  | Dark mode's shared colour tokens are all byte-identical to light's (radius/shadow tokens are exempt — they may legitimately match)                                         |
| §5 legible pairs | `foreground`/`surface`, `foreground`/`surface-raised`, or `primary-foreground`/`primary` below a 3:1 WCAG contrast floor, in either mode, when both values can be parsed   |

`tools/theme-contract-validate.test.ts` ships an invalid fixture per rule.

### 3.1 The required baseline

`REQUIRED_BASELINE_TOKENS` (`tools/theme-contract-validate.ts`) is deliberately smaller
than "all 48 canonical identities":

```
surface, surface-raised, foreground, foreground-muted, border,
primary, primary-foreground, primary-hover, focus-ring, destructive
```

Many identities have no `site` namespace spelling yet — a real, recorded gap
(`recipe-contract-tokens.ts`'s `null` entries), not an oversight. Requiring every
identity here would fail every theme until that gap closes. The baseline is the
minimum a theme cannot omit without breaking a legible surface, a legible primary
action, a destructive/error indicator, and a working focus ring.

### 3.2 Contrast is a floor, not the audit

§5 checks three mandatory pairs against a 3:1 WCAG floor using the dependency-free
luminance/contrast calculator (`tools/theme-contract-contrast.ts`) that understands hex
and `rgb()`/`rgba()` literals. It does not parse `hsl()` — if a value's colour form
cannot be parsed, the rule is skipped for that value rather than treated as a failure or
a pass. §5 below (THEME-005) is the exhaustive audit: every intent colour against every
surface it applies to, the stricter 4.5:1 body-text minimum, and parity across every
generated profile's actual output.

## 4. Generated output (THEME-002/003/004)

Each emitter reads `tools/theme-contract-definitions.ts`'s `REFERENCE_THEMES` and writes
one generated artifact per shipped theme:

- **THEME-002 (`theme-emit-css.ts`)** writes `packages/themes/src/css/<slug>.css`:
  `:root[data-theme="light"]`/`:root[data-theme="dark"]` blocks assigning every token
  identity's `css`-namespace spelling (`--ui-*`) to that theme's resolved value. Installing
  this stylesheet is what makes `--ui-primary` resolve to the theme's colour instead of a
  recipe's own hardcoded fallback.
- **THEME-003 (`theme-emit-tailwind.ts`)** writes `packages/themes/src/tailwind/<slug>.css`:
  a Tailwind v4 `@theme` block registering every identity with a `tailwind` spelling under
  its category's variable namespace (`--color-*`, `--radius-*`, `--shadow-*`), each resolving
  `var(--ui-*, <this theme's light-mode value>)` — the fallback keeps the profile visually
  correct even before a `data-theme` attribute is set. This supersedes
  `packages/recipes-tailwind/src/styles/theme.css`'s hand-maintained fallback literals for
  a consumer who installs a specific theme; that hand-maintained file remains the profile's
  own zero-theme-installed baseline.
- **THEME-004 (`theme-emit-unocss.ts`)** writes
  `packages/unocss-preset/src/generated-theme-preflights.ts`: the same `--ui-*` assignments
  as THEME-002, shaped as `SOLIDIOM_THEME_PREFLIGHTS` data (UnoCSS has no `@theme`-equivalent
  layer of its own — RECIPE-004's `unocss` namespace already re-spells the same runtime
  variables `css` uses). `presetSolidiom({ theme: "<slug>" })` splices the matching entry into
  the returned preset's `preflights` array, so a consumer themes every profile without a
  separate stylesheet import.

### 4.1 The `--ui-surface` collision

`surface` and `surface-raised` both spell `--ui-surface` in the `css`/`unocss` namespaces
by design (`recipe-contract-tokens.ts`) — those profiles do not distinguish base vs. raised
surfaces at the runtime-variable level. A theme that assigns them different values (the
reference theme does: `#F8FAFC` vs `#FFFFFF` in light mode) would otherwise produce two
conflicting `--ui-surface` declarations in the same rule, with the later one winning by CSS
cascade order — silently order-dependent rather than a deliberate choice. Both emitters
resolve this the same way: the earlier-declared identity in `SEMANTIC_TOKENS` wins
deterministically (`surface` before `surface-raised`), independent of a theme's own key
order.

## 5. Cross-output parity, contrast, and round-trip audit (THEME-005)

`pnpm run audit:theme-parity` runs four independent checks:

1. **Generated freshness** — delegates to each emitter's own `--check` mode.
2. **Cross-output parity** — the CSS and UnoCSS profiles assign the same value to the same
   `--ui-*` variable in the same mode. They share a runtime namespace at consumption time, so
   a divergence here is a real emitter bug, not a legitimate profile difference.
3. **Contrast matrix** — a WCAG AA floor on the pairs below, exceeding THEME-001's §5 floor:

   | Pair                              | Minimum | Rationale                                                       |
   | --------------------------------- | ------: | --------------------------------------------------------------- |
   | `foreground` on `surface`         |   4.5:1 | Body text (WCAG 1.4.3)                                          |
   | `foreground` on `surface-raised`  |   4.5:1 | Body text on elevated containers                                |
   | `foreground-muted` on `surface`   |   4.5:1 | Secondary/muted text is still body text                         |
   | `primary-foreground` on `primary` |   4.5:1 | Button/fill label text                                          |
   | `primary` on `surface`            |     3:1 | Non-text: primary accents must remain visible (WCAG 1.4.11)     |
   | `focus-ring` on `surface`         |     3:1 | Non-text: the focus indicator must remain visible (WCAG 1.4.11) |

   A generic `border`/`surface` pair is deliberately **not** checked: WCAG 1.4.11 applies to
   a control's state-conveying boundary, not to every decorative divider, and several
   accepted "border-first" aesthetics — including this reference theme's, see
   `apps/site/src/assets/tokens.css`'s header comment — intentionally keep dividers
   low-contrast as a design choice, not a defect.

4. **Round-trip** — `JSON.parse(JSON.stringify(definition))` deep-equals the source
   `ThemeDefinition`, which `BUILDER-004`/`BUILDER-005`'s persistence depends on.

All four checks pass cleanly for every shipped theme; `.github/workflows/ci.yml` runs
`pnpm run audit:theme-parity` as a blocking step.

### 5.1 Resolved finding: `solidiom-default`'s light-mode primary/primary-foreground pair

`primary-foreground` (`#FFFFFF`) on `primary` previously resolved to **4.36:1** in light
mode, just under the 4.5:1 body-text minimum above (BRAND-002's original `#6D66F1`). The
light-mode primary was darkened by roughly one point of HSL lightness, at the same hue
and saturation, to **`#6961F1`** — resolving to 4.58:1 — in
`apps/site/src/assets/tokens.css` (`--sol-primary`, `--sol-border-active`,
`--sol-focus-ring`, and the derived `--sol-interactive-hover`/`--sol-interactive-active`
rgba values) and `tools/theme-contract-definitions.ts` (`primary`, `border-active`;
`focus-ring` already referenced `primary` via `{ ref }` and updated automatically). The
shift is visually negligible and does not change the brand's hue or saturation identity.
Dark mode's `#8B83F8` and the light-mode hover state `#5B54E0` already passed and were
left unchanged.

The literal brand mark (`apps/site/src/assets/brand/*.svg`, the PWA icons, and
`manifest.webmanifest`'s `theme_color`) intentionally keeps the original `#6D66F1` — a
logo is not held to text-contrast rules, and diverging the _UI token_ from the _brand
mark_ was a deliberate choice, not an oversight.

`tools/audit-theme-parity.test.ts` carries a regression guard asserting the full contrast
matrix passes with zero violations.

## 6. Migration

`tools/theme-contract-migrate.ts` implements the pattern `docs/contracts/recipe-contract.md` §9 described but never built: a migration is a pure `(document: unknown) => unknown` step tagged with the `from`/`to` schema versions it bridges. `migrateThemeDocument()` walks the chain from a stored document's declared version up to `THEME_SCHEMA_VERSION`, throwing `UnmigratableThemeDocumentError` when:

- the document's version is _newer_ than the running build understands (an older
  client opened a share link or file a newer build created), or
- an older version has no registered step to advance it (a gap in the chain).

`MIGRATIONS` is empty today — `THEME_SCHEMA_VERSION` is `1` and no prior version ever
shipped, so there is nothing to migrate from yet. The mechanism exists so the pattern is
established before it is needed: BUILDER-005's URL-encoded share links and BUILDER-004's
JSON export/import both persist a `ThemeDefinition` document indefinitely, so a future
schema version change must not silently break every previously created link or file.

`migrateThemeDocument()` only repairs _shape_. Callers must still run
`validateThemeDefinition()` on the migrated result — migration and validation stay
separate concerns, matching the recipe contract's own split between its schema and its
validator.

## 7. Authoring a theme

1. Pick every identity your theme intends to restyle from `recipe-contract-tokens.ts`'s
   canonical set; do not invent a new identity here.
2. Author `modes.light` and `modes.dark` as complete, independent value maps — write
   dark mode's own colours, don't invert light's.
3. Cover at least `REQUIRED_BASELINE_TOKENS` in both modes.
4. Use `{ ref }` for a token that intentionally repeats another token's value in the
   same mode (for example, `focus-ring` mirroring `primary`).
5. Run `pnpm run theme:contract`.
6. Add the theme to `REFERENCE_THEMES` and to `packages/themes/src/meta.ts`'s
   `SHIPPED_THEMES`, then run `pnpm run theme:emit:css`, `theme:emit:tailwind`, and
   `theme:emit:unocss`.
7. Run `pnpm run audit:theme-parity` and resolve every finding it can verify (contrast,
   parity, round-trip) before shipping.

## 8. Versioning

`THEME_SCHEMA_VERSION` is `1`. A change that would invalidate an already-persisted
theme document increments it, and a migration step (§6) must ship in the same change
so existing share links, exported JSON files, and installed presets keep resolving.

## 9. Not yet done

| Gap                                                       | Owner                          |
| --------------------------------------------------------- | ------------------------------ |
| Additional shipped presets (Ocean, Forest, Slate, Aurora) | PRESET-001..004                |
| Theme-builder UI consuming this schema                    | BUILDER-001..006               |
| Tailwind v3 `theme.extend.colors` mapping (v4-only today) | Future task, not yet scheduled |

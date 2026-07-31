---
id: theme-contract
title: "Canonical Theme Contract"
sidebar_label: Theme Contract
description: The canonical theme definition schema, token-value model, validation rules, migration mechanism, and light/dark requirements.
doc_type: reference
audience: "Solidiom contributors, theme-generator and theme-builder authors"
tags: [themes, contract, tokens, styling, light-dark, css, tailwind, unocss]
lifecycle: current
---

> **Purpose:** the normative reference for the canonical theme definition schema. THEME-002/003/004's CSS, Tailwind, and UnoCSS generators, PRESET-001..004's shipped presets, and BUILDER-004/005's import/export/share-link mechanisms all consume this shape.

**Contract version:** 1
**Status:** schema, validator, migration mechanism, and one reference definition shipped (THEME-001). THEME-002/003/004 (per-profile generation) and THEME-005 (cross-output parity/contrast/round-trip audit) are not yet started.
**Task:** `docs/plans/website-tasks.md` §7.2 THEME-001
**Depends on:** BRAND-002 (`apps/site/src/assets/tokens.css`), RECIPE-001 (`docs/contracts/recipe-contract.md` §4 token model)

---

## 1. Artifacts

| Artifact                              | Purpose                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `tools/theme-contract-schema.ts`      | `ThemeDefinition` type, `THEME_SCHEMA_VERSION`, traversal/resolution helpers          |
| `tools/theme-contract-contrast.ts`    | Dependency-free WCAG relative luminance and contrast ratio, for the validator's floor |
| `tools/theme-contract-validate.ts`    | `validateThemeDefinition()` — the rule checker                                        |
| `tools/theme-contract-migrate.ts`     | `migrateThemeDocument()` — the versioned migration chain                              |
| `tools/theme-contract-definitions.ts` | Reference theme(s), starting with `solidiom-default`                                  |
| `tools/theme-contract.ts`             | CLI: `pnpm run theme:contract`                                                        |

Every `.ts` artifact above has a co-located `*.test.ts` (`tools/theme-contract-*.test.ts`).

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
`primary`" without repeating the literal, and matches how `apps/site/src/assets/tokens.css` aliases `--focus-ring` to the primary colour.

A reference may not cross modes: `light.primary-hover` can reference `light.primary`
but never `dark.primary`. Crossing modes would make one mode's correctness depend on
the other's, which contradicts §2.3.

### 2.3 Light and dark are both mandatory and independent

`modes.light` and `modes.dark` are both required, non-empty maps — there is no "base
plus dark overrides" delta form. This mirrors BRAND-002's documented architecture: dark
mode is an independently designed surface hierarchy, not an inversion of light. The
validator's §4 rule rejects a theme whose dark mode has not actually authored a
different value for any shared colour token.

## 3. Validation rules

`pnpm run theme:contract`, or call `validateThemeDefinition(definition)` directly.

| Rule             | Rejects                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| envelope         | Wrong `schemaVersion`; missing/blank `meta.name`, `meta.slug`, `meta.description`; non-kebab-case slug; invalid `meta.kind`; a missing or empty `modes.light`/`modes.dark` |
| §1 known tokens  | A token identity that is not in `recipe-contract-tokens.ts`'s canonical set                                                                                                |
| §2 baseline set  | Either mode missing one of `REQUIRED_BASELINE_TOKENS` (see §4 below)                                                                                                       |
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

§5 checks three mandatory pairs against a 3:1 WCAG floor using a dependency-free
luminance/contrast calculator (`tools/theme-contract-contrast.ts`) that understands hex
and `rgb()`/`rgba()` literals. It does not parse `hsl()` — if a value's colour form
cannot be parsed, the rule is skipped for that value rather than treated as a failure or
a pass. **THEME-005 owns the exhaustive audit**: every intent colour against every
surface, the stricter 4.5:1 body-text minimum, and parity across every generated
profile's actual rendered output. THEME-001's floor exists so an author cannot ship an
authoring-time-obviously-broken pairing (e.g. accidentally leaving both modes' text and
background the same colour) before THEME-005 exists.

## 4. Migration

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

## 5. Authoring a theme

1. Pick every identity your theme intends to restyle from `recipe-contract-tokens.ts`'s
   canonical set; do not invent a new identity here.
2. Author `modes.light` and `modes.dark` as complete, independent value maps — write
   dark mode's own colours, don't invert light's.
3. Cover at least `REQUIRED_BASELINE_TOKENS` in both modes.
4. Use `{ ref }` for a token that intentionally repeats another token's value in the
   same mode (for example, `focus-ring` mirroring `primary`).
5. Run `pnpm run theme:contract`.

## 6. Versioning

`THEME_SCHEMA_VERSION` is `1`. A change that would invalidate an already-persisted
theme document increments it, and a migration step (§4) must ship in the same change
so existing share links, exported JSON files, and installed presets keep resolving.

## 7. Not yet done

| Gap                                                                            | Owner            |
| ------------------------------------------------------------------------------ | ---------------- |
| CSS variable generation from a `ThemeDefinition`                               | THEME-002        |
| Tailwind theme mapping generation from a `ThemeDefinition`                     | THEME-003        |
| UnoCSS preset/configuration generation from a `ThemeDefinition`                | THEME-004        |
| Cross-output parity, the full 4.5:1/3:1 contrast matrix, round-trip validation | THEME-005        |
| Additional shipped presets (Ocean, Forest, Slate, Aurora)                      | PRESET-001..004  |
| Theme-builder UI consuming this schema                                         | BUILDER-001..006 |

/**
 * tools/theme-contract-definitions — reference theme definitions (THEME-001f).
 *
 * `solidiom-default` restates the exact colour/radius/shadow values already shipped in
 * `apps/site/src/assets/tokens.css` (BRAND-002) as a canonical `ThemeDefinition`, so:
 *
 *   - `pnpm run theme:contract` has a real, non-trivial definition to validate;
 *   - THEME-002/003/004's generators have a first input to generate CSS/Tailwind/UnoCSS
 *     output from and diff against the hand-written `tokens.css` for drift;
 *   - PRESET-001..004 have a working example to model additional presets on.
 *
 * This does not replace `tokens.css`. BRAND-002's hand-written stylesheet remains the
 * shipped site theme until THEME-002 generates it from this document; until then, this
 * file's values are kept in sync with `tokens.css` by inspection (see
 * `tools/theme-contract-definitions.test.ts`, which reads `tokens.css` and asserts the
 * two do not drift).
 *
 * `focus-ring-width` and `foreground-subtle`/`foreground-inverse`/`border-muted`/
 * `border-active`/`surface-sunken` are declared even though they sit outside
 * `REQUIRED_BASELINE_TOKENS`, because `tokens.css` already authors all of them and a
 * reference theme should demonstrate a fuller token set than the bare minimum.
 */
import { THEME_SCHEMA_VERSION, type ThemeDefinition } from "./theme-contract-schema"

export const SOLIDIOM_DEFAULT_THEME: ThemeDefinition = {
  schemaVersion: THEME_SCHEMA_VERSION,
  meta: {
    name: "Solidiom Default",
    slug: "solidiom-default",
    description:
      "The canonical Solidiom theme: a cool slate canvas in light mode and a deep slate base in dark mode, both built around the indigo primary.",
    kind: "preset",
    author: "Solidiom",
  },
  modes: {
    light: {
      surface: "#F8FAFC",
      "surface-raised": "#FFFFFF",
      "surface-overlay": "#FFFFFF",
      "surface-sunken": "#F1F5F9",
      foreground: "#111827",
      "foreground-muted": "#334155",
      "foreground-subtle": "#64748B",
      "foreground-inverse": "#F8FAFC",
      border: "#CBD5E1",
      "border-muted": "#E2E8F0",
      "border-active": "#5750D6",
      primary: "#5750D6",
      "primary-hover": "#4C46C5",
      "primary-foreground": "#FFFFFF",
      secondary: "#2563EB",
      success: "#22C55E",
      warning: "#F59E0B",
      destructive: "#E5484D",
      "focus-ring": { ref: "primary" },
      "focus-ring-width": "2px",
      "radius-sm": "8px",
      radius: "12px",
      "radius-lg": "16px",
      "radius-full": "999px",
      "shadow-sm": "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
      "shadow-md": "0 2px 6px -1px rgba(15, 23, 42, 0.06), 0 1px 4px -2px rgba(15, 23, 42, 0.04)",
      "shadow-lg": "0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -4px rgba(15, 23, 42, 0.04)",
    },
    dark: {
      surface: "#0F172A",
      "surface-raised": "#1E293B",
      "surface-overlay": "#1E293B",
      "surface-sunken": "#020617",
      foreground: "#F1F5F9",
      "foreground-muted": "#94A3B8",
      "foreground-subtle": "#64748B",
      "foreground-inverse": "#0F172A",
      border: "#334155",
      "border-muted": "#1E293B",
      "border-active": "#8B83F8",
      primary: "#8B83F8",
      "primary-hover": "#A19BFA",
      "primary-foreground": "#0F172A",
      secondary: "#60A5FA",
      success: "#4ADE80",
      warning: "#FBBF24",
      destructive: "#F87171",
      "focus-ring": { ref: "primary" },
      "focus-ring-width": "2px",
      "radius-sm": "8px",
      radius: "12px",
      "radius-lg": "16px",
      "radius-full": "999px",
      "shadow-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
      "shadow-md": "0 3px 8px -1px rgba(0, 0, 0, 0.3), 0 1px 4px -2px rgba(0, 0, 0, 0.2)",
      "shadow-lg": "0 10px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -4px rgba(0, 0, 0, 0.25)",
    },
  },
}

export const REFERENCE_THEMES: Readonly<Record<string, ThemeDefinition>> = {
  "solidiom-default": SOLIDIOM_DEFAULT_THEME,
}

/**
 * Translation status and freshness utilities (I18N-004).
 *
 * Provides:
 *   - Translation status types for tracking localization progress.
 *   - Content hashing for detecting when source content has changed.
 *   - Terminology glossary for consistent translations across the site.
 */
import { createHash } from "node:crypto"

// ---------------------------------------------------------------------------
// Translation status
// ---------------------------------------------------------------------------

export type TranslationStatus = "draft" | "human-reviewed" | "stale" | "missing"

// ---------------------------------------------------------------------------
// Content hashing
// ---------------------------------------------------------------------------

/**
 * Computes a SHA-256 hash of the given content string.
 * Used to detect when the English source has changed relative to
 * a translation's baseline.
 */
export function computeSourceHash(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

/**
 * Returns true if the translation's recorded source hash matches the
 * current source hash, meaning the translation is still fresh.
 */
export function isTranslationFresh(sourceHash: string, translatedHash: string): boolean {
  return sourceHash === translatedHash
}

// ---------------------------------------------------------------------------
// Terminology glossary
// ---------------------------------------------------------------------------

/**
 * Core terminology that must be translated consistently (or left
 * untranslated where marked). Keys are canonical English identifiers;
 * values provide official translations and translation policy.
 */
export const TERMINOLOGY_GLOSSARY: Record<
  string,
  { en: string; es: string; doNotTranslate?: boolean }
> = {
  primitive: { en: "primitive", es: "primitivo" },
  adapter: { en: "adapter", es: "adaptador" },
  registry: { en: "registry", es: "registro" },
  "source-ownership": { en: "source ownership", es: "propiedad del codigo fuente" },
  component: { en: "component", es: "componente" },
  signal: { en: "signal", es: "signal", doNotTranslate: true },
  store: { en: "store", es: "store", doNotTranslate: true },
  effect: { en: "effect", es: "effect", doNotTranslate: true },
  hook: { en: "hook", es: "hook", doNotTranslate: true },
  props: { en: "props", es: "props", doNotTranslate: true },
  slot: { en: "slot", es: "slot", doNotTranslate: true },
  island: { en: "island", es: "island", doNotTranslate: true },
  solidiom: { en: "Solidiom", es: "Solidiom", doNotTranslate: true },
  "solid-js": { en: "Solid", es: "Solid", doNotTranslate: true },
  astro: { en: "Astro", es: "Astro", doNotTranslate: true },
  cli: { en: "CLI", es: "CLI", doNotTranslate: true },
  npm: { en: "npm", es: "npm", doNotTranslate: true },
  pnpm: { en: "pnpm", es: "pnpm", doNotTranslate: true },
  typescript: { en: "TypeScript", es: "TypeScript", doNotTranslate: true },
}

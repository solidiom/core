/**
 * Deliverable → destination-directory mapping (CLI-004).
 *
 * install.ts previously hardcoded every source install's destination to
 * `join(sourceDir, primitive)` regardless of what kind of deliverable was
 * actually being installed. This module is the single place that maps a
 * deliverable kind to the configured destination *root* directory a given
 * install should be written under — install.ts then joins the primitive/slug
 * name onto whatever root this returns.
 */

import type { Deliverable } from "../registry-schema"
import type { Config } from "../schemas"

/** Thrown when a deliverable kind has no supported install-destination mapping. */
export class UnsupportedDeliverableError extends Error {
  constructor(readonly deliverable: Deliverable) {
    super(
      `Deliverable "${deliverable}" is not installable via \`add\`/source-install — ` +
        `"template" deliverables are materialized via \`solidiom create\` (CLI-007), not this flow.`,
    )
    this.name = "UnsupportedDeliverableError"
  }
}

/**
 * Resolves the configured destination root directory for a deliverable kind.
 *
 * - "primitive" → config.sourceDir
 * - "component" → config.componentDir
 * - "block"     → config.blockDir
 * - "theme"     → config.themeDir
 * - "template"  → throws UnsupportedDeliverableError (not a supported install flow)
 */
export function resolveDestinationRoot(deliverable: Deliverable, config: Config): string {
  switch (deliverable) {
    case "primitive":
      return config.sourceDir
    case "component":
      return config.componentDir
    case "block":
      return config.blockDir
    case "theme":
      return config.themeDir
    case "template":
    case "source":
    case "css":
    case "tailwind":
    case "unocss":
      throw new UnsupportedDeliverableError(deliverable)
    default: {
      // Exhaustiveness guard — Deliverable is a closed union.
      const _never: never = deliverable
      throw new Error(`Unhandled deliverable kind: ${String(_never)}`)
    }
  }
}

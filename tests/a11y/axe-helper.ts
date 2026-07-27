/**
 * Shared axe-core helper for accessibility scanning of Solidiom primitives.
 *
 * Renders a primitive in a minimal DOM container and runs axe-core analysis.
 * Used by the parametrized a11y test suite to scan every public primitive.
 */

import { render } from "@solidjs/web"
import type { JSX } from "@solidjs/web"

export interface AxeResult {
  violations: AxeViolation[]
  incomplete: AxeIncomplete[]
  passes: number
}

export interface AxeViolation {
  id: string
  impact: string
  description: string
  helpUrl: string
  nodes: number
}

export interface AxeIncomplete {
  id: string
  description: string
  nodes: number
}

/**
 * Run axe-core on a rendered component.
 * Returns violations, incomplete checks, and pass count.
 */
export async function runAxeScan(component: () => JSX.Element): Promise<AxeResult> {
  // Create an isolated container
  const container = document.createElement("div")
  container.id = "axe-test-root"
  document.body.appendChild(container)

  try {
    // Render the component
    const dispose = render(component, container)

    // Wait for rendering to settle
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Run axe-core analysis
    const axe = await import("axe-core")
    const results = await axe.default.run(container, {
      rules: {
        // Disable rules that require full page context
        "page-has-heading-one": { enabled: false },
        region: { enabled: false },
        "landmark-one-main": { enabled: false },
        bypass: { enabled: false },
      },
    })

    // Cleanup
    dispose()

    return {
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact ?? "unknown",
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
      })),
      incomplete: results.incomplete.map((i) => ({
        id: i.id,
        description: i.description,
        nodes: i.nodes.length,
      })),
      passes: results.passes.length,
    }
  } finally {
    document.body.removeChild(container)
  }
}

/**
 * Format axe results for display in test output.
 */
export function formatViolations(violations: AxeViolation[]): string {
  if (violations.length === 0) return "No violations"
  return violations
    .map((v) => `  [${v.impact}] ${v.id}: ${v.description} (${v.nodes} nodes)\n    ${v.helpUrl}`)
    .join("\n")
}

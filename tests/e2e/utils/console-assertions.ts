import type { Page } from "@playwright/test"

/**
 * Console error/warning collector for Playwright E2E tests.
 *
 * Attaches to a Page and collects console errors, warnings, and uncaught
 * exceptions. Provides assertion helpers for Solid 2 reactivity diagnostics.
 *
 * Usage:
 *   const console = createConsoleCollector(page)
 *   await page.goto("/some-route")
 *   console.assertNoErrors()
 *   console.assertNoReactivityErrors()
 */

export interface ConsoleCollector {
  /** All collected console error messages. */
  errors: string[]
  /** All collected console warning messages. */
  warnings: string[]
  /** All uncaught page errors (exceptions). */
  exceptions: string[]

  /** Assert no console errors were produced. Throws with details if any exist. */
  assertNoErrors(): void
  /** Assert no console warnings were produced. */
  assertNoWarnings(): void
  /** Assert no Solid 2 reactivity errors (REACTIVE_WRITE_IN_OWNED_SCOPE, REACTIVITY_HALTED). */
  assertNoReactivityErrors(): void
  /** Assert no STRICT_READ_UNTRACKED warnings. */
  assertNoUntrackedWarnings(): void
  /** Assert all: no errors, no reactivity warnings. */
  assertClean(): void
  /** Reset collected messages (useful between navigations in a single test). */
  reset(): void
}

/**
 * Creates a console collector attached to the given Playwright page.
 * Must be called BEFORE navigation to capture all messages.
 */
export function createConsoleCollector(page: Page): ConsoleCollector {
  const errors: string[] = []
  const warnings: string[] = []
  const exceptions: string[] = []

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text())
    } else if (msg.type() === "warning") {
      warnings.push(msg.text())
    }
  })

  page.on("pageerror", (err) => {
    exceptions.push(err.message)
  })

  return {
    errors,
    warnings,
    exceptions,

    assertNoErrors() {
      const all = [...errors, ...exceptions]
      if (all.length > 0) {
        throw new Error(
          `Expected no console errors, but found ${all.length}:\n` +
            all.map((e, i) => `  [${i + 1}] ${e}`).join("\n"),
        )
      }
    },

    assertNoWarnings() {
      if (warnings.length > 0) {
        throw new Error(
          `Expected no console warnings, but found ${warnings.length}:\n` +
            warnings.map((w, i) => `  [${i + 1}] ${w}`).join("\n"),
        )
      }
    },

    assertNoReactivityErrors() {
      const reactivityErrors = [...errors, ...exceptions].filter(
        (e) => e.includes("REACTIVE_WRITE_IN_OWNED_SCOPE") || e.includes("REACTIVITY_HALTED"),
      )
      if (reactivityErrors.length > 0) {
        throw new Error(
          `Solid 2 reactivity errors detected:\n` +
            reactivityErrors.map((e, i) => `  [${i + 1}] ${e}`).join("\n"),
        )
      }
    },

    assertNoUntrackedWarnings() {
      const untracked = warnings.filter((w) => w.includes("STRICT_READ_UNTRACKED"))
      if (untracked.length > 0) {
        throw new Error(
          `STRICT_READ_UNTRACKED warnings detected:\n` +
            untracked.map((w, i) => `  [${i + 1}] ${w}`).join("\n"),
        )
      }
    },

    assertClean() {
      this.assertNoErrors()
      this.assertNoReactivityErrors()
      this.assertNoUntrackedWarnings()
    },

    reset() {
      errors.length = 0
      warnings.length = 0
      exceptions.length = 0
    },
  }
}

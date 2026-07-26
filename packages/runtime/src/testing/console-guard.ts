/**
 * Console guard for Vitest browser-mode component tests.
 *
 * Intercepts console.error and console.warn during test execution and
 * provides assertions for Solid 2 reactivity diagnostics.
 *
 * Usage:
 *   import { createConsoleGuard } from "@solidiom/runtime/testing/console-guard"
 *
 *   const guard = createConsoleGuard()
 *   // ... render components ...
 *   guard.assertNoErrors()
 *   guard.restore()
 */

export interface ConsoleGuard {
  /** Collected console.error messages. */
  errors: string[]
  /** Collected console.warn messages. */
  warnings: string[]

  /** Assert no console errors. Throws with details if any exist. */
  assertNoErrors(): void
  /** Assert no console warnings. */
  assertNoWarnings(): void
  /** Assert no Solid 2 REACTIVE_WRITE_IN_OWNED_SCOPE or REACTIVITY_HALTED errors. */
  assertNoReactivityErrors(): void
  /** Assert no STRICT_READ_UNTRACKED warnings. */
  assertNoUntrackedWarnings(): void
  /** Assert all: no errors, no reactivity warnings. */
  assertClean(): void
  /** Reset collected messages. */
  reset(): void
  /** Restore original console.error and console.warn. */
  restore(): void
}

/**
 * Creates a console guard that intercepts error/warn calls.
 * Call restore() in afterEach to avoid leaking interceptors.
 */
export function createConsoleGuard(): ConsoleGuard {
  const errors: string[] = []
  const warnings: string[] = []

  const originalError = console.error
  const originalWarn = console.warn

  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "))
  }
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "))
  }

  return {
    errors,
    warnings,

    assertNoErrors() {
      if (errors.length > 0) {
        throw new Error(
          `Expected no console errors, but found ${errors.length}:\n` +
            errors.map((e, i) => `  [${i + 1}] ${e}`).join("\n"),
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
      const reactivityErrors = errors.filter(
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
    },

    restore() {
      console.error = originalError
      console.warn = originalWarn
    },
  }
}

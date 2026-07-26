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
    errors: string[];
    /** Collected console.warn messages. */
    warnings: string[];
    /** Assert no console errors. Throws with details if any exist. */
    assertNoErrors(): void;
    /** Assert no console warnings. */
    assertNoWarnings(): void;
    /** Assert no Solid 2 REACTIVE_WRITE_IN_OWNED_SCOPE or REACTIVITY_HALTED errors. */
    assertNoReactivityErrors(): void;
    /** Assert no STRICT_READ_UNTRACKED warnings. */
    assertNoUntrackedWarnings(): void;
    /** Assert all: no errors, no reactivity warnings. */
    assertClean(): void;
    /** Reset collected messages. */
    reset(): void;
    /** Restore original console.error and console.warn. */
    restore(): void;
}
/**
 * Creates a console guard that intercepts error/warn calls.
 * Call restore() in afterEach to avoid leaking interceptors.
 */
export declare function createConsoleGuard(): ConsoleGuard;
//# sourceMappingURL=console-guard.d.ts.map
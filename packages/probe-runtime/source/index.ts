/**
 * Probe runtime — validates that pure-TS packages build correctly
 * with tsup and can import from @solidiom/runtime.
 */

/** A placeholder utility to prove pure-TS builds work. */
export function probe(value: string): string {
  return `[solidiom:probe] ${value}`
}

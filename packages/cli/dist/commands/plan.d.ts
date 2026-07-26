/**
 * solidiom plan — resolves the capability graph for a primitive and emits JSON.
 *
 * Reads the registry catalog (or node_modules package.json files) to resolve
 * real version numbers. Validates against policy constraints.
 */
import { Command } from "clipanion";
/** A resolved plan entry. */
export interface PlanEntry {
    package: string;
    version: string;
    isAdapter: boolean;
    reason: string;
}
/** The full plan output. */
export interface Plan {
    primitive: string;
    mode: "package" | "source";
    entries: PlanEntry[];
    violations: string[];
}
export interface PlanOptions {
    primitive: string;
    cwd: string;
    mode?: "package" | "source";
}
/**
 * Core plan logic — usable from CLI and programmatic API.
 */
export declare function runPlan(options: PlanOptions): Plan;
/**
 * Clipanion command wrapper.
 */
export declare class PlanCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    primitive: string;
    json: boolean;
    mode: string | undefined;
    execute(): Promise<number>;
}
//# sourceMappingURL=plan.d.ts.map
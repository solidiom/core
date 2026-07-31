/**
 * solidiom plan — resolves the capability graph for a primitive and emits JSON.
 *
 * Reads the registry catalog (or node_modules package.json files) to resolve
 * real version numbers. Validates against policy constraints.
 */
import { Command } from "clipanion";
import { type Deliverable, type StylingProfile } from "../registry-schema";
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
    /** Product-layer deliverable this plan resolves, if requested via --deliverable. */
    deliverable?: Deliverable;
    /** Styling profile this plan resolves, if requested via --styling. */
    stylingProfile?: StylingProfile;
    /** Styling outputs the resolved primitive actually has recipes for. */
    stylingOutputs: StylingProfile[];
    violations: string[];
}
export interface PlanOptions {
    primitive: string;
    cwd: string;
    mode?: "package" | "source";
    registry?: string;
    noNetwork?: boolean;
    /** Request a specific product-layer deliverable (primitive, component, block, template, theme). */
    deliverable?: Deliverable;
    /** Request a specific styling profile (css, tailwind, unocss). */
    styling?: StylingProfile;
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
    registry: string | undefined;
    noNetwork: boolean;
    deliverable: string | undefined;
    styling: string | undefined;
    execute(): Promise<number>;
}
//# sourceMappingURL=plan.d.ts.map
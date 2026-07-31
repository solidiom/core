/**
 * solidiom add — adds a primitive in package or source mode.
 *
 * Package mode: resolves plan and outputs the npm install command.
 * Source mode: materializes source files, deduplicates runtime, rewrites imports.
 */
import { Command } from "clipanion";
import { type Plan, type PlanOptions } from "./plan";
import { type SourceInstallResult } from "../source-install/install";
import { type PackageManagerName } from "../package-manager/detect";
import { type RunPackageManagerResult } from "../package-manager/exec";
export interface AddOptions extends PlanOptions {
    dryRun?: boolean;
    registry?: string;
    noNetwork?: boolean;
    /** Explicit package-manager override; otherwise detected from the project (CLI-005). */
    packageManager?: PackageManagerName;
    /** When true, actually run the install command instead of only printing it (CLI-005). */
    install?: boolean;
    /** When true, a source install proceeds even if byte-level verification fails (CLI-003). */
    allowUnverified?: boolean;
    /** When true, a source install overwrites files modified by the user since their last install (CLI-004). */
    force?: boolean;
    /** When true, a source install prints a unified diff of pending changes and exits without writing (CLI-004). */
    diff?: boolean;
}
export interface AddResult {
    plan: Plan;
    installCommand: string | null;
    blocked: boolean;
    sourceResult?: SourceInstallResult;
    /** Present when --install actually ran the package-manager command. */
    installRun?: RunPackageManagerResult;
}
/**
 * Core add logic.
 */
export declare function runAdd(options: AddOptions): Promise<AddResult>;
/**
 * Clipanion command wrapper.
 */
export declare class AddCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    primitive: string;
    mode: string | undefined;
    registry: string | undefined;
    noNetwork: boolean;
    deliverable: string | undefined;
    styling: string | undefined;
    packageManager: string | undefined;
    install: boolean;
    allowUnverified: boolean;
    force: boolean;
    diff: boolean;
    dryRun: boolean;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=add.d.ts.map
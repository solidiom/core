/**
 * solidiom add — adds a primitive in package or source mode.
 *
 * Package mode: resolves plan and outputs the npm install command.
 * Source mode: materializes source files, deduplicates runtime, rewrites imports.
 */
import { Command } from "clipanion";
import { type Plan, type PlanOptions } from "./plan";
import { type SourceInstallResult } from "../source/install";
export interface AddOptions extends PlanOptions {
    dryRun?: boolean;
}
export interface AddResult {
    plan: Plan;
    installCommand: string | null;
    blocked: boolean;
    sourceResult?: SourceInstallResult;
}
/**
 * Core add logic.
 */
export declare function runAdd(options: AddOptions): AddResult;
/**
 * Clipanion command wrapper.
 */
export declare class AddCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    primitive: string;
    mode: string | undefined;
    dryRun: boolean;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=add.d.ts.map
/**
 * solidiom inspect — inspect installed primitives.
 *
 * Subcommands: source, manifest, explain, files, provenance.
 */
import { Command } from "clipanion";
import { type LockEntry } from "../source-install/install";
export interface InspectResult {
    primitive?: string;
    mode: string;
    entries: LockEntry[];
    manifest?: Record<string, unknown>;
}
/**
 * Core inspect logic.
 */
export declare function runInspect(options: {
    cwd: string;
    subcommand: string;
    primitive?: string;
}): InspectResult;
export declare class InspectCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    subcommand: string;
    primitive: string | undefined;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=inspect.d.ts.map
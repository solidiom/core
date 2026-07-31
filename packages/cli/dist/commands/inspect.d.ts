/**
 * solidiom inspect — inspect installed primitives.
 *
 * Subcommands: source, manifest, explain, files, provenance.
 */
import { Command } from "clipanion";
import { type LockEntry } from "../source-install/install";
import { type RegistryManifest } from "../registry-schema";
export interface InspectResult {
    primitive?: string;
    mode: string;
    entries: LockEntry[];
    manifest?: RegistryManifest;
    /** Set when `manifest` subcommand finds a file that fails schema validation (fail closed). */
    manifestError?: string;
}
/**
 * Core inspect logic.
 */
export declare function runInspect(options: {
    cwd: string;
    subcommand: string;
    primitive?: string;
    registry?: string;
}): InspectResult;
export declare class InspectCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    subcommand: string;
    primitive: string | undefined;
    registry: string | undefined;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=inspect.d.ts.map
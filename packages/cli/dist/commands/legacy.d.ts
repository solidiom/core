/**
 * solidiom legacy — manage legacy facade packages.
 *
 * Subcommands:
 *   solidiom legacy status  — Show status of all known legacy facades
 *   solidiom legacy add     — Install a legacy facade for gradual migration
 *   solidiom legacy remove  — Remove a legacy facade (must have zero imports)
 *
 * Legacy facades are compatibility shims that wrap Solidiom primitives with
 * the old shadcn-solid API surface, allowing incremental migration.
 */
import { Command } from "clipanion";
export interface LegacyFacade {
    /** npm package name */
    name: string;
    /** The Solidiom primitive that replaces this facade */
    replacement: string;
    /** Version at which the facade was deprecated */
    deprecated: string;
    /** Version at which the facade will be removed */
    removed: string;
    /** Whether the facade is currently installed in node_modules */
    installed: boolean;
    /** Import count in the consumer project (0 = safe to remove) */
    importCount: number;
}
export interface LegacyStatusResult {
    facades: LegacyFacade[];
    totalImports: number;
    readyToRemove: string[];
}
/**
 * Get the status of all known legacy facades.
 */
export declare function runLegacyStatus(cwd: string): LegacyStatusResult;
/**
 * Add (install) a legacy facade package.
 */
export declare function runLegacyAdd(facadeName: string, cwd: string): {
    ok: boolean;
    message: string;
};
/**
 * Remove a legacy facade package. Refuses if imports still exist.
 */
export declare function runLegacyRemove(facadeName: string, cwd: string): {
    ok: boolean;
    message: string;
};
/**
 * solidiom legacy — default (no subcommand) shows status.
 */
export declare class LegacyCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    json: boolean;
    execute(): Promise<number>;
}
/**
 * solidiom legacy status — show detailed status of all facades.
 */
export declare class LegacyStatusCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    json: boolean;
    execute(): Promise<number>;
}
/**
 * solidiom legacy add <facade> — install a facade for gradual migration.
 */
export declare class LegacyAddCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    facade: string;
    execute(): Promise<number>;
}
/**
 * solidiom legacy remove <facade> — remove a facade after migration is complete.
 */
export declare class LegacyRemoveCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    facade: string;
    execute(): Promise<number>;
}
//# sourceMappingURL=legacy.d.ts.map
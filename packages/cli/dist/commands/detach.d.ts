/**
 * solidiom detach — marks source-installed files as detached from upstream updates.
 *
 * Non-destructive: only updates .solidiom/lock.json metadata.
 * Detached files are skipped by `solidiom update`.
 */
import { Command } from "clipanion";
export interface DetachResult {
    detached: string[];
    alreadyDetached: string[];
}
/**
 * Core detach logic — marks files as detached in the lockfile.
 */
export declare function runDetach(options: {
    cwd: string;
    primitive: string;
}): DetachResult;
export declare class DetachCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    primitive: string;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=detach.d.ts.map
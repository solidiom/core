/**
 * solidiom diff — show digest-based diff between installed source and upstream.
 */
import { Command } from "clipanion";
export interface DiffEntry {
    path: string;
    primitive: string;
    status: "unchanged" | "modified" | "deleted" | "new";
}
export interface DiffResult {
    entries: DiffEntry[];
    hasChanges: boolean;
}
/**
 * Core diff logic — compares installed files against lockfile digests.
 */
export declare function runDiff(options: {
    cwd: string;
    primitive?: string;
}): DiffResult;
export declare class DiffCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    primitive: string | undefined;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=diff.d.ts.map
/**
 * solidiom update — updates source-installed primitives to the latest upstream version.
 *
 * Three-way merge algorithm:
 * 1. Read base digest from .solidiom/lock.json (what was originally installed)
 * 2. Read local content (what the user has now — may be modified)
 * 3. Read upstream content (the new version from the registry/monorepo)
 *
 * Decision matrix:
 * - Local unchanged, upstream changed → overwrite with upstream (safe update)
 * - Local changed, upstream unchanged → keep local (user's version is newer)
 * - Local changed, upstream changed → attempt line-level merge, else write conflict file
 * - Neither changed → skip
 *
 * For .tsx files with structural changes, uses ts-morph AST rewriting
 * to preserve import structure during the update.
 */
import { Command } from "clipanion";
export interface UpdateEntry {
    path: string;
    status: "updated" | "conflict" | "merged" | "skipped-detached" | "skipped-unchanged" | "skipped-deleted";
}
export interface UpdateResult {
    entries: UpdateEntry[];
    conflicts: string[];
    updated: number;
    merged: number;
}
export interface UpdateOptions {
    cwd: string;
    primitive: string;
    dryRun?: boolean;
}
/**
 * Core update logic — three-way merge for source installs.
 */
export declare function runUpdate(options: UpdateOptions): UpdateResult;
export declare class UpdateCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    primitive: string;
    dryRun: boolean;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=update.d.ts.map
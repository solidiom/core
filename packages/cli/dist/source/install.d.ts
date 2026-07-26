/**
 * Source install engine — materializes primitive source files into the consumer project.
 *
 * Responsibilities:
 * 1. Copy canonical source files to the configured sourceDir.
 * 2. Deduplicate shared _runtime modules across installed primitives.
 * 3. Rewrite @solidiom/runtime imports to relative paths.
 * 4. Write/update .solidiom/lock.json with installed file digests.
 */
import type { Plan } from "../commands/plan";
export interface SourceInstallOptions {
    primitive: string;
    cwd: string;
    plan: Plan;
    dryRun?: boolean;
}
export interface SourceInstallResult {
    filesWritten: string[];
    runtimeDeduped: string[];
    lockUpdated: boolean;
}
/** An entry in .solidiom/lock.json tracking source installs. */
export interface LockEntry {
    /** Relative path from project root. */
    path: string;
    /** SHA-256 digest of original source content. */
    digest: string;
    /** Source primitive this file belongs to. */
    primitive: string;
    /** Version at time of install. */
    version: string;
    /** Whether this file has been detached from updates. */
    detached?: boolean;
}
export interface LockFile {
    version: 1;
    installed: Record<string, LockEntry>;
}
/** Compute SHA-256 digest of content. */
export declare function computeDigest(content: string): string;
/** Read existing lockfile, or create fresh. */
export declare function readLock(cwd: string): LockFile;
/** Write lockfile. */
export declare function writeLock(cwd: string, lock: LockFile): void;
/**
 * Rewrite @solidiom/runtime imports to relative paths pointing to the _runtime directory.
 *
 * Uses regex for speed on simple .ts files; the full AST transform (ast-transform.ts)
 * is available for complex .tsx files with JSX and re-exports.
 */
export declare function rewriteImports(content: string, filePath: string, runtimeDir: string): string;
/**
 * Install a primitive in source mode.
 */
export declare function installSource(options: SourceInstallOptions): SourceInstallResult;
//# sourceMappingURL=install.d.ts.map
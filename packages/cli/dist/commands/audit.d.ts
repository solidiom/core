/**
 * solidiom audit — CycloneDX 1.5 SBOM and license inventory.
 *
 * Scans:
 *   1. Direct @solidiom/* workspace packages (monorepo packages/ dir).
 *   2. All npm dependencies in the workspace node_modules (transitive deps of adapters included).
 *
 * CycloneDX 1.5 fields emitted:
 *   bomFormat, specVersion, serialNumber, version, metadata (timestamp + tool),
 *   components[{ bom-ref, type, name, version, purl, licenses }]
 *
 * CLI flags:
 *   --sbom    Emit full CycloneDX 1.5 JSON (the canonical SBOM flag per §13 spec).
 *   --json    Alias for --sbom (backward compat).
 *   --licenses  Emit a plain license inventory table only.
 */
import { Command } from "clipanion";
interface CdxLicense {
    license: {
        id?: string;
        name?: string;
    };
}
interface CdxComponent {
    "bom-ref": string;
    type: "library";
    name: string;
    version: string;
    /** Package URL per https://github.com/package-url/purl-spec */
    purl: string;
    licenses: CdxLicense[];
    /** "direct" | "transitive" — informational, not part of CycloneDX spec */
    scope?: "required" | "optional" | "excluded";
}
export interface AuditResult {
    bomFormat: "CycloneDX";
    specVersion: "1.5";
    serialNumber: string;
    version: number;
    metadata: {
        timestamp: string;
        tools: [{
            vendor: string;
            name: string;
            version: string;
        }];
    };
    components: CdxComponent[];
}
/** Simplified view for the --licenses table. */
export interface AuditComponent {
    name: string;
    version: string;
    license: string;
    type: "library";
}
/**
 * Core audit logic.
 * Scans monorepo @solidiom/* packages first (direct), then full node_modules (transitive).
 */
export declare function runAudit(cwd: string): AuditResult;
export declare class AuditCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    sbom: boolean;
    json: boolean;
    licenses: boolean;
    execute(): Promise<number>;
    private printLicenses;
}
export {};
//# sourceMappingURL=audit.d.ts.map
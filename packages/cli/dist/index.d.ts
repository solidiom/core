/**
 * @solidiom/cli — Solidiom distribution CLI.
 */
export { runInit, type InitOptions, type InitResult } from "./commands/init";
export { runPlan, type PlanOptions, type Plan, type PlanEntry } from "./commands/plan";
export { runAdd, type AddOptions, type AddResult } from "./commands/add";
export { runInspect, type InspectResult } from "./commands/inspect";
export { runDiff, type DiffResult, type DiffEntry } from "./commands/diff";
export { runDetach, type DetachResult } from "./commands/detach";
export { runUpdate, type UpdateResult, type UpdateEntry, type UpdateOptions, } from "./commands/update";
export { runDoctor, type DoctorResult, type DoctorCheck } from "./commands/doctor";
export { runVerify, type VerifyOptions, type VerifyResult } from "./commands/verify";
export { runAudit, type AuditResult, type AuditComponent } from "./commands/audit";
export { runLegacyStatus, type LegacyStatusResult, type LegacyFacade } from "./commands/legacy";
export { installSource, type SourceInstallOptions, type SourceInstallResult, } from "./source/install";
export { rewriteImportsAst, applyMigration, type RewriteImportsOptions, type RewriteImportsResult, type MigrationSpec, type MigrationResult, } from "./source/ast-transform";
export { ConfigSchema, PolicySchema, type Config, type Policy } from "./schemas";
//# sourceMappingURL=index.d.ts.map
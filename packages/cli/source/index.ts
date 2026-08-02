/**
 * @solidiom/cli — Solidiom distribution CLI.
 */

export { runInit, type InitOptions, type InitResult } from "./commands/init"
export { runPlan, type PlanOptions, type Plan, type PlanEntry } from "./commands/plan"
export { runAdd, type AddOptions, type AddResult } from "./commands/add"
export {
  runCreate,
  isValidPackageName,
  createCleanupJournal,
  type CreateOptions,
  type CreateResult,
  type CleanupJournal,
} from "./commands/create"
export {
  materialize,
  resolveTemplateSource,
  type MaterializeOptions,
  type MaterializeResult,
} from "./create/materialize"
export {
  generateProjectConfig,
  type GenerateProjectConfigOptions,
  type GenerateProjectConfigResult,
  type StylingProfile as CreateStylingProfile,
} from "./create/config-gen"
export { runInspect, type InspectResult } from "./commands/inspect"
export { runDiff, type DiffResult, type DiffEntry } from "./commands/diff"
export { runDetach, type DetachResult } from "./commands/detach"
export {
  runUpdate,
  type UpdateResult,
  type UpdateEntry,
  type UpdateOptions,
} from "./commands/update"
export { runDoctor, type DoctorResult, type DoctorCheck } from "./commands/doctor"
export {
  runVerify,
  verifyRegistry,
  type VerifyOptions,
  type VerifyResult,
  type RegistryVerifyResult,
} from "./commands/verify"
export { runAudit, type AuditResult, type AuditComponent } from "./commands/audit"
export {
  installSource,
  type SourceInstallOptions,
  type SourceInstallResult,
} from "./source-install/install"
export {
  readLock,
  writeLock,
  computeDigest,
  type LockEntry,
  type LockFile,
} from "./source-install/lock"
export {
  verifySourceIntegrity,
  type SourceVerifyResult,
  type VerifySourceIntegrityOptions,
} from "./source-install/verify-source"
export {
  rewriteImportsAst,
  type RewriteImportsOptions,
  type RewriteImportsResult,
} from "./source-install/ast-transform"
export { resolveDestinationRoot, UnsupportedDeliverableError } from "./source-install/destinations"
export {
  classifyConflicts,
  renderUnifiedDiff,
  type ConflictReport,
  type ConflictEntry,
  type ConflictClassification,
  type ClassifyConflictsOptions,
} from "./source-install/conflict"
export { createRollbackJournal, type RollbackJournal } from "./source-install/rollback"
export {
  planThemeInstall,
  ThemeNotCompatibleError,
  type ThemeInstallPlan,
  type ThemeInstallAction,
  type PlanThemeInstallOptions,
} from "./source-install/theme-install"
export { ConfigSchema, PolicySchema, type Config, type Policy } from "./schemas"
export {
  readRegistryIndex,
  readRegistryManifest,
  RegistrySchemaError,
  DELIVERABLES,
  STYLING_PROFILES,
  SUPPORTED_REGISTRY_INDEX_VERSION,
  SUPPORTED_MANIFEST_SCHEMA_URL,
  SUPPORTED_INDEX_SCHEMA_URL,
  type Deliverable,
  type StylingProfile,
  type RegistryIndex,
  type RegistryManifest,
  type RegistryPrimitiveSummary,
} from "./registry-schema"
export {
  detectPackageManager,
  isPackageManagerName,
  type DetectedPackageManager,
  type DetectPackageManagerOptions,
  type PackageManagerName,
  type DetectionSource,
} from "./package-manager/detect"
export {
  add as addPackageManagerCommand,
  addDev as addDevPackageManagerCommand,
  install as installPackageManagerCommand,
  exec as execPackageManagerCommand,
  run as runPackageManagerCommand,
  dlx as dlxPackageManagerCommand,
  formatCommand,
  type PackageManagerCommand,
} from "./package-manager/commands"
export {
  runPackageManager,
  type RunPackageManagerOptions,
  type RunPackageManagerResult,
} from "./package-manager/exec"

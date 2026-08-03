#!/usr/bin/env node
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/bin.ts
import { Cli } from "clipanion";

// src/commands/init.ts
import { Command, Option } from "clipanion";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// src/schemas.ts
import { z } from "zod";
var ConfigSchema = z.object({
  /** The positioning adapter to use. */
  positioningAdapter: z.string().optional().default("@solidiom/adapter-positioning-floating-ui"),
  /** Source install target directory. */
  sourceDir: z.string().optional().default("src/ui/primitives"),
  /** Runtime target directory for source installs. */
  runtimeDir: z.string().optional().default("src/ui/_runtime"),
  /** Source install target directory for "component" deliverables (CLI-004). */
  componentDir: z.string().optional().default("src/ui/components"),
  /** Source install target directory for "block" deliverables (CLI-004). */
  blockDir: z.string().optional().default("src/ui/blocks"),
  /** Source install target directory for "theme" deliverables (CLI-004). */
  themeDir: z.string().optional().default("src/ui/themes"),
  /** Package install mode: "package" or "source". */
  defaultMode: z.enum(["package", "source"]).optional().default("package"),
  /**
   * Styling profile chosen at `init` time. No default — a project has no
   * styling profile until one is explicitly chosen (CLI-004). Left optional
   * here; wiring an init-time prompt for this is out of scope for CLI-004.
   */
  stylingProfile: z.enum(["css", "tailwind", "unocss"]).optional()
});
var PolicySchema = z.object({
  /** Signature verification mode. */
  signatureMode: z.enum(["sigstore", "trusted-keys", "none"]).optional().default("none"),
  /** Allowed primitive version ranges. */
  allowedPrimitiveVersions: z.record(z.string()).optional().default({}),
  /** Trusted identities for sigstore verification. */
  trustedIdentities: z.array(z.string()).optional().default([]),
  /** When true, `solidiom verify --registry` fails closed if the registry index is unsigned. */
  registrySignatureRequired: z.boolean().optional().default(false),
  /** HMAC keys accepted when verifying the registry index signature. */
  registryTrustedKeys: z.array(z.string()).optional().default([]),
  /** When true (the default), source installs must pass byte-level verification against the registry manifest before any file is written (CLI-003). */
  requireVerifiedSource: z.boolean().optional().default(true),
  /** HMAC keys accepted when verifying source-install byte-level integrity (CLI-003). */
  sourceInstallTrustedKeys: z.array(z.string()).optional().default([])
});

// src/commands/init.ts
import pc from "picocolors";
function runInit(options) {
  const { cwd, force = false } = options;
  const solidiomDir = join(cwd, ".solidiom");
  const configPath = join(solidiomDir, "config.json");
  if (existsSync(configPath) && !force) {
    const existing = JSON.parse(readFileSync(configPath, "utf8"));
    return { configPath, created: false, config: ConfigSchema.parse(existing) };
  }
  const config = ConfigSchema.parse({});
  mkdirSync(solidiomDir, { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  return { configPath, created: true, config };
}
var InitCommand = class extends Command {
  static paths = [["init"]];
  static usage = Command.Usage({
    description: "Initialize .solidiom/config.json in the current project",
    examples: [
      ["Initialize with defaults", "solidiom init"],
      ["Force overwrite existing config", "solidiom init --force"]
    ]
  });
  force = Option.Boolean("--force", false, { description: "Overwrite existing config" });
  json = Option.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runInit({ cwd: process.cwd(), force: this.force });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (result.created) {
      this.context.stdout.write(pc.green(`Created ${result.configPath}
`));
    } else {
      this.context.stdout.write(`Config already exists at ${result.configPath}
`);
    }
    return 0;
  }
};

// src/commands/plan.ts
import { Command as Command2, Option as Option2 } from "clipanion";
import { readFileSync as readFileSync3, existsSync as existsSync2 } from "fs";
import { join as join2 } from "path";

// src/registry-schema.ts
import { readFileSync as readFileSync2 } from "fs";
import { z as z2 } from "zod";
var SUPPORTED_REGISTRY_INDEX_VERSION = 2;
var SUPPORTED_MANIFEST_SCHEMA_URL = "https://solidiom.dev/schemas/registry-manifest/v2.json";
var SUPPORTED_INDEX_SCHEMA_URL = "https://solidiom.dev/schemas/registry-index/v2.json";
var DELIVERABLES = ["primitive", "component", "block", "template", "theme"];
var deliverableSchema = z2.enum(DELIVERABLES);
var STYLING_PROFILES = ["css", "tailwind", "unocss"];
var stylingProfileSchema = z2.enum(STYLING_PROFILES);
var capabilitySchema = z2.object({
  name: z2.string().min(1),
  version: z2.number().int().positive(),
  default: z2.string().regex(/^@solidiom\//)
});
var documentationLocaleSchema = z2.object({
  status: z2.enum(["missing", "draft", "stale", "reviewed"]),
  sourceHash: z2.string().optional(),
  lastUpdated: z2.string().optional()
});
var manifestDocumentationSchema = z2.object({
  status: z2.enum(["stub", "draft", "review", "complete"]),
  locales: z2.record(documentationLocaleSchema)
});
var manifestStylingSchema = z2.object({
  outputs: z2.array(stylingProfileSchema),
  themeCompatible: z2.array(z2.string())
});
var manifestSearchSchema = z2.object({
  keywords: z2.array(z2.string())
});
var manifestProvenanceSchema = z2.object({
  repository: z2.string(),
  directory: z2.string(),
  sourceCommit: z2.string().optional()
});
var manifestCliSchema = z2.object({
  addCommand: z2.string().min(1),
  installDeps: z2.array(z2.string())
});
var manifestAccessibilitySchema = z2.object({
  reviewStatus: z2.enum(["none", "automated", "manual", "complete"]),
  evidenceIds: z2.array(z2.string()),
  lastReviewed: z2.string().optional()
});
var integritySchema = z2.object({
  algorithm: z2.literal("sha256"),
  entriesHash: z2.string().regex(/^[0-9a-f]{64}$/),
  signature: z2.string().regex(/^[0-9a-f]{64}$/).optional(),
  signedAt: z2.string().optional(),
  signatureKeyId: z2.string().regex(/^[0-9a-f]{16}$/).optional()
});
var registryPrimitiveSummarySchema = z2.object({
  name: z2.string().min(1),
  version: z2.string().min(1),
  package: z2.string().regex(/^@solidiom\//),
  label: z2.string().min(1),
  description: z2.string(),
  category: z2.string().min(1),
  status: z2.enum(["experimental", "preview", "stable", "deprecated"]),
  deliverables: z2.array(deliverableSchema),
  hasAccessibilityEvidence: z2.boolean(),
  accessibility: z2.object({
    reviewStatus: z2.enum(["none", "automated", "manual", "complete"]),
    evidenceIds: z2.array(z2.string())
  }),
  documentationStatus: z2.enum(["stub", "draft", "review", "complete"]),
  documentationLocales: z2.record(documentationLocaleSchema),
  stylingOutputs: z2.array(stylingProfileSchema),
  themeCompatible: z2.array(z2.string()),
  searchKeywords: z2.array(z2.string()),
  provenance: manifestProvenanceSchema
});
var registryAdapterSchema = z2.object({
  name: z2.string().min(1),
  package: z2.string().regex(/^@solidiom\//),
  capability: z2.string().regex(/.+@\d+/),
  version: z2.string().min(1)
});
var registryIndexSchema = z2.object({
  $schema: z2.literal(SUPPORTED_INDEX_SCHEMA_URL),
  version: z2.literal(SUPPORTED_REGISTRY_INDEX_VERSION),
  generatedAt: z2.string(),
  integrity: integritySchema,
  primitives: z2.array(registryPrimitiveSummarySchema),
  adapters: z2.array(registryAdapterSchema)
});
var manifestIntegritySchema = z2.object({
  algorithm: z2.literal("sha256"),
  filesHash: z2.string().regex(/^[0-9a-f]{64}$/),
  fileDigests: z2.record(z2.string().regex(/^[0-9a-f]{64}$/)),
  manifestSignature: z2.string().optional(),
  lastGenerated: z2.string()
});
var registryManifestSchema = z2.object({
  $schema: z2.literal(SUPPORTED_MANIFEST_SCHEMA_URL),
  name: z2.string().min(1),
  version: z2.string().min(1),
  package: z2.string().regex(/^@solidiom\//),
  label: z2.string().min(1),
  description: z2.string(),
  category: z2.string().min(1),
  status: z2.enum(["experimental", "preview", "stable", "deprecated"]),
  deliverables: z2.array(deliverableSchema),
  capabilities: z2.array(capabilitySchema),
  cli: manifestCliSchema,
  accessibility: manifestAccessibilitySchema,
  documentation: manifestDocumentationSchema,
  styling: manifestStylingSchema,
  search: manifestSearchSchema,
  source: z2.object({
    entry: z2.string().min(1),
    files: z2.array(z2.string())
  }),
  dependencies: z2.array(z2.string()),
  runtime: z2.array(z2.string()),
  integrity: manifestIntegritySchema,
  provenance: manifestProvenanceSchema,
  lastUpdated: z2.string()
});
var RegistrySchemaError = class extends Error {
  constructor(message, path) {
    super(message);
    this.path = path;
    this.name = "RegistrySchemaError";
  }
  path;
};
function readRegistryIndex(path) {
  let raw;
  try {
    raw = JSON.parse(readFileSync2(path, "utf8"));
  } catch (err) {
    throw new RegistrySchemaError(`Failed to read/parse registry index: ${String(err)}`, path);
  }
  if (isRecord(raw) && raw.version !== void 0 && raw.version !== SUPPORTED_REGISTRY_INDEX_VERSION) {
    throw new RegistrySchemaError(
      `Unsupported registry index schema version ${JSON.stringify(raw.version)}; this CLI build only supports version ${SUPPORTED_REGISTRY_INDEX_VERSION}`,
      path
    );
  }
  const result = registryIndexSchema.safeParse(raw);
  if (!result.success) {
    throw new RegistrySchemaError(
      `registry index failed schema validation: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      path
    );
  }
  return result.data;
}
function readRegistryManifest(path) {
  let raw;
  try {
    raw = JSON.parse(readFileSync2(path, "utf8"));
  } catch (err) {
    throw new RegistrySchemaError(`Failed to read/parse registry manifest: ${String(err)}`, path);
  }
  if (isRecord(raw) && raw.$schema !== void 0 && raw.$schema !== SUPPORTED_MANIFEST_SCHEMA_URL) {
    throw new RegistrySchemaError(
      `Unsupported registry manifest schema ${JSON.stringify(raw.$schema)}; this CLI build only supports ${SUPPORTED_MANIFEST_SCHEMA_URL}`,
      path
    );
  }
  const result = registryManifestSchema.safeParse(raw);
  if (!result.success) {
    throw new RegistrySchemaError(
      `registry manifest failed schema validation: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      path
    );
  }
  return result.data;
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/commands/plan.ts
import pc2 from "picocolors";
function loadRegistry(cwd, registryOverride) {
  const candidates = [
    // Custom registry path takes highest priority
    registryOverride ? join2(registryOverride, "index.json") : null,
    process.env["SOLIDIOM_REGISTRY_PATH"] ? join2(process.env["SOLIDIOM_REGISTRY_PATH"], "index.json") : null,
    join2(cwd, "..", "..", "registry", "index.json"),
    join2(cwd, "node_modules", "@solidiom", "registry", "index.json"),
    join2(cwd, ".solidiom", "registry-cache.json")
  ].filter(Boolean);
  for (const path of candidates) {
    if (!existsSync2(path)) continue;
    const index = readRegistryIndex(path);
    const registry = /* @__PURE__ */ new Map();
    for (const p of index.primitives) {
      registry.set(p.name, {
        name: p.name,
        deps: ["@solidiom/runtime"],
        adapters: [],
        version: p.version,
        deliverables: p.deliverables,
        stylingOutputs: p.stylingOutputs,
        themeCompatible: p.themeCompatible
      });
    }
    return registry;
  }
  return null;
}
function resolveVersion(pkg, cwd, registryVersion) {
  if (registryVersion) return registryVersion;
  const nmPkgJson = join2(cwd, "node_modules", ...pkg.split("/"), "package.json");
  if (existsSync2(nmPkgJson)) {
    try {
      const data = JSON.parse(readFileSync3(nmPkgJson, "utf8"));
      if (data.version) return data.version;
    } catch {
    }
  }
  const shortName = pkg.replace("@solidiom/", "");
  const monoRepoPkgJson = join2(cwd, "..", "..", "packages", shortName, "package.json");
  if (existsSync2(monoRepoPkgJson)) {
    try {
      const data = JSON.parse(readFileSync3(monoRepoPkgJson, "utf8"));
      if (data.version) return data.version;
    } catch {
    }
  }
  return "latest";
}
function discoverFromNodeModules(primitive, cwd) {
  const pkgJsonPath = join2(cwd, "node_modules", "@solidiom", primitive, "package.json");
  if (!existsSync2(pkgJsonPath)) return null;
  try {
    const data = JSON.parse(readFileSync3(pkgJsonPath, "utf8"));
    const deps = [];
    const adapters = [];
    for (const dep of Object.keys(data.dependencies ?? {})) {
      if (dep.startsWith("@solidiom/adapter-")) {
        adapters.push(dep);
      } else if (dep.startsWith("@solidiom/")) {
        deps.push(dep);
      }
    }
    for (const dep of Object.keys(data.peerDependencies ?? {})) {
      if (dep.startsWith("@solidiom/adapter-") && !adapters.includes(dep)) {
        adapters.push(dep);
      }
    }
    if (!deps.includes("@solidiom/runtime")) deps.unshift("@solidiom/runtime");
    return {
      name: primitive,
      deps,
      adapters,
      version: data.version,
      deliverables: ["primitive"],
      stylingOutputs: [],
      themeCompatible: []
    };
  } catch {
    return null;
  }
}
var BUILTIN_PRIMITIVES = new Map(
  [
    ["dialog", [], []],
    ["select", [], ["@solidiom/adapter-positioning-floating-ui"]],
    ["calendar", [], ["@solidiom/adapter-date-internationalized"]],
    ["carousel", [], ["@solidiom/adapter-carousel-embla"]],
    ["popover", [], ["@solidiom/adapter-positioning-floating-ui"]],
    ["tooltip", [], ["@solidiom/adapter-positioning-floating-ui"]],
    ["menu", [], ["@solidiom/adapter-positioning-floating-ui"]],
    ["combobox", [], ["@solidiom/adapter-positioning-floating-ui"]],
    ["date-picker", [], ["@solidiom/adapter-date-internationalized"]],
    ["button", [], []],
    ["checkbox", [], []],
    ["switch", [], []],
    ["slider", [], []],
    ["accordion", [], []],
    ["tabs", [], []],
    ["collapsible", [], []],
    ["toast", [], []],
    ["listbox", [], []]
  ].map(([name, deps, adapters]) => [
    name,
    {
      name,
      deps: ["@solidiom/runtime", ...deps],
      adapters: [...adapters],
      deliverables: ["primitive"],
      stylingOutputs: [],
      themeCompatible: []
    }
  ])
);
function runPlan(options) {
  const {
    primitive,
    cwd,
    mode: modeOverride,
    registry: registryOverride,
    noNetwork: _noNetwork,
    deliverable: requestedDeliverable,
    styling: requestedStyling
  } = options;
  const configPath = join2(cwd, ".solidiom", "config.json");
  const config = existsSync2(configPath) ? ConfigSchema.parse(JSON.parse(readFileSync3(configPath, "utf8"))) : ConfigSchema.parse({});
  const policyPath = join2(cwd, ".solidiom", "policy.json");
  const policy = existsSync2(policyPath) ? PolicySchema.parse(JSON.parse(readFileSync3(policyPath, "utf8"))) : PolicySchema.parse({});
  const mode = modeOverride ?? config.defaultMode;
  const registry = loadRegistry(cwd, registryOverride);
  let entry = null;
  if (registry) {
    entry = registry.get(primitive) ?? null;
  }
  if (!entry) {
    entry = discoverFromNodeModules(primitive, cwd);
  }
  if (!entry) {
    entry = BUILTIN_PRIMITIVES.get(primitive) ?? null;
  }
  if (!entry) {
    return {
      primitive,
      mode,
      entries: [],
      stylingOutputs: [],
      violations: [`Unknown primitive: "${primitive}" \u2014 not found in registry or node_modules`]
    };
  }
  const primitiveVersion = resolveVersion(`@solidiom/${primitive}`, cwd, entry.version);
  const entries = [
    {
      package: `@solidiom/${primitive}`,
      version: primitiveVersion,
      isAdapter: false,
      reason: "requested"
    },
    ...entry.deps.map((dep) => ({
      package: dep,
      version: resolveVersion(dep, cwd),
      isAdapter: false,
      reason: "dependency"
    })),
    ...entry.adapters.map((adapter) => ({
      package: adapter,
      version: resolveVersion(adapter, cwd),
      isAdapter: true,
      reason: "capability"
    }))
  ];
  const violations = [];
  for (const e of entries) {
    const allowed = policy.allowedPrimitiveVersions[e.package];
    if (allowed) {
      const allowedBase = allowed.replace(/^[\^~]/, "");
      if (!e.version.startsWith(allowedBase)) {
        violations.push(`${e.package}@${e.version} not allowed by policy (requires ${allowed})`);
      }
    }
  }
  if (requestedDeliverable && !entry.deliverables.includes(requestedDeliverable)) {
    violations.push(
      `"${primitive}" does not declare the "${requestedDeliverable}" deliverable (available: ${entry.deliverables.length > 0 ? entry.deliverables.join(", ") : "none"})`
    );
  }
  if (requestedStyling && !entry.stylingOutputs.includes(requestedStyling)) {
    violations.push(
      `"${primitive}" has no "${requestedStyling}" styling output (available: ${entry.stylingOutputs.length > 0 ? entry.stylingOutputs.join(", ") : "none"})`
    );
  }
  if (requestedDeliverable === "theme" && entry.deliverables.includes("theme") && entry.themeCompatible.length === 0) {
    violations.push(
      `"${primitive}" declares the "theme" deliverable but has no themeCompatible entries`
    );
  }
  return {
    primitive,
    mode,
    entries,
    ...requestedDeliverable ? { deliverable: requestedDeliverable } : {},
    ...requestedStyling ? { stylingProfile: requestedStyling } : {},
    stylingOutputs: entry.stylingOutputs,
    violations
  };
}
var PlanCommand = class extends Command2 {
  static paths = [["plan"]];
  static usage = Command2.Usage({
    description: "Resolve capability graph for a primitive",
    examples: [
      ["Plan dialog installation", "solidiom plan dialog"],
      ["Plan as JSON", "solidiom plan select --json"],
      ["Plan in source mode", "solidiom plan dialog --mode source"],
      ["Plan a component deliverable", "solidiom plan button --deliverable component"],
      ["Plan with a specific styling profile", "solidiom plan button --styling tailwind"]
    ]
  });
  primitive = Option2.String({ required: true });
  json = Option2.Boolean("--json", false, { description: "Output as JSON" });
  mode = Option2.String("--mode", { description: "Install mode (package or source)" });
  registry = Option2.String("--registry", {
    description: "Custom registry URL for package resolution"
  });
  noNetwork = Option2.Boolean("--no-network", false, {
    description: "Use only cached/local registry data (no network fetch)"
  });
  deliverable = Option2.String("--deliverable", {
    description: "Product-layer deliverable to resolve (primitive, component, block, template, theme)"
  });
  styling = Option2.String("--styling", {
    description: "Styling profile to resolve (css, tailwind, unocss)"
  });
  async execute() {
    const plan = runPlan({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode,
      registry: this.registry,
      noNetwork: this.noNetwork,
      deliverable: this.deliverable,
      styling: this.styling
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(plan, null, 2) + "\n");
      return 0;
    }
    this.context.stdout.write(`
Plan for ${pc2.bold(plan.primitive)} (${plan.mode} mode):

`);
    if (plan.deliverable) {
      this.context.stdout.write(`  deliverable: ${pc2.cyan(plan.deliverable)}
`);
    }
    if (plan.stylingProfile) {
      this.context.stdout.write(`  styling: ${pc2.cyan(plan.stylingProfile)}
`);
    }
    for (const entry of plan.entries) {
      const tag = entry.isAdapter ? pc2.cyan("[adapter]") : pc2.dim(`[${entry.reason}]`);
      this.context.stdout.write(`  ${entry.package}@${pc2.green(entry.version)} ${tag}
`);
    }
    if (plan.violations.length > 0) {
      this.context.stderr.write(pc2.red("\nPolicy violations:\n"));
      for (const v of plan.violations) {
        this.context.stderr.write(pc2.red(`  \u2717 ${v}
`));
      }
      return 1;
    }
    this.context.stdout.write(`
${pc2.dim(`${plan.entries.length} packages resolved.`)}
`);
    return 0;
  }
};

// src/commands/add.ts
import { Command as Command4, Option as Option4 } from "clipanion";

// src/source-install/install.ts
import { existsSync as existsSync8, mkdirSync as mkdirSync4, readFileSync as readFileSync8, writeFileSync as writeFileSync4, readdirSync, statSync } from "fs";
import { join as join7, relative, dirname as dirname4 } from "path";

// src/source-install/lock.ts
import { existsSync as existsSync3, mkdirSync as mkdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2 } from "fs";
import { join as join3, dirname } from "path";
import { createHash } from "crypto";
function computeDigest(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}
function readLock(cwd) {
  const lockPath = join3(cwd, ".solidiom", "lock.json");
  if (existsSync3(lockPath)) {
    return JSON.parse(readFileSync4(lockPath, "utf8"));
  }
  return { version: 1, installed: {} };
}
function writeLock(cwd, lock) {
  const lockPath = join3(cwd, ".solidiom", "lock.json");
  mkdirSync2(dirname(lockPath), { recursive: true });
  writeFileSync2(lockPath, JSON.stringify(lock, null, 2) + "\n");
}

// src/source-install/verify-source.ts
import { existsSync as existsSync5 } from "fs";
import { join as join5 } from "path";

// src/commands/verify.ts
import { Command as Command3, Option as Option3 } from "clipanion";
import { readFileSync as readFileSync5, existsSync as existsSync4 } from "fs";
import { join as join4, dirname as dirname2, basename } from "path";
import { createVerify, createHmac, createHash as createHash2 } from "crypto";
import pc3 from "picocolors";
async function verifySigstore(artifact, trustedIdentities, noNetwork) {
  let bundleFromJSON;
  let Verifier;
  let toSignedEntity;
  let toTrustMaterial;
  let getTrustedRoot;
  let VerificationError;
  try {
    const bundleMod = await import("@sigstore/bundle");
    const verifyMod = await import("@sigstore/verify");
    const tufMod = await import("@sigstore/tuf");
    bundleFromJSON = bundleMod.bundleFromJSON;
    Verifier = verifyMod.Verifier;
    toSignedEntity = verifyMod.toSignedEntity;
    toTrustMaterial = verifyMod.toTrustMaterial;
    getTrustedRoot = tufMod.getTrustedRoot;
    VerificationError = verifyMod.VerificationError;
  } catch (err) {
    return { verified: false, mode: "sigstore", reason: `Missing dependency: ${String(err)}` };
  }
  const bundlePath = findBundlePath(artifact);
  if (!bundlePath) {
    return {
      verified: false,
      mode: "sigstore",
      reason: `No Sigstore bundle found alongside artifact. Expected ${artifact}.sigstore.json`
    };
  }
  let bundle;
  try {
    const raw = JSON.parse(readFileSync5(bundlePath, "utf8"));
    bundle = bundleFromJSON(raw);
  } catch (err) {
    return { verified: false, mode: "sigstore", reason: `Failed to parse bundle: ${String(err)}` };
  }
  let trustedRoot;
  try {
    trustedRoot = await getTrustedRoot({ forceCache: noNetwork });
  } catch (err) {
    return {
      verified: false,
      mode: "sigstore",
      reason: `Failed to fetch TUF trusted root: ${String(err)}`
    };
  }
  const trust = toTrustMaterial(trustedRoot);
  const verifier = new Verifier(trust);
  const entity = toSignedEntity(bundle);
  const policy = trustedIdentities.length > 0 ? { subjectAlternativeName: { type: "email", value: trustedIdentities[0] } } : void 0;
  try {
    const signer = verifier.verify(entity, policy);
    const identity = signer?.identity?.subjectAlternativeName ?? "unknown";
    return { verified: true, mode: "sigstore", reason: "Sigstore bundle verified", identity };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return { verified: false, mode: "sigstore", reason };
  }
}
function findBundlePath(artifact) {
  const candidates = [`${artifact}.sigstore.json`, `${artifact}.sigstore`];
  const dir = dirname2(artifact);
  const base = basename(artifact);
  candidates.push(join4(dir, `${base}.sigstore.json`), join4(dir, `${base}.sigstore`));
  for (const p of candidates) {
    if (existsSync4(p)) return p;
  }
  return null;
}
function verifyTrustedKeys(artifact, cwd) {
  const keysPath = join4(cwd, ".solidiom", "trusted-keys.json");
  if (!existsSync4(keysPath)) {
    return { verified: false, mode: "trusted-keys", reason: "No .solidiom/trusted-keys.json found" };
  }
  let keys;
  try {
    keys = JSON.parse(readFileSync5(keysPath, "utf8"));
    if (!Array.isArray(keys)) throw new Error("expected array");
  } catch (err) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `Invalid trusted-keys.json: ${String(err)}`
    };
  }
  const sigPath = `${artifact}.sig`;
  if (!existsSync4(sigPath)) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `No signature file found at ${sigPath}`
    };
  }
  let artifactBytes;
  let sigBytes;
  try {
    artifactBytes = readFileSync5(artifact);
    sigBytes = Buffer.from(readFileSync5(sigPath, "utf8").trim(), "base64");
  } catch (err) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `Failed to read artifact or signature: ${String(err)}`
    };
  }
  const sortedKeys = [...keys].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === "active" ? -1 : 1;
  });
  for (const key of sortedKeys) {
    try {
      const algo = resolveAlgo(key.algorithm);
      const verify = createVerify(algo);
      verify.update(artifactBytes);
      const ok = verify.verify(key.publicKey, sigBytes);
      if (ok) {
        return {
          verified: true,
          mode: "trusted-keys",
          reason: `Signature verified against key ${key.id} (${key.status})`,
          identity: key.id
        };
      }
    } catch {
    }
  }
  return {
    verified: false,
    mode: "trusted-keys",
    reason: "Signature did not verify against any trusted key"
  };
}
function resolveAlgo(algorithm) {
  switch (algorithm) {
    case "ed25519":
      return "Ed25519";
    case "rsa-sha256":
      return "RSA-SHA256";
    case "rsa-sha512":
      return "RSA-SHA512";
  }
}
function verifyRegistry(options) {
  const { cwd, verifyKeys = [], requireSignature = false } = options;
  const registryDir = options.registryDir ?? join4(cwd, "registry");
  const indexPath = join4(registryDir, "index.json");
  const violations = [];
  if (!existsSync4(indexPath)) {
    return {
      verified: false,
      reason: `Registry index not found at ${indexPath}`,
      primitivesChecked: 0,
      violations: [`missing ${indexPath}`]
    };
  }
  let index;
  try {
    index = readRegistryIndex(indexPath);
  } catch (err) {
    const reason = err instanceof RegistrySchemaError ? err.message : String(err);
    return {
      verified: false,
      reason: `Registry index failed schema verification: ${reason}`,
      primitivesChecked: 0,
      violations: [reason]
    };
  }
  if (requireSignature || index.integrity.signature) {
    if (!index.integrity.signature) {
      violations.push("registry index is not signed but signing is required by policy");
    } else if (verifyKeys.length === 0) {
      violations.push(
        "registry index is signed but no verification key was provided (set REGISTRY_VERIFY_KEY or policy.registryTrustedKeys)"
      );
    } else {
      const { signature, signedAt, signatureKeyId, ...restIntegrity } = index.integrity;
      const preSigIndex = { ...index, integrity: restIntegrity };
      const preSigContent = JSON.stringify(preSigIndex, null, 2);
      const matchedKey = verifyKeys.find((key) => {
        const expected = createHmac("sha256", key).update(preSigContent).digest("hex");
        return expected === signature;
      });
      if (!matchedKey) {
        violations.push("registry index signature does not verify against any trusted key");
      } else if (signatureKeyId) {
        const expectedKeyId = createHash2("sha256").update(matchedKey).digest("hex").slice(0, 16);
        if (expectedKeyId !== signatureKeyId) {
          violations.push("registry index signatureKeyId does not match the verifying key");
        }
      }
    }
  }
  let primitivesChecked = 0;
  for (const summary of index.primitives) {
    const manifestPath = join4(registryDir, `${summary.name}.json`);
    if (!existsSync4(manifestPath)) {
      violations.push(`${summary.name}: manifest file missing at ${manifestPath}`);
      continue;
    }
    let manifest;
    try {
      manifest = readRegistryManifest(manifestPath);
    } catch (err) {
      const reason = err instanceof RegistrySchemaError ? err.message : String(err);
      violations.push(`${summary.name}: manifest schema verification failed \u2014 ${reason}`);
      continue;
    }
    const sortedDigests = Object.entries(manifest.integrity.fileDigests).sort(
      ([a], [b]) => a.localeCompare(b)
    );
    const recomputed = createHash2("sha256").update(sortedDigests.map(([, digest]) => digest).join("")).digest("hex");
    if (recomputed !== manifest.integrity.filesHash) {
      violations.push(
        `${summary.name}: filesHash mismatch \u2014 recorded ${manifest.integrity.filesHash}, recomputed ${recomputed} from fileDigests`
      );
      continue;
    }
    primitivesChecked += 1;
  }
  return {
    verified: violations.length === 0,
    reason: violations.length === 0 ? "Registry integrity verified" : "Registry integrity failed",
    primitivesChecked,
    violations
  };
}
async function runVerify(options) {
  const { cwd, artifact, noNetwork = false } = options;
  const policyPath = join4(cwd, ".solidiom", "policy.json");
  if (!existsSync4(policyPath)) {
    return { verified: true, mode: "none", reason: "No policy \u2014 verification skipped" };
  }
  const policy = PolicySchema.parse(JSON.parse(readFileSync5(policyPath, "utf8")));
  switch (policy.signatureMode) {
    case "none":
      return { verified: true, mode: "none", reason: "Signature verification disabled by policy" };
    case "sigstore":
      return verifySigstore(artifact, policy.trustedIdentities, noNetwork);
    case "trusted-keys":
      return verifyTrustedKeys(artifact, cwd);
  }
}
var VerifyCommand = class extends Command3 {
  static paths = [["verify"]];
  static usage = Command3.Usage({
    description: "Verify artifact signatures against policy",
    examples: [
      ["Verify a package tarball", "solidiom verify @solidiom/dialog"],
      [
        "Offline verification (use cached TUF root)",
        "solidiom verify ./dist/dialog.tgz --no-network"
      ],
      ["Output as JSON", "solidiom verify ./dist/dialog.tgz --json"],
      ["Verify the registry catalog", "solidiom verify --registry"]
    ]
  });
  artifact = Option3.String({ required: false });
  noNetwork = Option3.Boolean("--no-network", false, {
    description: "Skip TUF network fetch; use cached trust root"
  });
  json = Option3.Boolean("--json", false, { description: "Output result as JSON" });
  registry = Option3.Boolean("--registry", false, {
    description: "Verify registry/index.json and per-primitive manifest integrity instead of an artifact"
  });
  async execute() {
    if (this.registry) {
      const cwd = process.cwd();
      const policyPath = join4(cwd, ".solidiom", "policy.json");
      const policy = existsSync4(policyPath) ? PolicySchema.parse(JSON.parse(readFileSync5(policyPath, "utf8"))) : PolicySchema.parse({});
      const envKey = process.env["REGISTRY_VERIFY_KEY"];
      const verifyKeys = [...envKey ? [envKey] : [], ...policy.registryTrustedKeys];
      const result2 = verifyRegistry({
        cwd,
        verifyKeys,
        requireSignature: policy.registrySignatureRequired
      });
      if (this.json) {
        this.context.stdout.write(JSON.stringify(result2, null, 2) + "\n");
        return result2.verified ? 0 : 1;
      }
      if (result2.verified) {
        this.context.stdout.write(
          pc3.green(`\u2713 Registry verified: ${result2.primitivesChecked} manifest(s) checked
`)
        );
        return 0;
      }
      this.context.stderr.write(pc3.red(`\u2717 Registry verification failed:
`));
      for (const violation of result2.violations) {
        this.context.stderr.write(pc3.red(`  \u2717 ${violation}
`));
      }
      return 1;
    }
    if (!this.artifact) {
      this.context.stderr.write(pc3.red("\u2717 An artifact path is required unless --registry is set\n"));
      return 1;
    }
    const result = await runVerify({
      cwd: process.cwd(),
      artifact: this.artifact,
      noNetwork: this.noNetwork
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return result.verified ? 0 : 1;
    }
    if (result.verified) {
      const id = result.identity ? ` [${result.identity}]` : "";
      this.context.stdout.write(pc3.green(`\u2713 Verified (${result.mode})${id}: ${result.reason}
`));
      return 0;
    }
    this.context.stderr.write(pc3.red(`\u2717 Verification failed (${result.mode}): ${result.reason}
`));
    return 1;
  }
};

// src/source-install/verify-source.ts
function resolveRegistryDir(cwd, registryDirOverride) {
  const candidates = [
    registryDirOverride ?? null,
    process.env["SOLIDIOM_REGISTRY_PATH"] ?? null,
    join5(cwd, "..", "..", "registry"),
    join5(cwd, "node_modules", "@solidiom", "registry")
  ].filter(Boolean);
  for (const dir of candidates) {
    if (existsSync5(join5(dir, "index.json"))) return dir;
  }
  return null;
}
function resolveManifestPath(primitive, cwd, registryDirOverride) {
  const registryDir = resolveRegistryDir(cwd, registryDirOverride);
  const candidates = [
    registryDirOverride ? join5(registryDirOverride, `${primitive}.json`) : null,
    process.env["SOLIDIOM_REGISTRY_PATH"] ? join5(process.env["SOLIDIOM_REGISTRY_PATH"], `${primitive}.json`) : null,
    registryDir ? join5(registryDir, `${primitive}.json`) : null,
    join5(cwd, "..", "..", "registry", `${primitive}.json`),
    join5(cwd, "node_modules", "@solidiom", "registry", `${primitive}.json`),
    join5(cwd, ".solidiom", "registry-cache", `${primitive}.json`)
  ].filter(Boolean);
  return candidates.find((path) => existsSync5(path)) ?? null;
}
function toFileMap(files) {
  if (files instanceof Map) return files;
  const map = /* @__PURE__ */ new Map();
  for (const { relPath, content } of files) map.set(relPath, content);
  return map;
}
function verifySourceIntegrity(options) {
  const {
    cwd,
    registryDir: registryDirOverride,
    primitive,
    files: filesInput,
    verifyKeys = [],
    requireSignature = false
  } = options;
  const verifiedAt = (/* @__PURE__ */ new Date()).toISOString();
  const files = toFileMap(filesInput);
  const registryDir = resolveRegistryDir(cwd, registryDirOverride) ?? void 0;
  const registryResult = verifyRegistry({
    cwd,
    registryDir,
    verifyKeys,
    requireSignature
  });
  if (!registryResult.verified) {
    return {
      verified: false,
      violations: registryResult.violations.length > 0 ? registryResult.violations : [registryResult.reason],
      verifiedAt
    };
  }
  const manifestPath = resolveManifestPath(primitive, cwd, registryDirOverride);
  if (!manifestPath) {
    return {
      verified: false,
      violations: [`No registry manifest found for primitive "${primitive}"`],
      verifiedAt
    };
  }
  let manifest;
  try {
    manifest = readRegistryManifest(manifestPath);
  } catch (err) {
    const reason = err instanceof RegistrySchemaError ? err.message : String(err);
    return {
      verified: false,
      violations: [`Manifest for "${primitive}" failed schema verification: ${reason}`],
      verifiedAt
    };
  }
  const violations = [];
  const fileDigests = manifest.integrity.fileDigests;
  for (const [relPath, content] of files) {
    const expected = fileDigests[relPath];
    if (expected === void 0) {
      violations.push(
        `${relPath}: present in source files but has no entry in manifest fileDigests`
      );
      continue;
    }
    const actual = computeDigest(content);
    if (actual !== expected) {
      violations.push(`${relPath}: content digest mismatch \u2014 expected ${expected}, got ${actual}`);
    }
  }
  for (const relPath of Object.keys(fileDigests)) {
    if (!files.has(relPath)) {
      violations.push(`${relPath}: present in manifest fileDigests but missing from source files`);
    }
  }
  let signatureKeyId;
  if (registryDir) {
    try {
      const index = readRegistryIndex(join5(registryDir, "index.json"));
      signatureKeyId = index.integrity.signatureKeyId;
    } catch {
    }
  }
  return {
    verified: violations.length === 0,
    violations,
    manifestFilesHash: manifest.integrity.filesHash,
    ...signatureKeyId ? { signatureKeyId } : {},
    verifiedAt
  };
}

// src/source-install/destinations.ts
var UnsupportedDeliverableError = class extends Error {
  constructor(deliverable) {
    super(
      `Deliverable "${deliverable}" is not installable via \`add\`/source-install \u2014 "template" deliverables are materialized via \`solidiom create\` (CLI-007), not this flow.`
    );
    this.deliverable = deliverable;
    this.name = "UnsupportedDeliverableError";
  }
  deliverable;
};
function resolveDestinationRoot(deliverable, config) {
  switch (deliverable) {
    case "primitive":
      return config.sourceDir;
    case "component":
      return config.componentDir;
    case "block":
      return config.blockDir;
    case "theme":
      return config.themeDir;
    case "template":
      throw new UnsupportedDeliverableError(deliverable);
    default: {
      const _never = deliverable;
      throw new Error(`Unhandled deliverable kind: ${String(_never)}`);
    }
  }
}

// src/source-install/conflict.ts
import { existsSync as existsSync6, readFileSync as readFileSync6 } from "fs";
import { join as join6 } from "path";
function classifyConflicts(options) {
  const { cwd, plannedFiles, force = false } = options;
  const lock = options.lock ?? readLock(cwd);
  const entries = [];
  let hasBlockingConflicts = false;
  for (const [relPath, newContent] of plannedFiles) {
    const fullPath = join6(cwd, relPath);
    const lockEntry = lock.installed[relPath];
    const existsOnDisk = existsSync6(fullPath);
    if (!existsOnDisk) {
      entries.push({ path: relPath, classification: "create" });
      continue;
    }
    const onDiskContent = readFileSync6(fullPath, "utf8");
    const onDiskDigest = computeDigest(onDiskContent);
    const plannedDigest = computeDigest(newContent);
    const contentIdentical = onDiskDigest === plannedDigest;
    if (contentIdentical) {
      entries.push({ path: relPath, classification: "unchanged" });
      continue;
    }
    if (!lockEntry) {
      const classification = "modified-by-user";
      const diff2 = renderUnifiedDiff(onDiskContent, newContent, relPath);
      entries.push({ path: relPath, classification, diff: diff2 });
      if (!force) hasBlockingConflicts = true;
      continue;
    }
    if (onDiskDigest === lockEntry.digest) {
      const diff2 = renderUnifiedDiff(onDiskContent, newContent, relPath);
      entries.push({ path: relPath, classification: "overwrite", diff: diff2 });
      continue;
    }
    const diff = renderUnifiedDiff(onDiskContent, newContent, relPath);
    entries.push({ path: relPath, classification: "modified-by-user", diff });
    if (!force) hasBlockingConflicts = true;
  }
  return { entries, hasBlockingConflicts };
}
function renderUnifiedDiff(oldContent, newContent, label) {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");
  const contextSize = 3;
  if (oldContent === newContent) {
    return `--- ${label}
+++ ${label}
(no differences)
`;
  }
  const maxLen = Math.max(oldLines.length, newLines.length);
  let firstDiff = 0;
  while (firstDiff < maxLen && oldLines[firstDiff] !== void 0 && newLines[firstDiff] !== void 0 && oldLines[firstDiff] === newLines[firstDiff]) {
    firstDiff++;
  }
  let oldEnd = oldLines.length - 1;
  let newEnd = newLines.length - 1;
  while (oldEnd > firstDiff - 1 && newEnd > firstDiff - 1 && oldLines[oldEnd] !== void 0 && newLines[newEnd] !== void 0 && oldLines[oldEnd] === newLines[newEnd]) {
    oldEnd--;
    newEnd--;
  }
  const contextStart = Math.max(0, firstDiff - contextSize);
  const oldHunkEnd = Math.min(oldLines.length - 1, oldEnd + contextSize);
  const newHunkEnd = Math.min(newLines.length - 1, newEnd + contextSize);
  const oldHunkLen = oldHunkEnd - contextStart + 1;
  const newHunkLen = newHunkEnd - contextStart + 1;
  const lines = [`--- ${label}`, `+++ ${label}`];
  lines.push(
    `@@ -${contextStart + 1},${Math.max(oldHunkLen, 0)} +${contextStart + 1},${Math.max(newHunkLen, 0)} @@`
  );
  for (let i = contextStart; i < firstDiff; i++) {
    lines.push(` ${oldLines[i] ?? ""}`);
  }
  for (let i = firstDiff; i <= oldEnd; i++) {
    lines.push(`-${oldLines[i]}`);
  }
  for (let i = firstDiff; i <= newEnd; i++) {
    lines.push(`+${newLines[i]}`);
  }
  for (let i = oldEnd + 1; i <= oldHunkEnd; i++) {
    lines.push(` ${oldLines[i] ?? ""}`);
  }
  return lines.join("\n") + "\n";
}

// src/source-install/rollback.ts
import { existsSync as existsSync7, mkdirSync as mkdirSync3, readFileSync as readFileSync7, rmSync, writeFileSync as writeFileSync3 } from "fs";
import { dirname as dirname3 } from "path";
function createRollbackJournal() {
  const recorded = [];
  const previous = /* @__PURE__ */ new Map();
  return {
    recordBeforeWrite(path) {
      if (previous.has(path)) return;
      previous.set(path, existsSync7(path) ? readFileSync7(path, "utf8") : null);
      recorded.push(path);
    },
    entries() {
      return [...recorded];
    },
    apply() {
      for (let i = recorded.length - 1; i >= 0; i--) {
        const path = recorded[i];
        const content = previous.get(path) ?? null;
        if (content === null) {
          rmSync(path, { force: true });
        } else {
          mkdirSync3(dirname3(path), { recursive: true });
          writeFileSync3(path, content);
        }
      }
      recorded.length = 0;
      previous.clear();
    }
  };
}

// src/source-install/install.ts
function rewriteImports(content, filePath, runtimeDir) {
  const fileDir = dirname4(filePath);
  const relToRuntime = relative(fileDir, runtimeDir).replace(/\\/g, "/") || ".";
  const prefix = relToRuntime.startsWith(".") ? relToRuntime : `./${relToRuntime}`;
  return content.replace(/from\s+["']@solidiom\/runtime(\/[^"']*)?["']/g, (_match, subpath) => {
    const target = subpath ? `${prefix}${subpath}` : `${prefix}/index`;
    return `from "${target}"`;
  });
}
function collectRuntimeFiles(runtimeSourceDir) {
  const files = /* @__PURE__ */ new Map();
  if (!existsSync8(runtimeSourceDir)) return files;
  function walk(dir, prefix) {
    for (const entry of readdirSync(dir)) {
      const full = join7(dir, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else if (entry.endsWith(".ts") && !entry.includes(".test.")) {
        files.set(rel, readFileSync8(full, "utf8"));
      }
    }
  }
  walk(runtimeSourceDir, "");
  return files;
}
function installSource(options) {
  const {
    primitive,
    cwd,
    plan,
    dryRun = false,
    allowUnverified = false,
    force = false,
    diff = false
  } = options;
  const configPath = join7(cwd, ".solidiom", "config.json");
  const config = existsSync8(configPath) ? ConfigSchema.parse(JSON.parse(readFileSync8(configPath, "utf8"))) : ConfigSchema.parse({});
  const policyPath = join7(cwd, ".solidiom", "policy.json");
  const policy = existsSync8(policyPath) ? PolicySchema.parse(JSON.parse(readFileSync8(policyPath, "utf8"))) : PolicySchema.parse({});
  const deliverable = plan.deliverable ?? "primitive";
  const sourceDir = join7(cwd, resolveDestinationRoot(deliverable, config));
  const runtimeDir = join7(cwd, config.runtimeDir);
  const filesWritten = [];
  const runtimeDeduped = [];
  const primitiveSourceDir = resolvePrimitiveSource(primitive, cwd);
  if (!primitiveSourceDir) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: false,
      violations: [`Could not resolve source directory for primitive "${primitive}"`]
    };
  }
  const primitiveTarget = join7(sourceDir, primitive);
  const sourceFiles = collectSourceFiles(primitiveSourceDir);
  const envKey = process.env["REGISTRY_VERIFY_KEY"];
  const verifyKeys = [
    ...envKey ? [envKey] : [],
    ...policy.registryTrustedKeys,
    ...policy.sourceInstallTrustedKeys
  ];
  const verifyResult = verifySourceIntegrity({
    cwd,
    primitive,
    files: sourceFiles,
    verifyKeys,
    requireSignature: policy.registrySignatureRequired
  });
  if (!verifyResult.verified && policy.requireVerifiedSource && !allowUnverified) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: false,
      violations: verifyResult.violations
    };
  }
  const provenance = verifyResult.verified ? "verified" : "unverified";
  const lock = readLock(cwd);
  const plannedFiles = /* @__PURE__ */ new Map();
  for (const [relPath, content] of sourceFiles) {
    const targetPath = join7(primitiveTarget, relPath);
    const relFromCwd = relative(cwd, targetPath);
    const rewritten = rewriteImports(content, targetPath, runtimeDir);
    plannedFiles.set(relFromCwd, rewritten);
  }
  const runtimePkgSource = resolveRuntimeSource(cwd);
  const runtimeFiles = runtimePkgSource ? collectRuntimeFiles(runtimePkgSource) : /* @__PURE__ */ new Map();
  for (const [relPath, content] of runtimeFiles) {
    const targetPath = join7(runtimeDir, relPath);
    const relFromCwd = relative(cwd, targetPath);
    if (!existsSync8(targetPath)) {
      plannedFiles.set(relFromCwd, content);
    }
  }
  const conflictReport = classifyConflicts({ cwd, plannedFiles, force, lock });
  if (diff) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: verifyResult.verified,
      violations: verifyResult.verified ? [] : verifyResult.violations,
      conflicts: conflictReport
    };
  }
  if (conflictReport.hasBlockingConflicts && !force) {
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: verifyResult.verified,
      violations: verifyResult.verified ? [] : verifyResult.violations,
      conflicts: conflictReport
    };
  }
  const journal = createRollbackJournal();
  try {
    if (!dryRun) mkdirSync4(primitiveTarget, { recursive: true });
    for (const [relPath, content] of sourceFiles) {
      const targetPath = join7(primitiveTarget, relPath);
      const rewritten = rewriteImports(content, targetPath, runtimeDir);
      if (!dryRun) {
        journal.recordBeforeWrite(targetPath);
        mkdirSync4(dirname4(targetPath), { recursive: true });
        writeFileSync4(targetPath, rewritten);
      }
      const relFromCwd = relative(cwd, targetPath);
      filesWritten.push(relFromCwd);
      lock.installed[relFromCwd] = {
        path: relFromCwd,
        digest: computeDigest(content),
        primitive,
        version: plan.entries[0]?.version ?? "0.0.1-next.0",
        manifestFilesHash: verifyResult.manifestFilesHash ?? "",
        ...verifyResult.signatureKeyId ? { signatureKeyId: verifyResult.signatureKeyId } : {},
        verifiedAt: verifyResult.verifiedAt,
        provenance
      };
    }
    if (runtimePkgSource) {
      if (!dryRun) mkdirSync4(runtimeDir, { recursive: true });
      for (const [relPath, content] of runtimeFiles) {
        const targetPath = join7(runtimeDir, relPath);
        const relFromCwd = relative(cwd, targetPath);
        if (!existsSync8(targetPath)) {
          if (!dryRun) {
            journal.recordBeforeWrite(targetPath);
            mkdirSync4(dirname4(targetPath), { recursive: true });
            writeFileSync4(targetPath, content);
          }
          filesWritten.push(relFromCwd);
          runtimeDeduped.push(relFromCwd);
        }
        lock.installed[relFromCwd] = {
          path: relFromCwd,
          digest: computeDigest(content),
          primitive: "_runtime",
          version: plan.entries.find((e) => e.package === "@solidiom/runtime")?.version ?? "0.0.1-next.0",
          manifestFilesHash: verifyResult.manifestFilesHash ?? "",
          ...verifyResult.signatureKeyId ? { signatureKeyId: verifyResult.signatureKeyId } : {},
          verifiedAt: verifyResult.verifiedAt,
          provenance
        };
      }
    }
    if (!dryRun) {
      journal.recordBeforeWrite(join7(cwd, ".solidiom", "lock.json"));
      writeLock(cwd, lock);
    }
  } catch (err) {
    journal.apply();
    return {
      filesWritten: [],
      runtimeDeduped: [],
      lockUpdated: false,
      verified: verifyResult.verified,
      violations: [
        ...verifyResult.verified ? [] : verifyResult.violations,
        `Install failed and was rolled back: ${err instanceof Error ? err.message : String(err)}`
      ]
    };
  }
  return {
    filesWritten,
    runtimeDeduped,
    lockUpdated: !dryRun,
    verified: verifyResult.verified,
    violations: verifyResult.verified ? [] : verifyResult.violations
  };
}
function collectSourceFiles(dir) {
  const files = /* @__PURE__ */ new Map();
  if (!existsSync8(dir)) return files;
  function walk(d, prefix) {
    for (const entry of readdirSync(d)) {
      const full = join7(d, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else if ((entry.endsWith(".ts") || entry.endsWith(".tsx")) && !entry.includes(".test.")) {
        files.set(rel, readFileSync8(full, "utf8"));
      }
    }
  }
  walk(dir, "");
  return files;
}
function resolvePrimitiveSource(primitive, cwd) {
  const monoPath = join7(cwd, "..", "..", "packages", primitive, "source");
  if (existsSync8(monoPath)) return monoPath;
  const nmPath = join7(cwd, "node_modules", "@solidiom", primitive, "source");
  if (existsSync8(nmPath)) return nmPath;
  return null;
}
function resolveRuntimeSource(cwd) {
  const monoPath = join7(cwd, "..", "..", "packages", "runtime", "src");
  if (existsSync8(monoPath)) return monoPath;
  const nmPath = join7(cwd, "node_modules", "@solidiom", "runtime", "src");
  if (existsSync8(nmPath)) return nmPath;
  return null;
}

// src/package-manager/detect.ts
import { existsSync as existsSync9, readFileSync as readFileSync9 } from "fs";
import { dirname as dirname5, join as join8 } from "path";
var LOCKFILE_TO_MANAGER = {
  "pnpm-lock.yaml": "pnpm",
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "bun.lockb": "bun",
  "bun.lock": "bun"
};
var VALID_NAMES = /* @__PURE__ */ new Set(["npm", "pnpm", "yarn", "bun"]);
function isPackageManagerName(value) {
  return VALID_NAMES.has(value);
}
function parseUserAgent(userAgent) {
  if (!userAgent) return null;
  const match = userAgent.match(/^(npm|pnpm|yarn|bun)\/(\d+)/);
  if (!match) return null;
  const [, name, major] = match;
  if (!isPackageManagerName(name)) return null;
  return { name, majorVersion: Number(major), source: "npm_config_user_agent" };
}
function findLockfile(from, maxDepth = 10) {
  let dir = from;
  for (let i = 0; i < maxDepth; i++) {
    for (const [file, manager] of Object.entries(LOCKFILE_TO_MANAGER)) {
      if (existsSync9(join8(dir, file))) {
        return { manager, dir };
      }
    }
    const parent = dirname5(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
function findPackageManagerField(from, maxDepth = 10) {
  let dir = from;
  for (let i = 0; i < maxDepth; i++) {
    const pkgPath = join8(dir, "package.json");
    if (existsSync9(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync9(pkgPath, "utf8"));
        const field = pkg["packageManager"];
        if (typeof field === "string") {
          const match = field.match(/^(npm|pnpm|yarn|bun)@(\d+)/);
          if (match && isPackageManagerName(match[1])) {
            return { name: match[1], majorVersion: Number(match[2]) };
          }
        }
      } catch {
      }
    }
    const parent = dirname5(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
function detectPackageManager(options) {
  const { cwd, override, env = process.env } = options;
  if (override) {
    if (!isPackageManagerName(override)) {
      throw new Error(
        `Unknown package manager "${override}" \u2014 expected one of: npm, pnpm, yarn, bun`
      );
    }
    return { name: override, source: "flag" };
  }
  const fromUserAgent = parseUserAgent(env["npm_config_user_agent"]);
  if (fromUserAgent) return fromUserAgent;
  const lockfile = findLockfile(cwd);
  if (lockfile) {
    return { name: lockfile.manager, source: "lockfile" };
  }
  const packageManagerField = findPackageManagerField(cwd);
  if (packageManagerField) {
    return {
      name: packageManagerField.name,
      majorVersion: packageManagerField.majorVersion,
      source: "packageManager-field"
    };
  }
  return { name: "npm", source: "default" };
}

// src/package-manager/commands.ts
function add(pm, packages) {
  return { bin: pm.name, args: ["add", ...packages] };
}
function install(pm) {
  switch (pm.name) {
    case "npm":
      return { bin: "npm", args: ["install"] };
    case "pnpm":
      return { bin: "pnpm", args: ["install"] };
    case "yarn":
      return { bin: "yarn", args: ["install"] };
    case "bun":
      return { bin: "bun", args: ["install"] };
  }
}
function formatCommand(command) {
  return [command.bin, ...command.args].join(" ");
}

// src/package-manager/exec.ts
import { execFile } from "child_process";
function runPackageManager(options) {
  const { command, cwd, env = process.env, dryRun = false, timeoutMs = 5 * 60 * 1e3 } = options;
  if (dryRun) {
    return Promise.resolve({ code: 0, stdout: "", stderr: "", skipped: true });
  }
  return new Promise((resolve2) => {
    execFile(
      command.bin,
      command.args,
      { cwd, env, timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error && typeof error.code === "string") {
          resolve2({ code: 127, stdout, stderr: stderr || String(error), skipped: false });
          return;
        }
        const code = error && typeof error.code === "number" ? error.code : error ? 1 : 0;
        resolve2({ code, stdout, stderr, skipped: false });
      }
    );
  });
}

// src/commands/add.ts
import pc4 from "picocolors";
async function runAdd(options) {
  const plan = runPlan({
    primitive: options.primitive,
    cwd: options.cwd,
    mode: options.mode,
    registry: options.registry,
    noNetwork: options.noNetwork,
    deliverable: options.deliverable,
    styling: options.styling
  });
  if (plan.violations.length > 0) {
    return { plan, installCommand: null, blocked: true };
  }
  if (plan.mode === "source") {
    const sourceResult = installSource({
      primitive: options.primitive,
      cwd: options.cwd,
      plan,
      dryRun: options.dryRun,
      allowUnverified: options.allowUnverified,
      force: options.force,
      diff: options.diff
    });
    return { plan, installCommand: null, blocked: false, sourceResult };
  }
  const packages = plan.entries.map((e) => `${e.package}@${e.version}`);
  const pm = detectPackageManager({ cwd: options.cwd, override: options.packageManager });
  const command = add(pm, packages);
  const installCommand = formatCommand(command);
  if (options.install && !options.dryRun) {
    const installRun = await runPackageManager({ command, cwd: options.cwd });
    return { plan, installCommand, blocked: false, installRun };
  }
  return { plan, installCommand, blocked: false };
}
var AddCommand = class extends Command4 {
  static paths = [["add"]];
  static usage = Command4.Usage({
    description: "Add a primitive (package or source mode)",
    examples: [
      ["Add dialog as package", "solidiom add dialog"],
      ["Add dialog as source", "solidiom add dialog --mode source"],
      ["Dry run", "solidiom add select --dry-run"],
      ["Add a component deliverable", "solidiom add button --deliverable component"],
      ["Add with a specific styling profile", "solidiom add button --styling tailwind"],
      [
        "Actually run the install with a specific package manager",
        "solidiom add dialog --install --package-manager yarn"
      ],
      [
        "Proceed with an unverified source install",
        "solidiom add dialog --mode source --allow-unverified"
      ],
      [
        "Force-overwrite locally modified files",
        "solidiom add button --deliverable component --force"
      ],
      [
        "Preview pending source-install changes",
        "solidiom add button --deliverable component --diff"
      ]
    ]
  });
  primitive = Option4.String({ required: true });
  mode = Option4.String("--mode", { description: "Install mode (package or source)" });
  registry = Option4.String("--registry", {
    description: "Custom registry URL for package resolution"
  });
  noNetwork = Option4.Boolean("--no-network", false, {
    description: "Use only cached/local registry data (no network fetch)"
  });
  deliverable = Option4.String("--deliverable", {
    description: "Product-layer deliverable to add (primitive, component, block, template, theme)"
  });
  styling = Option4.String("--styling", {
    description: "Styling profile to add (css, tailwind, unocss)"
  });
  packageManager = Option4.String("--package-manager", {
    description: "Package manager to use (npm, pnpm, yarn, bun) \u2014 auto-detected if omitted"
  });
  install = Option4.Boolean("--install", false, {
    description: "Actually run the install command instead of only printing it"
  });
  allowUnverified = Option4.Boolean("--allow-unverified", false, {
    description: "Proceed with a source install even if byte-level verification against the registry manifest fails"
  });
  force = Option4.Boolean("--force", false, {
    description: "Overwrite files that were locally modified since their last source install"
  });
  diff = Option4.Boolean("--diff", false, {
    description: "Print a unified diff of pending source-install changes and exit without writing"
  });
  dryRun = Option4.Boolean("--dry-run", false, {
    description: "Show what would be done without writing"
  });
  json = Option4.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = await runAdd({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode,
      registry: this.registry,
      noNetwork: this.noNetwork,
      deliverable: this.deliverable,
      styling: this.styling,
      packageManager: this.packageManager,
      install: this.install,
      dryRun: this.dryRun,
      allowUnverified: this.allowUnverified,
      force: this.force,
      diff: this.diff
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return result.installRun && result.installRun.code !== 0 ? result.installRun.code : 0;
    }
    if (result.blocked) {
      this.context.stderr.write(pc4.red("Blocked by policy violations:\n"));
      for (const v of result.plan.violations) {
        this.context.stderr.write(pc4.red(`  \u2717 ${v}
`));
      }
      return 1;
    }
    if (result.installRun) {
      if (result.installRun.stdout) this.context.stdout.write(result.installRun.stdout);
      if (result.installRun.stderr) this.context.stderr.write(result.installRun.stderr);
      if (result.installRun.code !== 0) {
        this.context.stderr.write(
          pc4.red(`
\u2717 ${result.installCommand} exited with code ${result.installRun.code}
`)
        );
        return result.installRun.code;
      }
      this.context.stdout.write(pc4.green(`
\u2713 ${result.installCommand}
`));
    } else if (result.installCommand) {
      this.context.stdout.write(pc4.green(result.installCommand) + "\n");
    } else if (result.sourceResult) {
      const sr = result.sourceResult;
      if (sr.conflicts) {
        const diffEntries = sr.conflicts.entries.filter(
          (e) => e.classification === "modified-by-user" || e.classification === "overwrite"
        );
        if (this.diff) {
          this.context.stdout.write(pc4.bold("Pending source-install changes:\n\n"));
          for (const entry of diffEntries) {
            this.context.stdout.write(pc4.dim(`  ${entry.path} (${entry.classification})
`));
            if (entry.diff) this.context.stdout.write(entry.diff + "\n");
          }
          return 0;
        }
        if (sr.conflicts.hasBlockingConflicts) {
          this.context.stderr.write(
            pc4.red("Blocked \u2014 locally modified files would be overwritten:\n")
          );
          for (const entry of sr.conflicts.entries) {
            if (entry.classification !== "modified-by-user") continue;
            this.context.stderr.write(pc4.red(`  \u2717 ${entry.path}
`));
            if (entry.diff) this.context.stderr.write(pc4.dim(entry.diff));
          }
          this.context.stderr.write(
            pc4.yellow(
              `
Use --force to overwrite locally modified files, or run \`solidiom diff ${this.primitive}\` to review changes first.
`
            )
          );
          return 1;
        }
      }
      if (this.allowUnverified && !sr.verified && sr.filesWritten.length > 0) {
        this.context.stdout.write(
          pc4.red("\u26A0 Installed without verification \u2014 provenance recorded as 'unverified'\n")
        );
      }
      this.context.stdout.write(pc4.green(`Installed ${sr.filesWritten.length} source files
`));
      for (const f of sr.filesWritten) {
        this.context.stdout.write(`  ${f}
`);
      }
    }
    return 0;
  }
};

// src/commands/create.ts
import { Command as Command5, Option as Option5 } from "clipanion";
import { existsSync as existsSync11, mkdirSync as mkdirSync7, readdirSync as readdirSync3, rmSync as rmSync2 } from "fs";
import { homedir } from "os";
import { dirname as dirname7, join as join11, resolve, sep } from "path";
import * as clack from "@clack/prompts";

// src/create/materialize.ts
import { existsSync as existsSync10, mkdirSync as mkdirSync5, readFileSync as readFileSync10, readdirSync as readdirSync2, statSync as statSync2, writeFileSync as writeFileSync5 } from "fs";
import { dirname as dirname6, join as join9, relative as relative2 } from "path";
import { fileURLToPath } from "url";
var EXCLUDED_FILES = /* @__PURE__ */ new Set(["template.json", ".DS_Store", "routeTree.gen.ts"]);
var EXCLUDED_DIRS = /* @__PURE__ */ new Set(["node_modules", "dist", ".git", ".turbo", ".nx"]);
var LOCKFILE_NAMES = /* @__PURE__ */ new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  "bun.lock"
]);
var ALLOWED_VARIABLES = /* @__PURE__ */ new Set(["projectName"]);
function resolveTemplateSource(templateName) {
  const moduleDir = dirname6(fileURLToPath(import.meta.url));
  const candidates = [
    // Published layout: templates copied alongside this file by prepack.
    join9(moduleDir, "templates", templateName),
    // Published layout variant: templates copied as a sibling of dist/.
    join9(moduleDir, "..", "templates", templateName),
    // Monorepo-relative dev/test fallback, bundled-dist depth:
    // packages/cli/dist/index.js -> ../../../templates/<name>
    join9(moduleDir, "..", "..", "..", "templates", templateName),
    // Monorepo-relative dev/test fallback, unbundled-src depth:
    // packages/cli/src/create/materialize.ts -> ../../../../templates/<name>
    join9(moduleDir, "..", "..", "..", "..", "templates", templateName)
  ];
  for (const candidate of candidates) {
    if (existsSync10(join9(candidate, "template.json"))) {
      return candidate;
    }
  }
  return null;
}
function collectFiles(dir) {
  const results = [];
  function walk(current) {
    for (const entry of readdirSync2(current)) {
      const full = join9(current, entry);
      if (statSync2(full).isDirectory()) {
        if (EXCLUDED_DIRS.has(entry)) continue;
        walk(full);
      } else {
        results.push(relative2(dir, full).split("\\").join("/"));
      }
    }
  }
  if (existsSync10(dir)) walk(dir);
  return results;
}
function substitute(content, variables) {
  return content.replace(/\{\{(\w+)\}\}/g, (full, name) => {
    if (ALLOWED_VARIABLES.has(name) && Object.prototype.hasOwnProperty.call(variables, name)) {
      return variables[name];
    }
    return full;
  });
}
function resolveMonorepoPackageVersion(packageName, searchFrom) {
  const shortName = packageName.replace(/^@solidiom\//, "");
  let dir = searchFrom;
  for (let i = 0; i < 10; i++) {
    const candidate = join9(dir, "packages", shortName, "package.json");
    if (existsSync10(candidate)) {
      try {
        const data = JSON.parse(readFileSync10(candidate, "utf8"));
        if (data.version) return data.version;
      } catch {
      }
    }
    const parent = dirname6(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
function readPnpmWorkspaceMaps(searchFrom) {
  let dir = searchFrom;
  for (let i = 0; i < 10; i++) {
    const candidate = join9(dir, "pnpm-workspace.yaml");
    if (existsSync10(candidate)) {
      try {
        const content = readFileSync10(candidate, "utf8");
        return {
          overrides: readYamlFlatMap(content, "overrides"),
          catalog: readYamlFlatMap(content, "catalog")
        };
      } catch {
        return null;
      }
    }
    const parent = dirname6(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
function readYamlFlatMap(content, key) {
  const lines = content.split("\n");
  const map = {};
  const start = lines.findIndex((l) => new RegExp(`^${key}:\\s*$`).test(l));
  if (start === -1) return map;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\S/.test(line)) break;
    const match = line.match(/^\s*["']?([\w@/.-]+)["']?:\s*["']?([^"'\s]+)["']?\s*$/);
    if (match) map[match[1]] = match[2];
  }
  return map;
}
function resolveCatalogVersion(packageName, searchFrom) {
  const maps = readPnpmWorkspaceMaps(searchFrom);
  if (!maps) return null;
  return maps.overrides[packageName] ?? maps.catalog[packageName] ?? null;
}
function applyDependencyOverrides(data, overrides) {
  if (Object.keys(overrides).length === 0) return false;
  let changed = false;
  const fillGaps = (existing) => {
    const declared = existing && typeof existing === "object" ? existing : {};
    return { ...overrides, ...declared };
  };
  const setIfChanged = (target, key) => {
    const next = fillGaps(target[key]);
    if (JSON.stringify(target[key]) !== JSON.stringify(next)) {
      target[key] = next;
      changed = true;
    }
  };
  setIfChanged(data, "overrides");
  setIfChanged(data, "resolutions");
  const pnpmSection = data["pnpm"] && typeof data["pnpm"] === "object" ? data["pnpm"] : {};
  setIfChanged(pnpmSection, "overrides");
  data["pnpm"] = pnpmSection;
  return changed;
}
function rewritePackageJsonForStandalone(packageJsonContent, searchFrom, warnings) {
  let data;
  try {
    data = JSON.parse(packageJsonContent);
  } catch {
    return packageJsonContent;
  }
  const depFields = ["dependencies", "devDependencies", "peerDependencies"];
  let changed = false;
  for (const field of depFields) {
    const deps = data[field];
    if (!deps) continue;
    for (const [name, spec] of Object.entries(deps)) {
      if (spec.startsWith("workspace:")) {
        const resolved = resolveMonorepoPackageVersion(name, searchFrom);
        if (resolved) {
          deps[name] = resolved;
          changed = true;
        } else {
          warnings.push(
            `Could not resolve a real version for "${name}" (${spec}) \u2014 no monorepo packages/ directory found from the template source. Left as "${spec}"; this must be resolved before the generated project can install cleanly outside this monorepo.`
          );
        }
        continue;
      }
      if (spec.startsWith("catalog:")) {
        const resolved = resolveCatalogVersion(name, searchFrom);
        if (resolved) {
          deps[name] = resolved;
          changed = true;
        } else {
          warnings.push(
            `Could not resolve a real version for "${name}" (${spec}) \u2014 no pnpm-workspace.yaml catalog entry found from the template source. Left as "${spec}"; this specifier is not understood by npm/yarn/bun and must be resolved before the generated project can install under any manager other than pnpm.`
          );
        }
      }
    }
  }
  const workspaceMaps = readPnpmWorkspaceMaps(searchFrom);
  if (workspaceMaps && applyDependencyOverrides(data, workspaceMaps.overrides)) {
    changed = true;
  }
  return changed ? JSON.stringify(data, null, 2) + "\n" : packageJsonContent;
}
function stripMonorepoTsconfig(tsconfigContent) {
  let data;
  try {
    data = JSON.parse(tsconfigContent);
  } catch {
    return tsconfigContent;
  }
  const extendsValue = data["extends"];
  const isMonorepoRelativeExtends = typeof extendsValue === "string" && (extendsValue.startsWith("../") || extendsValue.startsWith("..\\"));
  if (isMonorepoRelativeExtends) {
    delete data["extends"];
    const existingOptions = data["compilerOptions"] ?? {};
    data["compilerOptions"] = {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      ...existingOptions
    };
  }
  if (Array.isArray(data["references"])) {
    data["references"] = data["references"].filter(
      (ref) => typeof ref.path !== "string" || !ref.path.startsWith("..")
    );
    if (data["references"].length === 0) {
      delete data["references"];
    }
  }
  return JSON.stringify(data, null, 2) + "\n";
}
function materialize(options) {
  const { templateName, destination, projectName, variables = {}, templateSourceDir } = options;
  const sourceDir = templateSourceDir ?? resolveTemplateSource(templateName);
  if (!sourceDir || !existsSync10(join9(sourceDir, "template.json"))) {
    return {
      filesWritten: [],
      errors: [
        `Could not resolve source directory for template "${templateName}" \u2014 checked the published-CLI layout and the monorepo-relative dev fallback.`
      ]
    };
  }
  const allVariables = { projectName, ...variables };
  const relativeFiles = collectFiles(sourceDir);
  const filesWritten = [];
  const errors = [];
  const warnings = [];
  for (const relPath of relativeFiles) {
    const baseName = relPath.split("/").pop() ?? relPath;
    if (EXCLUDED_FILES.has(baseName)) continue;
    if (LOCKFILE_NAMES.has(baseName)) {
      errors.push(
        `Template "${templateName}" contains a foreign lockfile ("${relPath}") \u2014 refusing to copy it. Templates must not ship a lockfile; the install step produces the correct one for the chosen package manager.`
      );
      continue;
    }
    const sourcePath = join9(sourceDir, relPath);
    const targetPath = join9(destination, relPath);
    const rawContent = readFileSync10(sourcePath);
    const isLikelyText = /\.(json|ts|tsx|js|jsx|html|css|md|mdx|txt|yaml|yml)$/.test(baseName);
    let outputBuffer = rawContent;
    if (isLikelyText) {
      let text2 = rawContent.toString("utf8");
      text2 = substitute(text2, allVariables);
      if (baseName === "package.json") {
        text2 = rewritePackageJsonForStandalone(text2, sourceDir, warnings);
      }
      if (baseName === "tsconfig.json") {
        text2 = stripMonorepoTsconfig(text2);
      }
      outputBuffer = text2;
    }
    mkdirSync5(dirname6(targetPath), { recursive: true });
    writeFileSync5(targetPath, outputBuffer);
    filesWritten.push(relative2(destination, targetPath).split("\\").join("/"));
  }
  const allErrors = [...errors, ...warnings];
  return {
    filesWritten,
    ...allErrors.length > 0 ? { errors: allErrors } : {}
  };
}

// src/create/config-gen.ts
import { mkdirSync as mkdirSync6, writeFileSync as writeFileSync6 } from "fs";
import { join as join10 } from "path";
function generateProjectConfig(options) {
  const { destination, styling } = options;
  const solidiomDir = join10(destination, ".solidiom");
  const configPath = join10(solidiomDir, "config.json");
  const config = {
    ...ConfigSchema.parse({}),
    ...styling ? { stylingProfile: styling } : {}
  };
  mkdirSync6(solidiomDir, { recursive: true });
  writeFileSync6(configPath, JSON.stringify(config, null, 2) + "\n");
  return { filesWritten: [join10(".solidiom", "config.json")] };
}

// src/commands/create.ts
import pc5 from "picocolors";
var STYLING_PROFILES2 = ["css", "tailwind", "unocss"];
function createCleanupJournal() {
  const created = [];
  return {
    /** Records a directory this run created, in creation order. */
    record(path) {
      created.push(path);
    },
    /** Returns a snapshot of recorded paths (for inspection/testing). */
    entries() {
      return [...created];
    },
    /** Removes every recorded path in reverse (most-recently-created-first) order. */
    cleanup() {
      for (let i = created.length - 1; i >= 0; i--) {
        const path = created[i];
        rmSync2(path, { recursive: true, force: true });
      }
      created.length = 0;
    }
  };
}
function isValidPackageName(name) {
  if (typeof name !== "string" || name.length === 0) return false;
  if (name.length > 214) return false;
  if (name !== name.toLowerCase()) return false;
  let unscoped = name;
  if (name.startsWith("@")) {
    const slashIndex = name.indexOf("/");
    if (slashIndex === -1) return false;
    const scope = name.slice(1, slashIndex);
    unscoped = name.slice(slashIndex + 1);
    if (scope.length === 0) return false;
    if (!/^[a-z0-9-._~]+$/.test(scope)) return false;
    if (scope.startsWith(".") || scope.startsWith("_")) return false;
  }
  if (unscoped.length === 0) return false;
  if (!/^[a-z0-9-._~]+$/.test(unscoped)) return false;
  if (unscoped.startsWith(".") || unscoped.startsWith("_")) return false;
  return true;
}
function findMonorepoRoot(from, maxDepth = 20) {
  let dir = from;
  for (let i = 0; i < maxDepth; i++) {
    if (existsSync11(join11(dir, "pnpm-workspace.yaml")) || existsSync11(join11(dir, ".git"))) {
      return dir;
    }
    const parent = dirname7(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
function isInside(parent, child) {
  if (child === parent) return true;
  const parentWithSep = parent.endsWith(sep) ? parent : parent + sep;
  return child.startsWith(parentWithSep);
}
function validateDestination(cwd, name, force) {
  const errors = [];
  const destination = resolve(cwd, name);
  const resolvedCwd = resolve(cwd);
  const home = resolve(homedir());
  const root = resolve("/");
  const monorepoRoot = findMonorepoRoot(cwd);
  if (!isInside(resolvedCwd, destination)) {
    errors.push(
      `Destination "${destination}" escapes the current working directory "${resolvedCwd}" \u2014 refusing to write outside cwd.`
    );
  }
  if (destination === home) {
    errors.push(
      `Destination "${destination}" is the user's home directory \u2014 refusing to scaffold there.`
    );
  }
  if (destination === root) {
    errors.push(`Destination "${destination}" is the filesystem root \u2014 refusing to scaffold there.`);
  }
  if (monorepoRoot && destination === resolve(monorepoRoot)) {
    errors.push(`Destination "${destination}" is the monorepo root \u2014 refusing to scaffold there.`);
  }
  if (existsSync11(destination)) {
    try {
      const entries = readdirSync3(destination);
      if (entries.length > 0 && !force) {
        errors.push(
          `Destination "${destination}" already exists and is not empty \u2014 pass --force to scaffold into it anyway.`
        );
      }
    } catch {
      errors.push(`Destination "${destination}" exists but could not be read.`);
    }
  }
  return { destination, errors };
}
async function promptForMissing(options) {
  const isTTY = options.isTTY ?? process.stdin.isTTY ?? false;
  let template = options.template;
  let name = options.name;
  let styling = options.styling;
  if (options.yes || !isTTY) {
    if (!template || !name) return null;
    return { template, name, styling };
  }
  clack.intro(pc5.bold("solidiom create"));
  if (!template) {
    const result = await clack.text({
      message: "Which template would you like to use?"
    });
    if (clack.isCancel(result)) return "cancelled";
    template = result;
  }
  if (!name) {
    const result = await clack.text({
      message: "What is the name of your project?"
    });
    if (clack.isCancel(result)) return "cancelled";
    name = result;
  }
  if (!styling) {
    const result = await clack.select({
      message: "Which styling profile would you like?",
      options: STYLING_PROFILES2.map((value) => ({ value, label: value }))
    });
    if (clack.isCancel(result)) return "cancelled";
    styling = result;
  }
  clack.outro(pc5.green("Configuration collected."));
  return { template, name, styling };
}
async function runCreate(options) {
  const { cwd, yes = false, force = false, install: install2 = true } = options;
  const journal = createCleanupJournal();
  if (yes) {
    const missing = [];
    if (!options.template) missing.push("--template");
    if (!options.name) missing.push("--name");
    if (missing.length > 0) {
      return {
        destination: resolve(cwd, options.name ?? ""),
        created: false,
        errors: [`--yes was passed but required flag(s) missing: ${missing.join(", ")}`]
      };
    }
  }
  if (options.packageManager && !isPackageManagerName(options.packageManager)) {
    return {
      destination: resolve(cwd, options.name ?? ""),
      created: false,
      errors: [
        `Unknown package manager "${options.packageManager}" \u2014 expected one of: npm, pnpm, yarn, bun`
      ]
    };
  }
  if (options.styling && !STYLING_PROFILES2.includes(options.styling)) {
    return {
      destination: resolve(cwd, options.name ?? ""),
      created: false,
      errors: [
        `Unknown styling profile "${options.styling}" \u2014 expected one of: ${STYLING_PROFILES2.join(", ")}`
      ]
    };
  }
  const prompted = await promptForMissing(options);
  if (prompted === "cancelled") {
    journal.cleanup();
    return { destination: resolve(cwd, options.name ?? ""), created: false, cancelled: true };
  }
  if (!prompted) {
    return {
      destination: options.name ? resolve(cwd, options.name) : cwd,
      created: false,
      errors: ["Missing required value(s): --template and/or --name (no TTY available to prompt)."]
    };
  }
  const { template, name } = prompted;
  const nameErrors = [];
  if (!isValidPackageName(name)) {
    nameErrors.push(
      `"${name}" is not a valid npm package name \u2014 must be lowercase, may be scoped (@scope/name), use only [a-z0-9-._~], not start with "." or "_", and be at most 214 characters.`
    );
  }
  const { destination, errors: destinationErrors } = validateDestination(cwd, name, force);
  const errors = [...destinationErrors, ...nameErrors];
  if (errors.length > 0) {
    return { destination, created: false, errors };
  }
  let sigintReceived = false;
  const onSigint = () => {
    sigintReceived = true;
    journal.cleanup();
  };
  process.once("SIGINT", onSigint);
  try {
    const destinationExisted = existsSync11(destination);
    if (!destinationExisted) {
      mkdirSync7(destination, { recursive: true });
      journal.record(destination);
    }
    if (sigintReceived) {
      return { destination, created: false, cancelled: true };
    }
    const materializeResult = materialize({
      templateName: template,
      destination,
      projectName: name,
      ...options.templatesDir ? { templateSourceDir: join11(options.templatesDir, template) } : {}
    });
    if (materializeResult.errors && materializeResult.errors.length > 0) {
      journal.cleanup();
      return { destination, created: false, errors: materializeResult.errors };
    }
    if (sigintReceived) {
      journal.cleanup();
      return { destination, created: false, cancelled: true };
    }
    generateProjectConfig({
      destination,
      projectName: name,
      ...prompted.styling ? { styling: prompted.styling } : {},
      ...options.packageManager ? { packageManager: options.packageManager } : {}
    });
    if (sigintReceived) {
      journal.cleanup();
      return { destination, created: false, cancelled: true };
    }
    if (install2) {
      const detected = detectPackageManager({
        cwd: destination,
        ...options.packageManager ? { override: options.packageManager } : {}
      });
      const installResult = await runPackageManager({
        command: install(detected),
        cwd: destination
      });
      if (installResult.code !== 0) {
        journal.cleanup();
        return {
          destination,
          created: false,
          errors: [
            `Dependency install failed (exit code ${installResult.code}) \u2014 rolled back scaffolded files.`,
            ...installResult.stderr ? [installResult.stderr.trim()] : []
          ]
        };
      }
    }
    return { destination, created: true };
  } finally {
    process.removeListener("SIGINT", onSigint);
  }
}
var CreateCommand = class extends Command5 {
  static paths = [["create"]];
  static usage = Command5.Usage({
    description: "Scaffold a new project from a template",
    examples: [
      [
        "Create a project non-interactively",
        "solidiom create my-app --template vite-solid-router --yes"
      ],
      [
        "Create with a specific styling profile",
        "solidiom create my-app --template vite-solid-router --styling tailwind --yes"
      ],
      [
        "Create without running the install step",
        "solidiom create my-app --template vite-solid-router --yes --no-install"
      ],
      [
        "Force scaffolding into a non-empty directory",
        "solidiom create my-app --template vite-solid-router --yes --force"
      ]
    ]
  });
  name = Option5.String({ required: true });
  template = Option5.String("--template", { description: "Template to scaffold from" });
  packageManager = Option5.String("--package-manager", {
    description: "Package manager to use (npm, pnpm, yarn, bun) \u2014 auto-detected if omitted"
  });
  styling = Option5.String("--styling", {
    description: "Styling profile to use (css, tailwind, unocss)"
  });
  noInstall = Option5.Boolean("--no-install", false, {
    description: "Skip running the package manager install step"
  });
  yes = Option5.Boolean("--yes", false, {
    description: "Skip all prompts; fail explicitly if a required value is missing"
  });
  force = Option5.Boolean("--force", false, {
    description: "Allow scaffolding into a non-empty destination directory"
  });
  json = Option5.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = await runCreate({
      cwd: process.cwd(),
      template: this.template,
      name: this.name,
      packageManager: this.packageManager,
      styling: this.styling,
      install: !this.noInstall,
      yes: this.yes,
      force: this.force
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return result.created ? 0 : 1;
    }
    if (result.cancelled) {
      this.context.stdout.write(pc5.yellow("Create cancelled \u2014 no files left behind.\n"));
      return 1;
    }
    if (result.errors && result.errors.length > 0) {
      this.context.stderr.write(pc5.red("Cannot create project:\n"));
      for (const e of result.errors) {
        this.context.stderr.write(pc5.red(`  \u2717 ${e}
`));
      }
      return 1;
    }
    this.context.stdout.write(pc5.green(`Created ${result.destination}
`));
    return 0;
  }
};

// src/commands/inspect.ts
import { Command as Command6, Option as Option6 } from "clipanion";
import { existsSync as existsSync12 } from "fs";
import { join as join12 } from "path";
import pc6 from "picocolors";
function resolveManifestPath2(primitive, cwd, registryOverride) {
  const candidates = [
    registryOverride ? join12(registryOverride, `${primitive}.json`) : null,
    process.env["SOLIDIOM_REGISTRY_PATH"] ? join12(process.env["SOLIDIOM_REGISTRY_PATH"], `${primitive}.json`) : null,
    join12(cwd, "..", "..", "registry", `${primitive}.json`),
    join12(cwd, "node_modules", "@solidiom", "registry", `${primitive}.json`)
  ].filter(Boolean);
  return candidates.find((path) => existsSync12(path)) ?? null;
}
function runInspect(options) {
  const { cwd, subcommand, primitive, registry: registryOverride } = options;
  const lock = readLock(cwd);
  const entries = Object.values(lock.installed).filter(
    (e) => !primitive || e.primitive === primitive
  );
  if (subcommand === "manifest" || subcommand === "explain") {
    if (!primitive) {
      return { primitive, mode: subcommand, entries };
    }
    const manifestPath = resolveManifestPath2(primitive, cwd, registryOverride);
    if (!manifestPath) {
      return { primitive, mode: subcommand, entries };
    }
    try {
      const manifest = readRegistryManifest(manifestPath);
      return { primitive, mode: subcommand, entries, manifest };
    } catch (err) {
      const reason = err instanceof RegistrySchemaError ? err.message : String(err);
      return { primitive, mode: subcommand, entries, manifestError: reason };
    }
  }
  return { primitive, mode: subcommand, entries };
}
var InspectCommand = class extends Command6 {
  static paths = [["inspect"]];
  static usage = Command6.Usage({
    description: "Inspect installed primitive source, manifest, or provenance",
    examples: [
      ["Show installed source files", "solidiom inspect source"],
      ["Show primitive manifest", "solidiom inspect manifest dialog"],
      ["Show file provenance", "solidiom inspect provenance"],
      ["Show provenance for one primitive", "solidiom inspect provenance dialog"],
      ["List all installed files", "solidiom inspect files"]
    ]
  });
  subcommand = Option6.String({ required: true });
  primitive = Option6.String({ required: false });
  registry = Option6.String("--registry", {
    description: "Custom registry URL for manifest resolution"
  });
  json = Option6.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runInspect({
      cwd: process.cwd(),
      subcommand: this.subcommand,
      primitive: this.primitive,
      registry: this.registry
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return result.manifestError ? 1 : 0;
    }
    switch (this.subcommand) {
      case "source":
      case "files":
        if (result.entries.length === 0) {
          this.context.stdout.write("No source-installed primitives found.\n");
        } else {
          this.context.stdout.write(pc6.bold("Installed source files:\n"));
          for (const e of result.entries) {
            const status = e.detached ? pc6.yellow(" [detached]") : "";
            this.context.stdout.write(`  ${e.path} (${e.primitive}@${e.version})${status}
`);
          }
        }
        break;
      case "manifest":
        if (result.manifestError) {
          this.context.stderr.write(
            pc6.red(`Manifest for ${this.primitive} failed schema verification:
`)
          );
          this.context.stderr.write(pc6.red(`  \u2717 ${result.manifestError}
`));
          return 1;
        }
        if (result.manifest) {
          this.context.stdout.write(JSON.stringify(result.manifest, null, 2) + "\n");
        } else {
          this.context.stderr.write(pc6.red(`No manifest found for ${this.primitive}
`));
          return 1;
        }
        break;
      case "explain":
        this.context.stdout.write(pc6.bold(`Primitive: ${this.primitive ?? "(all)"}
`));
        this.context.stdout.write(`Mode: source
`);
        this.context.stdout.write(`Files: ${result.entries.length}
`);
        this.context.stdout.write(`Detached: ${result.entries.filter((e) => e.detached).length}
`);
        if (result.manifestError) {
          this.context.stderr.write(
            pc6.red(`
Manifest failed schema verification: ${result.manifestError}
`)
          );
        } else if (result.manifest) {
          const m = result.manifest;
          this.context.stdout.write(`
Deliverables: ${m.deliverables.join(", ")}
`);
          this.context.stdout.write(
            `Styling outputs: ${m.styling.outputs.length > 0 ? m.styling.outputs.join(", ") : "none"}
`
          );
          this.context.stdout.write(
            `Theme compatible: ${m.styling.themeCompatible.length > 0 ? m.styling.themeCompatible.join(", ") : "none"}
`
          );
          this.context.stdout.write(`Documentation: ${m.documentation.status}
`);
          for (const [locale, info] of Object.entries(m.documentation.locales)) {
            this.context.stdout.write(`  ${locale}: ${info.status}
`);
          }
        }
        break;
      case "provenance":
        if (result.entries.length === 0) {
          this.context.stdout.write(
            this.primitive ? `No installed files found for primitive "${this.primitive}".
` : "No source-installed primitives found.\n"
          );
          break;
        }
        for (const e of result.entries) {
          const provenanceLabel = e.provenance === "unverified" ? pc6.yellow(e.provenance) : pc6.green(e.provenance);
          this.context.stdout.write(`${e.path}
`);
          this.context.stdout.write(`  primitive: ${e.primitive}
`);
          this.context.stdout.write(`  version: ${e.version}
`);
          this.context.stdout.write(`  digest: ${e.digest.slice(0, 12)}\u2026
`);
          this.context.stdout.write(`  manifestFilesHash: ${e.manifestFilesHash || "(none)"}
`);
          if (e.signatureKeyId) {
            this.context.stdout.write(`  signatureKeyId: ${e.signatureKeyId}
`);
          }
          this.context.stdout.write(`  verifiedAt: ${e.verifiedAt || "(unknown)"}
`);
          this.context.stdout.write(`  provenance: ${provenanceLabel}
`);
          this.context.stdout.write(`  detached: ${e.detached ?? false}
`);
        }
        {
          const unverifiedCount = result.entries.filter((e) => e.provenance === "unverified").length;
          if (unverifiedCount > 0) {
            this.context.stdout.write(
              pc6.yellow(
                `
\u26A0 ${unverifiedCount} entr${unverifiedCount === 1 ? "y" : "ies"} recorded as unverified
`
              )
            );
          }
        }
        break;
      default:
        this.context.stderr.write(`Unknown subcommand: ${this.subcommand}
`);
        this.context.stderr.write("Available: source, manifest, explain, files, provenance\n");
        return 1;
    }
    return 0;
  }
};

// src/commands/diff.ts
import { Command as Command7, Option as Option7 } from "clipanion";
import { existsSync as existsSync13, readFileSync as readFileSync11 } from "fs";
import { join as join13 } from "path";
import pc7 from "picocolors";
function runDiff(options) {
  const { cwd, primitive } = options;
  const lock = readLock(cwd);
  const entries = [];
  for (const [path, lockEntry] of Object.entries(lock.installed)) {
    if (primitive && lockEntry.primitive !== primitive) continue;
    const fullPath = join13(cwd, path);
    if (!existsSync13(fullPath)) {
      entries.push({ path, primitive: lockEntry.primitive, status: "deleted" });
    } else {
      const currentContent = readFileSync11(fullPath, "utf8");
      const currentDigest = computeDigest(currentContent);
      const status = currentDigest === lockEntry.digest ? "unchanged" : "modified";
      entries.push({ path, primitive: lockEntry.primitive, status });
    }
  }
  return { entries, hasChanges: entries.some((e) => e.status !== "unchanged") };
}
var DiffCommand = class extends Command7 {
  static paths = [["diff"]];
  static usage = Command7.Usage({
    description: "Show changes between installed source and lockfile digests",
    examples: [
      ["Diff all installed primitives", "solidiom diff"],
      ["Diff specific primitive", "solidiom diff --primitive dialog"]
    ]
  });
  primitive = Option7.String("--primitive", { description: "Filter by primitive name" });
  json = Option7.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runDiff({ cwd: process.cwd(), primitive: this.primitive });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (!result.hasChanges) {
      this.context.stdout.write(pc7.green("No local modifications.\n"));
      return 0;
    }
    for (const entry of result.entries) {
      switch (entry.status) {
        case "modified":
          this.context.stdout.write(pc7.yellow(`  M ${entry.path}
`));
          break;
        case "deleted":
          this.context.stdout.write(pc7.red(`  D ${entry.path}
`));
          break;
        case "new":
          this.context.stdout.write(pc7.green(`  A ${entry.path}
`));
          break;
      }
    }
    return 0;
  }
};

// src/commands/detach.ts
import { Command as Command8, Option as Option8 } from "clipanion";
import pc8 from "picocolors";
function runDetach(options) {
  const { cwd, primitive } = options;
  const lock = readLock(cwd);
  const detached = [];
  const alreadyDetached = [];
  for (const [path, entry] of Object.entries(lock.installed)) {
    if (entry.primitive !== primitive) continue;
    if (entry.detached) {
      alreadyDetached.push(path);
    } else {
      entry.detached = true;
      detached.push(path);
    }
  }
  if (detached.length > 0) {
    writeLock(cwd, lock);
  }
  return { detached, alreadyDetached };
}
var DetachCommand = class extends Command8 {
  static paths = [["detach"]];
  static usage = Command8.Usage({
    description: "Detach a source-installed primitive from upstream updates",
    examples: [["Detach dialog", "solidiom detach dialog"]]
  });
  primitive = Option8.String({ required: true });
  json = Option8.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runDetach({ cwd: process.cwd(), primitive: this.primitive });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (result.detached.length === 0 && result.alreadyDetached.length === 0) {
      this.context.stderr.write(
        pc8.yellow(`No source-installed files found for ${this.primitive}
`)
      );
      return 1;
    }
    for (const path of result.detached) {
      this.context.stdout.write(pc8.green(`  Detached: ${path}
`));
    }
    for (const path of result.alreadyDetached) {
      this.context.stdout.write(`  Already detached: ${path}
`);
    }
    this.context.stdout.write(
      pc8.bold(
        `
${result.detached.length} files detached. They will be skipped by 'solidiom update'.
`
      )
    );
    return 0;
  }
};

// src/commands/update.ts
import { Command as Command9, Option as Option9 } from "clipanion";
import { existsSync as existsSync14, readFileSync as readFileSync12, writeFileSync as writeFileSync7, mkdirSync as mkdirSync8 } from "fs";
import { join as join14, dirname as dirname8, extname } from "path";

// src/source-install/ast-transform.ts
import { Project } from "ts-morph";
function rewriteImportsAst(options) {
  const { content, filePath, runtimeDir, fileName = "source.tsx" } = options;
  const project = createInMemoryProject();
  const sourceFile = project.createSourceFile(fileName, content, { overwrite: true });
  const rewritten = [];
  const imports = sourceFile.getImportDeclarations();
  for (const imp of imports) {
    const rewriteResult = rewriteSingleImport(imp, filePath, runtimeDir);
    if (rewriteResult) {
      rewritten.push(rewriteResult);
    }
  }
  const exports = sourceFile.getExportDeclarations();
  for (const exp of exports) {
    const moduleSpecifier = exp.getModuleSpecifierValue();
    if (moduleSpecifier && moduleSpecifier.startsWith("@solidiom/runtime")) {
      const newPath = computeRelativeRuntimePath(moduleSpecifier, filePath, runtimeDir);
      exp.setModuleSpecifier(newPath);
      rewritten.push(moduleSpecifier);
    }
  }
  const changed = rewritten.length > 0;
  const code = changed ? sourceFile.getFullText() : content;
  return { code, changed, rewritten };
}
function rewriteSingleImport(imp, filePath, runtimeDir) {
  const moduleSpecifier = imp.getModuleSpecifierValue();
  if (!moduleSpecifier.startsWith("@solidiom/runtime")) return null;
  const newPath = computeRelativeRuntimePath(moduleSpecifier, filePath, runtimeDir);
  imp.setModuleSpecifier(newPath);
  return moduleSpecifier;
}
function computeRelativeRuntimePath(specifier, filePath, runtimeDir) {
  const { relative: relative3, dirname: dirname9 } = __require("path");
  const fileDir = dirname9(filePath);
  let relToRuntime = relative3(fileDir, runtimeDir).replace(/\\/g, "/");
  if (!relToRuntime.startsWith(".")) relToRuntime = `./${relToRuntime}`;
  const subpath = specifier.replace("@solidiom/runtime", "");
  const target = subpath ? `${relToRuntime}${subpath}` : `${relToRuntime}/index`;
  return target;
}
function createInMemoryProject() {
  return new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      target: 99,
      // ESNext
      module: 99,
      // ESNext
      jsx: 1,
      // Preserve
      strict: true,
      skipLibCheck: true
    }
  });
}

// src/commands/update.ts
import pc9 from "picocolors";
function runUpdate(options) {
  const { cwd, primitive, dryRun = false } = options;
  const lock = readLock(cwd);
  const configPath = join14(cwd, ".solidiom", "config.json");
  const config = existsSync14(configPath) ? ConfigSchema.parse(JSON.parse(readFileSync12(configPath, "utf8"))) : ConfigSchema.parse({});
  const runtimeDir = join14(cwd, config.runtimeDir);
  const upstreamDir = resolvePrimitiveSource2(primitive, cwd);
  if (!upstreamDir) {
    return { entries: [], conflicts: [], updated: 0, merged: 0 };
  }
  const entries = [];
  const conflicts = [];
  let updated = 0;
  let merged = 0;
  for (const [path, lockEntry] of Object.entries(lock.installed)) {
    if (lockEntry.primitive !== primitive) continue;
    if (lockEntry.detached) {
      entries.push({ path, status: "skipped-detached" });
      continue;
    }
    const fullPath = join14(cwd, path);
    if (!existsSync14(fullPath)) {
      entries.push({ path, status: "skipped-deleted" });
      continue;
    }
    const relInPrimitive = path.replace(new RegExp(`.*${escapeRegex(primitive)}/`), "");
    const upstreamPath = join14(upstreamDir, relInPrimitive);
    if (!existsSync14(upstreamPath)) {
      entries.push({ path, status: "skipped-unchanged" });
      continue;
    }
    const upstreamRaw = readFileSync12(upstreamPath, "utf8");
    const upstreamDigest = computeDigest(upstreamRaw);
    if (upstreamDigest === lockEntry.digest) {
      entries.push({ path, status: "skipped-unchanged" });
      continue;
    }
    const upstreamRewritten = isComplexFile(fullPath) ? rewriteWithAst(upstreamRaw, fullPath, runtimeDir) : rewriteImports(upstreamRaw, fullPath, runtimeDir);
    const localContent = readFileSync12(fullPath, "utf8");
    const localDigest = computeDigest(localContent);
    const localUnmodified = localDigest === lockEntry.digest;
    if (localUnmodified) {
      if (!dryRun) {
        mkdirSync8(dirname8(fullPath), { recursive: true });
        writeFileSync7(fullPath, upstreamRewritten);
        lockEntry.digest = upstreamDigest;
      }
      entries.push({ path, status: "updated" });
      updated++;
    } else {
      const baseContent = reconstructBase(lockEntry.digest, localContent);
      const mergeResult = threeWayMerge(baseContent, localContent, upstreamRewritten);
      if (mergeResult.hasConflicts) {
        if (!dryRun) {
          writeFileSync7(fullPath, mergeResult.content);
          writeFileSync7(`${fullPath}.upstream`, upstreamRewritten);
          writeFileSync7(`${fullPath}.local`, localContent);
        }
        entries.push({ path, status: "conflict" });
        conflicts.push(path);
      } else {
        if (!dryRun) {
          mkdirSync8(dirname8(fullPath), { recursive: true });
          writeFileSync7(fullPath, mergeResult.content);
          lockEntry.digest = upstreamDigest;
        }
        entries.push({ path, status: "merged" });
        merged++;
      }
    }
  }
  if (!dryRun && (updated > 0 || merged > 0)) {
    writeLock(cwd, lock);
  }
  return { entries, conflicts, updated, merged };
}
function threeWayMerge(base, local, upstream) {
  const baseLines = base.split("\n");
  const localLines = local.split("\n");
  const upstreamLines = upstream.split("\n");
  if (base === local) {
    return { content: upstream, hasConflicts: false, conflictCount: 0 };
  }
  if (base === upstream) {
    return { content: local, hasConflicts: false, conflictCount: 0 };
  }
  const output = [];
  let hasConflicts = false;
  let conflictCount = 0;
  const maxLen = Math.max(baseLines.length, localLines.length, upstreamLines.length);
  let i = 0;
  while (i < maxLen) {
    const baseLine = baseLines[i] ?? "";
    const localLine = localLines[i] ?? "";
    const upstreamLine = upstreamLines[i] ?? "";
    if (localLine === upstreamLine) {
      output.push(localLine);
      i++;
    } else if (localLine === baseLine) {
      output.push(upstreamLine);
      i++;
    } else if (upstreamLine === baseLine) {
      output.push(localLine);
      i++;
    } else {
      hasConflicts = true;
      conflictCount++;
      const conflictLocal = [];
      const conflictUpstream = [];
      while (i < maxLen) {
        const bl = baseLines[i] ?? "";
        const ll = localLines[i] ?? "";
        const ul = upstreamLines[i] ?? "";
        if (ll === ul || ll === bl || ul === bl) break;
        conflictLocal.push(ll);
        conflictUpstream.push(ul);
        i++;
      }
      output.push("<<<<<<< local");
      output.push(...conflictLocal);
      output.push("=======");
      output.push(...conflictUpstream);
      output.push(">>>>>>> upstream");
    }
  }
  return { content: output.join("\n"), hasConflicts, conflictCount };
}
function reconstructBase(_baseDigest, localContent) {
  return localContent;
}
function isComplexFile(filePath) {
  const ext = extname(filePath);
  return ext === ".tsx" || ext === ".jsx";
}
function rewriteWithAst(content, filePath, runtimeDir) {
  try {
    const result = rewriteImportsAst({ content, filePath, runtimeDir });
    return result.code;
  } catch {
    return rewriteImports(content, filePath, runtimeDir);
  }
}
function resolvePrimitiveSource2(primitive, cwd) {
  const nmPath = join14(cwd, "node_modules", "@solidiom", primitive, "source");
  if (existsSync14(nmPath)) return nmPath;
  const monoPath = join14(cwd, "..", "..", "packages", primitive, "source");
  if (existsSync14(monoPath)) return monoPath;
  return null;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var UpdateCommand = class extends Command9 {
  static paths = [["update"]];
  static usage = Command9.Usage({
    description: "Update source-installed primitives to latest upstream",
    examples: [
      ["Update dialog", "solidiom update dialog"],
      ["Dry run", "solidiom update dialog --dry-run"],
      ["JSON output", "solidiom update dialog --json"]
    ]
  });
  primitive = Option9.String({ required: true });
  dryRun = Option9.Boolean("--dry-run", false, {
    description: "Show what would change without writing"
  });
  json = Option9.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runUpdate({
      cwd: process.cwd(),
      primitive: this.primitive,
      dryRun: this.dryRun
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (this.dryRun) {
      this.context.stdout.write(pc9.bold("[dry-run] Would apply:\n\n"));
    }
    for (const entry of result.entries) {
      switch (entry.status) {
        case "updated":
          this.context.stdout.write(pc9.green(`  \u2191 ${entry.path}
`));
          break;
        case "merged":
          this.context.stdout.write(pc9.yellow(`  \u21C4 ${entry.path} (auto-merged)
`));
          break;
        case "conflict":
          this.context.stdout.write(pc9.red(`  \u26A1 ${entry.path} (CONFLICT)
`));
          break;
        case "skipped-detached":
          this.context.stdout.write(pc9.dim(`  \u25CB ${entry.path} (detached)
`));
          break;
        case "skipped-deleted":
          this.context.stdout.write(pc9.dim(`  \u2717 ${entry.path} (deleted locally)
`));
          break;
      }
    }
    this.context.stdout.write("\n");
    if (result.merged > 0) {
      this.context.stdout.write(
        pc9.yellow(`${result.merged} files auto-merged (review recommended).
`)
      );
    }
    if (result.conflicts.length > 0) {
      this.context.stderr.write(
        pc9.red(`${result.conflicts.length} conflicts \u2014 resolve manually:
`)
      );
      for (const c of result.conflicts) {
        this.context.stderr.write(pc9.red(`  \u2022 ${c}
`));
        this.context.stderr.write(pc9.dim(`    Compare: ${c}.local vs ${c}.upstream
`));
      }
      return 1;
    }
    this.context.stdout.write(pc9.bold(`${result.updated} files updated.
`));
    return 0;
  }
};

// src/commands/doctor.ts
import { Command as Command10, Option as Option10 } from "clipanion";
import { existsSync as existsSync15, readFileSync as readFileSync13 } from "fs";
import { join as join15 } from "path";
import pc10 from "picocolors";
function runDoctor(cwd) {
  const checks = [];
  const configPath = join15(cwd, ".solidiom", "config.json");
  if (existsSync15(configPath)) {
    try {
      ConfigSchema.parse(JSON.parse(readFileSync13(configPath, "utf8")));
      checks.push({ name: "config.json valid", status: "pass" });
    } catch (e) {
      checks.push({ name: "config.json valid", status: "fail", detail: String(e) });
    }
  } else {
    checks.push({
      name: "config.json exists",
      status: "warn",
      detail: "Run 'solidiom init' to create"
    });
  }
  const policyPath = join15(cwd, ".solidiom", "policy.json");
  if (existsSync15(policyPath)) {
    try {
      PolicySchema.parse(JSON.parse(readFileSync13(policyPath, "utf8")));
      checks.push({ name: "policy.json valid", status: "pass" });
    } catch (e) {
      checks.push({ name: "policy.json valid", status: "fail", detail: String(e) });
    }
  } else {
    checks.push({ name: "policy.json exists", status: "pass", detail: "Optional \u2014 using defaults" });
  }
  const pkgPath = join15(cwd, "package.json");
  if (existsSync15(pkgPath)) {
    const pkg = JSON.parse(readFileSync13(pkgPath, "utf8"));
    const solidDep = pkg.dependencies?.["solid-js"] ?? pkg.devDependencies?.["solid-js"];
    if (solidDep) {
      checks.push({ name: "solid-js dependency", status: "pass", detail: solidDep });
    } else {
      checks.push({
        name: "solid-js dependency",
        status: "fail",
        detail: "solid-js not found in package.json"
      });
    }
  }
  const lockPath = join15(cwd, ".solidiom", "lock.json");
  if (existsSync15(lockPath)) {
    try {
      const lock = JSON.parse(readFileSync13(lockPath, "utf8"));
      if (lock.version === 1) {
        checks.push({ name: "lock.json valid", status: "pass" });
      } else {
        checks.push({
          name: "lock.json valid",
          status: "warn",
          detail: `Unknown version: ${lock.version}`
        });
      }
      const entries = Object.values(lock.installed ?? {});
      const unverifiedCount = entries.filter((e) => e.provenance === "unverified").length;
      if (unverifiedCount > 0) {
        checks.push({
          name: "source-install provenance",
          status: "warn",
          detail: `${unverifiedCount} unverified entr${unverifiedCount === 1 ? "y" : "ies"} in lock.json`
        });
      } else {
        checks.push({ name: "source-install provenance", status: "pass" });
      }
    } catch {
      checks.push({ name: "lock.json valid", status: "fail", detail: "Parse error" });
    }
  }
  const pm = detectPackageManager({ cwd });
  checks.push({
    name: "package manager",
    status: "pass",
    detail: `${pm.name}${pm.majorVersion ? `@${pm.majorVersion}` : ""} (via ${pm.source})`
  });
  const healthy = checks.every((c) => c.status !== "fail");
  return { checks, healthy };
}
var DoctorCommand = class extends Command10 {
  static paths = [["doctor"]];
  static usage = Command10.Usage({
    description: "Check project configuration health"
  });
  json = Option10.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runDoctor(process.cwd());
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return result.healthy ? 0 : 1;
    }
    this.context.stdout.write(pc10.bold("solidiom doctor\n\n"));
    for (const check of result.checks) {
      const icon = check.status === "pass" ? pc10.green("\u2713") : check.status === "warn" ? pc10.yellow("\u26A0") : pc10.red("\u2717");
      const detail = check.detail ? pc10.dim(` (${check.detail})`) : "";
      this.context.stdout.write(`  ${icon} ${check.name}${detail}
`);
    }
    this.context.stdout.write(
      result.healthy ? pc10.green("\nHealthy.\n") : pc10.red("\nIssues found.\n")
    );
    return result.healthy ? 0 : 1;
  }
};

// src/commands/audit.ts
import { Command as Command11, Option as Option11 } from "clipanion";
import { readdirSync as readdirSync4, readFileSync as readFileSync14, existsSync as existsSync16 } from "fs";
import { join as join16 } from "path";
import { randomUUID } from "crypto";
import pc11 from "picocolors";
function readPkg(pkgPath) {
  try {
    return JSON.parse(readFileSync14(pkgPath, "utf8"));
  } catch {
    return null;
  }
}
function resolveLicenseId(pkg) {
  if (pkg.license && typeof pkg.license === "string") return pkg.license;
  if (Array.isArray(pkg.licenses)) {
    const ids = pkg.licenses.map((l) => typeof l === "string" ? l : l.type ?? "UNLICENSED");
    return ids.join(" OR ");
  }
  return "UNLICENSED";
}
function buildPurl(name, version) {
  const encoded = name.startsWith("@") ? name.replace(/^@/, "%40").replace("/", "%2F") : name;
  return `pkg:npm/${encoded}@${version}`;
}
function toCdxComponent(name, version, licenseId) {
  return {
    "bom-ref": `${name}@${version}`,
    type: "library",
    name,
    version,
    purl: buildPurl(name, version),
    licenses: [{ license: isSpdxId(licenseId) ? { id: licenseId } : { name: licenseId } }]
  };
}
function isSpdxId(expr) {
  return expr.length > 0 && !expr.includes(" ");
}
function scanNodeModules(nodeModulesPath, seen, components) {
  if (!existsSync16(nodeModulesPath)) return;
  let entries;
  try {
    entries = readdirSync4(nodeModulesPath);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    if (entry.startsWith("@")) {
      const scopeDir = join16(nodeModulesPath, entry);
      let scopedEntries;
      try {
        scopedEntries = readdirSync4(scopeDir);
      } catch {
        continue;
      }
      for (const scoped of scopedEntries) {
        const pkgPath = join16(scopeDir, scoped, "package.json");
        const pkg = readPkg(pkgPath);
        if (!pkg?.name || !pkg.version) continue;
        const ref = `${pkg.name}@${pkg.version}`;
        if (seen.has(ref)) continue;
        seen.add(ref);
        components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)));
      }
    } else {
      const pkgPath = join16(nodeModulesPath, entry, "package.json");
      const pkg = readPkg(pkgPath);
      if (!pkg?.name || !pkg.version) continue;
      const ref = `${pkg.name}@${pkg.version}`;
      if (seen.has(ref)) continue;
      seen.add(ref);
      components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)));
    }
  }
}
function runAudit(cwd) {
  const seen = /* @__PURE__ */ new Set();
  const components = [];
  const monoPackagesDir = join16(cwd, "..", "..", "packages");
  if (existsSync16(monoPackagesDir)) {
    let entries;
    try {
      entries = readdirSync4(monoPackagesDir);
    } catch {
      entries = [];
    }
    for (const entry of entries) {
      const pkgPath = join16(monoPackagesDir, entry, "package.json");
      const pkg = readPkg(pkgPath);
      if (!pkg?.name?.startsWith("@solidiom/") || !pkg.version) continue;
      const ref = `${pkg.name}@${pkg.version}`;
      if (seen.has(ref)) continue;
      seen.add(ref);
      components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)));
    }
  }
  const workspaceRoot = findWorkspaceRoot(cwd);
  if (workspaceRoot) {
    scanNodeModules(join16(workspaceRoot, "node_modules"), seen, components);
  }
  scanNodeModules(join16(cwd, "node_modules"), seen, components);
  return {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: `urn:uuid:${randomUUID()}`,
    version: 1,
    metadata: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      tools: [{ vendor: "openCenter", name: "@solidiom/cli", version: "0.0.1-next.0" }]
    },
    components
  };
}
function findWorkspaceRoot(from) {
  let dir = from;
  for (let i = 0; i < 10; i++) {
    if (existsSync16(join16(dir, "pnpm-workspace.yaml")) || existsSync16(join16(dir, "pnpm-lock.yaml"))) {
      return dir;
    }
    const parent = join16(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
var AuditCommand = class extends Command11 {
  static paths = [["audit"]];
  static usage = Command11.Usage({
    description: "Generate CycloneDX 1.5 SBOM and license inventory",
    examples: [
      ["Full CycloneDX 1.5 SBOM", "solidiom audit --sbom"],
      ["License inventory table", "solidiom audit --licenses"],
      ["SBOM as JSON (for piping)", "solidiom audit --sbom --json"]
    ]
  });
  sbom = Option11.Boolean("--sbom", false, { description: "Emit full CycloneDX 1.5 JSON SBOM" });
  json = Option11.Boolean("--json", false, { description: "Alias for --sbom" });
  licenses = Option11.Boolean("--licenses", false, {
    description: "Emit license inventory table only"
  });
  async execute() {
    const result = runAudit(process.cwd());
    if (this.sbom || this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (this.licenses) {
      return this.printLicenses(result);
    }
    this.context.stdout.write(
      pc11.bold(`SBOM Summary \u2014 CycloneDX ${result.specVersion}
`) + `  Components: ${result.components.length}
  Generated:  ${result.metadata.timestamp}
  Serial:     ${result.serialNumber}

Run ${pc11.cyan("solidiom audit --sbom")} for full JSON or ${pc11.cyan("solidiom audit --licenses")} for license table.
`
    );
    return 0;
  }
  printLicenses(result) {
    const grouped = /* @__PURE__ */ new Map();
    for (const c of result.components) {
      const licenseId = c.licenses[0]?.license.id ?? c.licenses[0]?.license.name ?? "UNLICENSED";
      const list = grouped.get(licenseId) ?? [];
      list.push(`${c.name}@${c.version}`);
      grouped.set(licenseId, list);
    }
    this.context.stdout.write(
      pc11.bold(`License Inventory (${result.components.length} components)

`)
    );
    for (const [license, packages] of [...grouped.entries()].sort()) {
      this.context.stdout.write(pc11.bold(`${license}:
`));
      for (const pkg of packages.sort()) {
        this.context.stdout.write(`  ${pkg}
`);
      }
    }
    return 0;
  }
};

// src/bin.ts
var cli = new Cli({
  binaryLabel: "solidiom",
  binaryName: "solidiom",
  binaryVersion: "0.0.1-next.0"
});
cli.register(InitCommand);
cli.register(PlanCommand);
cli.register(AddCommand);
cli.register(CreateCommand);
cli.register(InspectCommand);
cli.register(DiffCommand);
cli.register(DetachCommand);
cli.register(UpdateCommand);
cli.register(DoctorCommand);
cli.register(VerifyCommand);
cli.register(AuditCommand);
cli.runExit(process.argv.slice(2));
//# sourceMappingURL=bin.js.map
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
  /** Package install mode: "package" or "source". */
  defaultMode: z.enum(["package", "source"]).optional().default("package")
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
  registryTrustedKeys: z.array(z.string()).optional().default([])
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
  deliverables: z2.array(z2.string()),
  hasAccessibilityEvidence: z2.boolean(),
  accessibility: z2.object({
    reviewStatus: z2.enum(["none", "automated", "manual", "complete"]),
    evidenceIds: z2.array(z2.string())
  }),
  documentationStatus: z2.enum(["stub", "draft", "review", "complete"]),
  documentationLocales: z2.record(
    z2.object({
      status: z2.enum(["missing", "draft", "stale", "reviewed"]),
      sourceHash: z2.string().optional(),
      lastUpdated: z2.string().optional()
    })
  ),
  stylingOutputs: z2.array(z2.enum(["css", "tailwind", "unocss"])),
  themeCompatible: z2.array(z2.string()),
  searchKeywords: z2.array(z2.string()),
  provenance: z2.object({
    repository: z2.string(),
    directory: z2.string(),
    sourceCommit: z2.string().optional()
  })
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
  source: z2.object({
    entry: z2.string().min(1),
    files: z2.array(z2.string())
  }),
  dependencies: z2.array(z2.string()),
  integrity: manifestIntegritySchema
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
        version: p.version
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
    return { name: primitive, deps, adapters, version: data.version };
  } catch {
    return null;
  }
}
var BUILTIN_PRIMITIVES = /* @__PURE__ */ new Map([
  ["dialog", { name: "dialog", deps: ["@solidiom/runtime"], adapters: [] }],
  [
    "select",
    {
      name: "select",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"]
    }
  ],
  [
    "calendar",
    {
      name: "calendar",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-date-internationalized"]
    }
  ],
  [
    "carousel",
    {
      name: "carousel",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-carousel-embla"]
    }
  ],
  [
    "popover",
    {
      name: "popover",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"]
    }
  ],
  [
    "tooltip",
    {
      name: "tooltip",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"]
    }
  ],
  [
    "menu",
    {
      name: "menu",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"]
    }
  ],
  [
    "combobox",
    {
      name: "combobox",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-positioning-floating-ui"]
    }
  ],
  [
    "date-picker",
    {
      name: "date-picker",
      deps: ["@solidiom/runtime"],
      adapters: ["@solidiom/adapter-date-internationalized"]
    }
  ],
  ["button", { name: "button", deps: ["@solidiom/runtime"], adapters: [] }],
  ["checkbox", { name: "checkbox", deps: ["@solidiom/runtime"], adapters: [] }],
  ["switch", { name: "switch", deps: ["@solidiom/runtime"], adapters: [] }],
  ["slider", { name: "slider", deps: ["@solidiom/runtime"], adapters: [] }],
  ["accordion", { name: "accordion", deps: ["@solidiom/runtime"], adapters: [] }],
  ["tabs", { name: "tabs", deps: ["@solidiom/runtime"], adapters: [] }],
  ["collapsible", { name: "collapsible", deps: ["@solidiom/runtime"], adapters: [] }],
  ["toast", { name: "toast", deps: ["@solidiom/runtime"], adapters: [] }],
  ["listbox", { name: "listbox", deps: ["@solidiom/runtime"], adapters: [] }]
]);
function runPlan(options) {
  const {
    primitive,
    cwd,
    mode: modeOverride,
    registry: registryOverride,
    noNetwork: _noNetwork
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
  return { primitive, mode, entries, violations };
}
var PlanCommand = class extends Command2 {
  static paths = [["plan"]];
  static usage = Command2.Usage({
    description: "Resolve capability graph for a primitive",
    examples: [
      ["Plan dialog installation", "solidiom plan dialog"],
      ["Plan as JSON", "solidiom plan select --json"],
      ["Plan in source mode", "solidiom plan dialog --mode source"]
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
  async execute() {
    const plan = runPlan({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode,
      registry: this.registry,
      noNetwork: this.noNetwork
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(plan, null, 2) + "\n");
      return 0;
    }
    this.context.stdout.write(`
Plan for ${pc2.bold(plan.primitive)} (${plan.mode} mode):

`);
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
import { Command as Command3, Option as Option3 } from "clipanion";

// src/source/install.ts
import { existsSync as existsSync3, mkdirSync as mkdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2, readdirSync, statSync } from "fs";
import { join as join3, relative, dirname } from "path";
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
function rewriteImports(content, filePath, runtimeDir) {
  const fileDir = dirname(filePath);
  const relToRuntime = relative(fileDir, runtimeDir).replace(/\\/g, "/") || ".";
  const prefix = relToRuntime.startsWith(".") ? relToRuntime : `./${relToRuntime}`;
  return content.replace(/from\s+["']@solidiom\/runtime(\/[^"']*)?["']/g, (_match, subpath) => {
    const target = subpath ? `${prefix}${subpath}` : `${prefix}/index`;
    return `from "${target}"`;
  });
}
function collectRuntimeFiles(runtimeSourceDir) {
  const files = /* @__PURE__ */ new Map();
  if (!existsSync3(runtimeSourceDir)) return files;
  function walk(dir, prefix) {
    for (const entry of readdirSync(dir)) {
      const full = join3(dir, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else if (entry.endsWith(".ts") && !entry.includes(".test.")) {
        files.set(rel, readFileSync4(full, "utf8"));
      }
    }
  }
  walk(runtimeSourceDir, "");
  return files;
}
function installSource(options) {
  const { primitive, cwd, plan, dryRun = false } = options;
  const configPath = join3(cwd, ".solidiom", "config.json");
  const config = existsSync3(configPath) ? ConfigSchema.parse(JSON.parse(readFileSync4(configPath, "utf8"))) : ConfigSchema.parse({});
  const sourceDir = join3(cwd, config.sourceDir);
  const runtimeDir = join3(cwd, config.runtimeDir);
  const filesWritten = [];
  const runtimeDeduped = [];
  const primitiveSourceDir = resolvePrimitiveSource(primitive, cwd);
  if (!primitiveSourceDir) {
    return { filesWritten: [], runtimeDeduped: [], lockUpdated: false };
  }
  const lock = readLock(cwd);
  const primitiveTarget = join3(sourceDir, primitive);
  if (!dryRun) mkdirSync2(primitiveTarget, { recursive: true });
  const sourceFiles = collectSourceFiles(primitiveSourceDir);
  for (const [relPath, content] of sourceFiles) {
    const targetPath = join3(primitiveTarget, relPath);
    const rewritten = rewriteImports(content, targetPath, runtimeDir);
    if (!dryRun) {
      mkdirSync2(dirname(targetPath), { recursive: true });
      writeFileSync2(targetPath, rewritten);
    }
    const relFromCwd = relative(cwd, targetPath);
    filesWritten.push(relFromCwd);
    lock.installed[relFromCwd] = {
      path: relFromCwd,
      digest: computeDigest(content),
      primitive,
      version: plan.entries[0]?.version ?? "0.0.1-next.0"
    };
  }
  const runtimePkgSource = resolveRuntimeSource(cwd);
  if (runtimePkgSource) {
    const runtimeFiles = collectRuntimeFiles(runtimePkgSource);
    if (!dryRun) mkdirSync2(runtimeDir, { recursive: true });
    for (const [relPath, content] of runtimeFiles) {
      const targetPath = join3(runtimeDir, relPath);
      const relFromCwd = relative(cwd, targetPath);
      if (!existsSync3(targetPath)) {
        if (!dryRun) {
          mkdirSync2(dirname(targetPath), { recursive: true });
          writeFileSync2(targetPath, content);
        }
        filesWritten.push(relFromCwd);
        runtimeDeduped.push(relFromCwd);
      }
      lock.installed[relFromCwd] = {
        path: relFromCwd,
        digest: computeDigest(content),
        primitive: "_runtime",
        version: plan.entries.find((e) => e.package === "@solidiom/runtime")?.version ?? "0.0.1-next.0"
      };
    }
  }
  if (!dryRun) {
    writeLock(cwd, lock);
  }
  return { filesWritten, runtimeDeduped, lockUpdated: !dryRun };
}
function collectSourceFiles(dir) {
  const files = /* @__PURE__ */ new Map();
  if (!existsSync3(dir)) return files;
  function walk(d, prefix) {
    for (const entry of readdirSync(d)) {
      const full = join3(d, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else if ((entry.endsWith(".ts") || entry.endsWith(".tsx")) && !entry.includes(".test.")) {
        files.set(rel, readFileSync4(full, "utf8"));
      }
    }
  }
  walk(dir, "");
  return files;
}
function resolvePrimitiveSource(primitive, cwd) {
  const monoPath = join3(cwd, "..", "..", "packages", primitive, "source");
  if (existsSync3(monoPath)) return monoPath;
  const nmPath = join3(cwd, "node_modules", "@solidiom", primitive, "source");
  if (existsSync3(nmPath)) return nmPath;
  return null;
}
function resolveRuntimeSource(cwd) {
  const monoPath = join3(cwd, "..", "..", "packages", "runtime", "src");
  if (existsSync3(monoPath)) return monoPath;
  const nmPath = join3(cwd, "node_modules", "@solidiom", "runtime", "src");
  if (existsSync3(nmPath)) return nmPath;
  return null;
}

// src/commands/add.ts
import pc3 from "picocolors";
function runAdd(options) {
  const plan = runPlan({
    primitive: options.primitive,
    cwd: options.cwd,
    mode: options.mode,
    registry: options.registry,
    noNetwork: options.noNetwork
  });
  if (plan.violations.length > 0) {
    return { plan, installCommand: null, blocked: true };
  }
  if (plan.mode === "source") {
    const sourceResult = installSource({
      primitive: options.primitive,
      cwd: options.cwd,
      plan,
      dryRun: options.dryRun
    });
    return { plan, installCommand: null, blocked: false, sourceResult };
  }
  const packages = plan.entries.map((e) => `${e.package}@${e.version}`);
  const installCommand = `pnpm add ${packages.join(" ")}`;
  return { plan, installCommand, blocked: false };
}
var AddCommand = class extends Command3 {
  static paths = [["add"]];
  static usage = Command3.Usage({
    description: "Add a primitive (package or source mode)",
    examples: [
      ["Add dialog as package", "solidiom add dialog"],
      ["Add dialog as source", "solidiom add dialog --mode source"],
      ["Dry run", "solidiom add select --dry-run"]
    ]
  });
  primitive = Option3.String({ required: true });
  mode = Option3.String("--mode", { description: "Install mode (package or source)" });
  registry = Option3.String("--registry", {
    description: "Custom registry URL for package resolution"
  });
  noNetwork = Option3.Boolean("--no-network", false, {
    description: "Use only cached/local registry data (no network fetch)"
  });
  dryRun = Option3.Boolean("--dry-run", false, {
    description: "Show what would be done without writing"
  });
  json = Option3.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runAdd({
      primitive: this.primitive,
      cwd: process.cwd(),
      mode: this.mode,
      registry: this.registry,
      noNetwork: this.noNetwork,
      dryRun: this.dryRun
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (result.blocked) {
      this.context.stderr.write(pc3.red("Blocked by policy violations:\n"));
      for (const v of result.plan.violations) {
        this.context.stderr.write(pc3.red(`  \u2717 ${v}
`));
      }
      return 1;
    }
    if (result.installCommand) {
      this.context.stdout.write(pc3.green(result.installCommand) + "\n");
    } else if (result.sourceResult) {
      const sr = result.sourceResult;
      this.context.stdout.write(pc3.green(`Installed ${sr.filesWritten.length} source files
`));
      for (const f of sr.filesWritten) {
        this.context.stdout.write(`  ${f}
`);
      }
    }
    return 0;
  }
};

// src/commands/inspect.ts
import { Command as Command4, Option as Option4 } from "clipanion";
import { existsSync as existsSync4, readFileSync as readFileSync5 } from "fs";
import { join as join4 } from "path";
import pc4 from "picocolors";
function runInspect(options) {
  const { cwd, subcommand, primitive } = options;
  const lock = readLock(cwd);
  const entries = Object.values(lock.installed).filter(
    (e) => !primitive || e.primitive === primitive
  );
  if (subcommand === "manifest") {
    const registryPath = join4(cwd, "..", "..", "registry", `${primitive}.json`);
    const manifest = existsSync4(registryPath) ? JSON.parse(readFileSync5(registryPath, "utf8")) : null;
    return { primitive, mode: "manifest", entries, manifest };
  }
  return { primitive, mode: subcommand, entries };
}
var InspectCommand = class extends Command4 {
  static paths = [["inspect"]];
  static usage = Command4.Usage({
    description: "Inspect installed primitive source, manifest, or provenance",
    examples: [
      ["Show installed source files", "solidiom inspect source"],
      ["Show primitive manifest", "solidiom inspect manifest dialog"],
      ["Show file provenance", "solidiom inspect provenance"],
      ["List all installed files", "solidiom inspect files"]
    ]
  });
  subcommand = Option4.String({ required: true });
  primitive = Option4.String({ required: false });
  json = Option4.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runInspect({
      cwd: process.cwd(),
      subcommand: this.subcommand,
      primitive: this.primitive
    });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    switch (this.subcommand) {
      case "source":
      case "files":
        if (result.entries.length === 0) {
          this.context.stdout.write("No source-installed primitives found.\n");
        } else {
          this.context.stdout.write(pc4.bold("Installed source files:\n"));
          for (const e of result.entries) {
            const status = e.detached ? pc4.yellow(" [detached]") : "";
            this.context.stdout.write(`  ${e.path} (${e.primitive}@${e.version})${status}
`);
          }
        }
        break;
      case "manifest":
        if (result.manifest) {
          this.context.stdout.write(JSON.stringify(result.manifest, null, 2) + "\n");
        } else {
          this.context.stderr.write(pc4.red(`No manifest found for ${this.primitive}
`));
          return 1;
        }
        break;
      case "explain":
        this.context.stdout.write(pc4.bold(`Primitive: ${this.primitive ?? "(all)"}
`));
        this.context.stdout.write(`Mode: source
`);
        this.context.stdout.write(`Files: ${result.entries.length}
`);
        this.context.stdout.write(`Detached: ${result.entries.filter((e) => e.detached).length}
`);
        break;
      case "provenance":
        for (const e of result.entries) {
          this.context.stdout.write(`${e.path}
`);
          this.context.stdout.write(`  primitive: ${e.primitive}
`);
          this.context.stdout.write(`  version: ${e.version}
`);
          this.context.stdout.write(`  digest: ${e.digest.slice(0, 12)}\u2026
`);
          this.context.stdout.write(`  detached: ${e.detached ?? false}
`);
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
import { Command as Command5, Option as Option5 } from "clipanion";
import { existsSync as existsSync5, readFileSync as readFileSync6 } from "fs";
import { join as join5 } from "path";
import pc5 from "picocolors";
function runDiff(options) {
  const { cwd, primitive } = options;
  const lock = readLock(cwd);
  const entries = [];
  for (const [path, lockEntry] of Object.entries(lock.installed)) {
    if (primitive && lockEntry.primitive !== primitive) continue;
    const fullPath = join5(cwd, path);
    if (!existsSync5(fullPath)) {
      entries.push({ path, primitive: lockEntry.primitive, status: "deleted" });
    } else {
      const currentContent = readFileSync6(fullPath, "utf8");
      const currentDigest = computeDigest(currentContent);
      const status = currentDigest === lockEntry.digest ? "unchanged" : "modified";
      entries.push({ path, primitive: lockEntry.primitive, status });
    }
  }
  return { entries, hasChanges: entries.some((e) => e.status !== "unchanged") };
}
var DiffCommand = class extends Command5 {
  static paths = [["diff"]];
  static usage = Command5.Usage({
    description: "Show changes between installed source and lockfile digests",
    examples: [
      ["Diff all installed primitives", "solidiom diff"],
      ["Diff specific primitive", "solidiom diff --primitive dialog"]
    ]
  });
  primitive = Option5.String("--primitive", { description: "Filter by primitive name" });
  json = Option5.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runDiff({ cwd: process.cwd(), primitive: this.primitive });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (!result.hasChanges) {
      this.context.stdout.write(pc5.green("No local modifications.\n"));
      return 0;
    }
    for (const entry of result.entries) {
      switch (entry.status) {
        case "modified":
          this.context.stdout.write(pc5.yellow(`  M ${entry.path}
`));
          break;
        case "deleted":
          this.context.stdout.write(pc5.red(`  D ${entry.path}
`));
          break;
        case "new":
          this.context.stdout.write(pc5.green(`  A ${entry.path}
`));
          break;
      }
    }
    return 0;
  }
};

// src/commands/detach.ts
import { Command as Command6, Option as Option6 } from "clipanion";
import pc6 from "picocolors";
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
var DetachCommand = class extends Command6 {
  static paths = [["detach"]];
  static usage = Command6.Usage({
    description: "Detach a source-installed primitive from upstream updates",
    examples: [["Detach dialog", "solidiom detach dialog"]]
  });
  primitive = Option6.String({ required: true });
  json = Option6.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runDetach({ cwd: process.cwd(), primitive: this.primitive });
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return 0;
    }
    if (result.detached.length === 0 && result.alreadyDetached.length === 0) {
      this.context.stderr.write(
        pc6.yellow(`No source-installed files found for ${this.primitive}
`)
      );
      return 1;
    }
    for (const path of result.detached) {
      this.context.stdout.write(pc6.green(`  Detached: ${path}
`));
    }
    for (const path of result.alreadyDetached) {
      this.context.stdout.write(`  Already detached: ${path}
`);
    }
    this.context.stdout.write(
      pc6.bold(
        `
${result.detached.length} files detached. They will be skipped by 'solidiom update'.
`
      )
    );
    return 0;
  }
};

// src/commands/update.ts
import { Command as Command7, Option as Option7 } from "clipanion";
import { existsSync as existsSync6, readFileSync as readFileSync7, writeFileSync as writeFileSync3, mkdirSync as mkdirSync3 } from "fs";
import { join as join6, dirname as dirname2, extname } from "path";

// src/source/ast-transform.ts
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
  const { relative: relative2, dirname: dirname4 } = __require("path");
  const fileDir = dirname4(filePath);
  let relToRuntime = relative2(fileDir, runtimeDir).replace(/\\/g, "/");
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
import pc7 from "picocolors";
function runUpdate(options) {
  const { cwd, primitive, dryRun = false } = options;
  const lock = readLock(cwd);
  const configPath = join6(cwd, ".solidiom", "config.json");
  const config = existsSync6(configPath) ? ConfigSchema.parse(JSON.parse(readFileSync7(configPath, "utf8"))) : ConfigSchema.parse({});
  const runtimeDir = join6(cwd, config.runtimeDir);
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
    const fullPath = join6(cwd, path);
    if (!existsSync6(fullPath)) {
      entries.push({ path, status: "skipped-deleted" });
      continue;
    }
    const relInPrimitive = path.replace(new RegExp(`.*${escapeRegex(primitive)}/`), "");
    const upstreamPath = join6(upstreamDir, relInPrimitive);
    if (!existsSync6(upstreamPath)) {
      entries.push({ path, status: "skipped-unchanged" });
      continue;
    }
    const upstreamRaw = readFileSync7(upstreamPath, "utf8");
    const upstreamDigest = computeDigest(upstreamRaw);
    if (upstreamDigest === lockEntry.digest) {
      entries.push({ path, status: "skipped-unchanged" });
      continue;
    }
    const upstreamRewritten = isComplexFile(fullPath) ? rewriteWithAst(upstreamRaw, fullPath, runtimeDir) : rewriteImports(upstreamRaw, fullPath, runtimeDir);
    const localContent = readFileSync7(fullPath, "utf8");
    const localDigest = computeDigest(localContent);
    const localUnmodified = localDigest === lockEntry.digest;
    if (localUnmodified) {
      if (!dryRun) {
        mkdirSync3(dirname2(fullPath), { recursive: true });
        writeFileSync3(fullPath, upstreamRewritten);
        lockEntry.digest = upstreamDigest;
      }
      entries.push({ path, status: "updated" });
      updated++;
    } else {
      const baseContent = reconstructBase(lockEntry.digest, localContent);
      const mergeResult = threeWayMerge(baseContent, localContent, upstreamRewritten);
      if (mergeResult.hasConflicts) {
        if (!dryRun) {
          writeFileSync3(fullPath, mergeResult.content);
          writeFileSync3(`${fullPath}.upstream`, upstreamRewritten);
          writeFileSync3(`${fullPath}.local`, localContent);
        }
        entries.push({ path, status: "conflict" });
        conflicts.push(path);
      } else {
        if (!dryRun) {
          mkdirSync3(dirname2(fullPath), { recursive: true });
          writeFileSync3(fullPath, mergeResult.content);
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
  const nmPath = join6(cwd, "node_modules", "@solidiom", primitive, "source");
  if (existsSync6(nmPath)) return nmPath;
  const monoPath = join6(cwd, "..", "..", "packages", primitive, "source");
  if (existsSync6(monoPath)) return monoPath;
  return null;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var UpdateCommand = class extends Command7 {
  static paths = [["update"]];
  static usage = Command7.Usage({
    description: "Update source-installed primitives to latest upstream",
    examples: [
      ["Update dialog", "solidiom update dialog"],
      ["Dry run", "solidiom update dialog --dry-run"],
      ["JSON output", "solidiom update dialog --json"]
    ]
  });
  primitive = Option7.String({ required: true });
  dryRun = Option7.Boolean("--dry-run", false, {
    description: "Show what would change without writing"
  });
  json = Option7.Boolean("--json", false, { description: "Output as JSON" });
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
      this.context.stdout.write(pc7.bold("[dry-run] Would apply:\n\n"));
    }
    for (const entry of result.entries) {
      switch (entry.status) {
        case "updated":
          this.context.stdout.write(pc7.green(`  \u2191 ${entry.path}
`));
          break;
        case "merged":
          this.context.stdout.write(pc7.yellow(`  \u21C4 ${entry.path} (auto-merged)
`));
          break;
        case "conflict":
          this.context.stdout.write(pc7.red(`  \u26A1 ${entry.path} (CONFLICT)
`));
          break;
        case "skipped-detached":
          this.context.stdout.write(pc7.dim(`  \u25CB ${entry.path} (detached)
`));
          break;
        case "skipped-deleted":
          this.context.stdout.write(pc7.dim(`  \u2717 ${entry.path} (deleted locally)
`));
          break;
      }
    }
    this.context.stdout.write("\n");
    if (result.merged > 0) {
      this.context.stdout.write(
        pc7.yellow(`${result.merged} files auto-merged (review recommended).
`)
      );
    }
    if (result.conflicts.length > 0) {
      this.context.stderr.write(
        pc7.red(`${result.conflicts.length} conflicts \u2014 resolve manually:
`)
      );
      for (const c of result.conflicts) {
        this.context.stderr.write(pc7.red(`  \u2022 ${c}
`));
        this.context.stderr.write(pc7.dim(`    Compare: ${c}.local vs ${c}.upstream
`));
      }
      return 1;
    }
    this.context.stdout.write(pc7.bold(`${result.updated} files updated.
`));
    return 0;
  }
};

// src/commands/doctor.ts
import { Command as Command8, Option as Option8 } from "clipanion";
import { existsSync as existsSync7, readFileSync as readFileSync8 } from "fs";
import { join as join7 } from "path";
import pc8 from "picocolors";
function runDoctor(cwd) {
  const checks = [];
  const configPath = join7(cwd, ".solidiom", "config.json");
  if (existsSync7(configPath)) {
    try {
      ConfigSchema.parse(JSON.parse(readFileSync8(configPath, "utf8")));
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
  const policyPath = join7(cwd, ".solidiom", "policy.json");
  if (existsSync7(policyPath)) {
    try {
      PolicySchema.parse(JSON.parse(readFileSync8(policyPath, "utf8")));
      checks.push({ name: "policy.json valid", status: "pass" });
    } catch (e) {
      checks.push({ name: "policy.json valid", status: "fail", detail: String(e) });
    }
  } else {
    checks.push({ name: "policy.json exists", status: "pass", detail: "Optional \u2014 using defaults" });
  }
  const pkgPath = join7(cwd, "package.json");
  if (existsSync7(pkgPath)) {
    const pkg = JSON.parse(readFileSync8(pkgPath, "utf8"));
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
  const lockPath = join7(cwd, ".solidiom", "lock.json");
  if (existsSync7(lockPath)) {
    try {
      const lock = JSON.parse(readFileSync8(lockPath, "utf8"));
      if (lock.version === 1) {
        checks.push({ name: "lock.json valid", status: "pass" });
      } else {
        checks.push({
          name: "lock.json valid",
          status: "warn",
          detail: `Unknown version: ${lock.version}`
        });
      }
    } catch {
      checks.push({ name: "lock.json valid", status: "fail", detail: "Parse error" });
    }
  }
  const healthy = checks.every((c) => c.status !== "fail");
  return { checks, healthy };
}
var DoctorCommand = class extends Command8 {
  static paths = [["doctor"]];
  static usage = Command8.Usage({
    description: "Check project configuration health"
  });
  json = Option8.Boolean("--json", false, { description: "Output as JSON" });
  async execute() {
    const result = runDoctor(process.cwd());
    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n");
      return result.healthy ? 0 : 1;
    }
    this.context.stdout.write(pc8.bold("solidiom doctor\n\n"));
    for (const check of result.checks) {
      const icon = check.status === "pass" ? pc8.green("\u2713") : check.status === "warn" ? pc8.yellow("\u26A0") : pc8.red("\u2717");
      const detail = check.detail ? pc8.dim(` (${check.detail})`) : "";
      this.context.stdout.write(`  ${icon} ${check.name}${detail}
`);
    }
    this.context.stdout.write(
      result.healthy ? pc8.green("\nHealthy.\n") : pc8.red("\nIssues found.\n")
    );
    return result.healthy ? 0 : 1;
  }
};

// src/commands/verify.ts
import { Command as Command9, Option as Option9 } from "clipanion";
import { readFileSync as readFileSync9, existsSync as existsSync8 } from "fs";
import { join as join8, dirname as dirname3, basename } from "path";
import { createVerify, createHmac, createHash as createHash2 } from "crypto";
import pc9 from "picocolors";
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
    const raw = JSON.parse(readFileSync9(bundlePath, "utf8"));
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
  const dir = dirname3(artifact);
  const base = basename(artifact);
  candidates.push(join8(dir, `${base}.sigstore.json`), join8(dir, `${base}.sigstore`));
  for (const p of candidates) {
    if (existsSync8(p)) return p;
  }
  return null;
}
function verifyTrustedKeys(artifact, cwd) {
  const keysPath = join8(cwd, ".solidiom", "trusted-keys.json");
  if (!existsSync8(keysPath)) {
    return { verified: false, mode: "trusted-keys", reason: "No .solidiom/trusted-keys.json found" };
  }
  let keys;
  try {
    keys = JSON.parse(readFileSync9(keysPath, "utf8"));
    if (!Array.isArray(keys)) throw new Error("expected array");
  } catch (err) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `Invalid trusted-keys.json: ${String(err)}`
    };
  }
  const sigPath = `${artifact}.sig`;
  if (!existsSync8(sigPath)) {
    return {
      verified: false,
      mode: "trusted-keys",
      reason: `No signature file found at ${sigPath}`
    };
  }
  let artifactBytes;
  let sigBytes;
  try {
    artifactBytes = readFileSync9(artifact);
    sigBytes = Buffer.from(readFileSync9(sigPath, "utf8").trim(), "base64");
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
  const registryDir = options.registryDir ?? join8(cwd, "registry");
  const indexPath = join8(registryDir, "index.json");
  const violations = [];
  if (!existsSync8(indexPath)) {
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
    const manifestPath = join8(registryDir, `${summary.name}.json`);
    if (!existsSync8(manifestPath)) {
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
  const policyPath = join8(cwd, ".solidiom", "policy.json");
  if (!existsSync8(policyPath)) {
    return { verified: true, mode: "none", reason: "No policy \u2014 verification skipped" };
  }
  const policy = PolicySchema.parse(JSON.parse(readFileSync9(policyPath, "utf8")));
  switch (policy.signatureMode) {
    case "none":
      return { verified: true, mode: "none", reason: "Signature verification disabled by policy" };
    case "sigstore":
      return verifySigstore(artifact, policy.trustedIdentities, noNetwork);
    case "trusted-keys":
      return verifyTrustedKeys(artifact, cwd);
  }
}
var VerifyCommand = class extends Command9 {
  static paths = [["verify"]];
  static usage = Command9.Usage({
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
  artifact = Option9.String({ required: false });
  noNetwork = Option9.Boolean("--no-network", false, {
    description: "Skip TUF network fetch; use cached trust root"
  });
  json = Option9.Boolean("--json", false, { description: "Output result as JSON" });
  registry = Option9.Boolean("--registry", false, {
    description: "Verify registry/index.json and per-primitive manifest integrity instead of an artifact"
  });
  async execute() {
    if (this.registry) {
      const cwd = process.cwd();
      const policyPath = join8(cwd, ".solidiom", "policy.json");
      const policy = existsSync8(policyPath) ? PolicySchema.parse(JSON.parse(readFileSync9(policyPath, "utf8"))) : PolicySchema.parse({});
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
          pc9.green(`\u2713 Registry verified: ${result2.primitivesChecked} manifest(s) checked
`)
        );
        return 0;
      }
      this.context.stderr.write(pc9.red(`\u2717 Registry verification failed:
`));
      for (const violation of result2.violations) {
        this.context.stderr.write(pc9.red(`  \u2717 ${violation}
`));
      }
      return 1;
    }
    if (!this.artifact) {
      this.context.stderr.write(pc9.red("\u2717 An artifact path is required unless --registry is set\n"));
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
      this.context.stdout.write(pc9.green(`\u2713 Verified (${result.mode})${id}: ${result.reason}
`));
      return 0;
    }
    this.context.stderr.write(pc9.red(`\u2717 Verification failed (${result.mode}): ${result.reason}
`));
    return 1;
  }
};

// src/commands/audit.ts
import { Command as Command10, Option as Option10 } from "clipanion";
import { readdirSync as readdirSync2, readFileSync as readFileSync10, existsSync as existsSync9 } from "fs";
import { join as join9 } from "path";
import { randomUUID } from "crypto";
import pc10 from "picocolors";
function readPkg(pkgPath) {
  try {
    return JSON.parse(readFileSync10(pkgPath, "utf8"));
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
  if (!existsSync9(nodeModulesPath)) return;
  let entries;
  try {
    entries = readdirSync2(nodeModulesPath);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    if (entry.startsWith("@")) {
      const scopeDir = join9(nodeModulesPath, entry);
      let scopedEntries;
      try {
        scopedEntries = readdirSync2(scopeDir);
      } catch {
        continue;
      }
      for (const scoped of scopedEntries) {
        const pkgPath = join9(scopeDir, scoped, "package.json");
        const pkg = readPkg(pkgPath);
        if (!pkg?.name || !pkg.version) continue;
        const ref = `${pkg.name}@${pkg.version}`;
        if (seen.has(ref)) continue;
        seen.add(ref);
        components.push(toCdxComponent(pkg.name, pkg.version, resolveLicenseId(pkg)));
      }
    } else {
      const pkgPath = join9(nodeModulesPath, entry, "package.json");
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
  const monoPackagesDir = join9(cwd, "..", "..", "packages");
  if (existsSync9(monoPackagesDir)) {
    let entries;
    try {
      entries = readdirSync2(monoPackagesDir);
    } catch {
      entries = [];
    }
    for (const entry of entries) {
      const pkgPath = join9(monoPackagesDir, entry, "package.json");
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
    scanNodeModules(join9(workspaceRoot, "node_modules"), seen, components);
  }
  scanNodeModules(join9(cwd, "node_modules"), seen, components);
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
    if (existsSync9(join9(dir, "pnpm-workspace.yaml")) || existsSync9(join9(dir, "pnpm-lock.yaml"))) {
      return dir;
    }
    const parent = join9(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
var AuditCommand = class extends Command10 {
  static paths = [["audit"]];
  static usage = Command10.Usage({
    description: "Generate CycloneDX 1.5 SBOM and license inventory",
    examples: [
      ["Full CycloneDX 1.5 SBOM", "solidiom audit --sbom"],
      ["License inventory table", "solidiom audit --licenses"],
      ["SBOM as JSON (for piping)", "solidiom audit --sbom --json"]
    ]
  });
  sbom = Option10.Boolean("--sbom", false, { description: "Emit full CycloneDX 1.5 JSON SBOM" });
  json = Option10.Boolean("--json", false, { description: "Alias for --sbom" });
  licenses = Option10.Boolean("--licenses", false, {
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
      pc10.bold(`SBOM Summary \u2014 CycloneDX ${result.specVersion}
`) + `  Components: ${result.components.length}
  Generated:  ${result.metadata.timestamp}
  Serial:     ${result.serialNumber}

Run ${pc10.cyan("solidiom audit --sbom")} for full JSON or ${pc10.cyan("solidiom audit --licenses")} for license table.
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
      pc10.bold(`License Inventory (${result.components.length} components)

`)
    );
    for (const [license, packages] of [...grouped.entries()].sort()) {
      this.context.stdout.write(pc10.bold(`${license}:
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
cli.register(InspectCommand);
cli.register(DiffCommand);
cli.register(DetachCommand);
cli.register(UpdateCommand);
cli.register(DoctorCommand);
cli.register(VerifyCommand);
cli.register(AuditCommand);
cli.runExit(process.argv.slice(2));
//# sourceMappingURL=bin.js.map
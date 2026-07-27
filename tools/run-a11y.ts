import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  AXE_RESULTS_SCHEMA_VERSION,
  AXE_RESULT_PREFIX,
  type AxeScanResult,
  type AxeResultsArtifact,
  validateAxeResultsArtifact,
} from "./axe-results";

const ROOT = join(import.meta.dirname ?? __dirname, "..");
const OUTPUT = join(ROOT, "artifacts/axe-results.json");

function currentCommitSha(): string | null {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;

  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

function currentCiRunUrl(): string | null {
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  if (!GITHUB_REPOSITORY || !GITHUB_RUN_ID) return null;
  return `${GITHUB_SERVER_URL ?? "https://github.com"}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
}

function collectResults(output: string): AxeScanResult[] {
  const results: AxeScanResult[] = [];

  for (const line of output.split(/\r?\n/)) {
    const markerIndex = line.indexOf(AXE_RESULT_PREFIX);
    if (markerIndex === -1) continue;

    const serialized = line
      .slice(markerIndex + AXE_RESULT_PREFIX.length)
      .trim();
    try {
      results.push(JSON.parse(serialized) as AxeScanResult);
    } catch (error) {
      throw new Error(
        `Unable to parse axe result emitted by the browser suite: ${String(error)}`,
      );
    }
  }

  return results;
}

function main(): void {
  // A failed or incomplete run must never leave prior evidence available to a
  // report or gate invocation.
  rmSync(OUTPUT, { force: true });

  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const run = spawnSync(
    pnpm,
    ["exec", "vitest", "run", "--config", "vitest.a11y.config.ts"],
    {
      cwd: ROOT,
      encoding: "utf8",
    },
  );
  const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;

  process.stdout.write(run.stdout ?? "");
  process.stderr.write(run.stderr ?? "");

  if (run.error) throw run.error;
  if (run.status !== 0) {
    process.exitCode = run.status ?? 1;
    return;
  }

  const artifact: AxeResultsArtifact = {
    schemaVersion: AXE_RESULTS_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    commitSha: currentCommitSha(),
    ciRunUrl: currentCiRunUrl(),
    browser: "chromium",
    results: collectResults(output),
  };
  const errors = validateAxeResultsArtifact(artifact);
  if (errors.length > 0) {
    throw new Error(
      `Invalid axe results from browser suite:\n- ${errors.join("\n- ")}`,
    );
  }

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  console.log(
    `✓ Wrote ${OUTPUT} from ${artifact.results.length} executed browser scans`,
  );
}

try {
  main();
} catch (error) {
  console.error(`✗ Unable to capture axe results: ${String(error)}`);
  process.exit(1);
}

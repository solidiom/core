#!/usr/bin/env node

import { pathToFileURL } from "node:url"

const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_CI_WAIT_MS = 20 * 60_000
const DEFAULT_CI_POLL_MS = 15_000
const NPM_WHOAMI_URL = "https://registry.npmjs.org/-/whoami"
const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4"
const REQUIRED_CI_CHECKS = ["CI / required", "Release qualification"]

export class PreflightError extends Error {
  constructor(message, category = "configuration") {
    super(message)
    this.name = "PreflightError"
    this.category = category
  }
}

export function parseBooleanFlag(value, name) {
  if (value === "true") return true
  if (value === "false") return false
  throw new PreflightError(`${name} must be "true" or "false" (received ${JSON.stringify(value)})`)
}

function requireSecret(env, name) {
  const value = env[name]?.trim()
  if (!value) throw new PreflightError(`${name} is required for this release target`)
  return value
}

export function validateReleaseEnvironment({
  packages,
  site,
  verifyCi = false,
  env = process.env,
}) {
  const config = { packages, site, verifyCi }

  if (!packages && !site && !verifyCi) {
    throw new PreflightError("release preflight requires a deployment target or CI verification")
  }

  if (packages) {
    config.npmToken = requireSecret(env, "NPM_TOKEN")
    config.registrySignKey = requireSecret(env, "REGISTRY_SIGN_KEY")
    if (!/^[0-9a-f]{64}$/i.test(config.registrySignKey)) {
      throw new PreflightError(
        "REGISTRY_SIGN_KEY must be a 32-byte Ed25519 private key encoded as 64 hex characters",
      )
    }
  }

  if (site) {
    config.cloudflareAccountId = requireSecret(env, "CLOUDFLARE_ACCOUNT_ID")
    config.cloudflareApiToken = requireSecret(env, "CLOUDFLARE_API_TOKEN")
  }

  if (verifyCi) {
    config.githubToken = requireSecret(env, "GITHUB_TOKEN")
    config.githubRepository = requireSecret(env, "GITHUB_REPOSITORY")
    config.githubSha = requireSecret(env, "GITHUB_SHA")
    if (!/^[0-9a-f]{40}$/i.test(config.githubSha)) {
      throw new PreflightError("GITHUB_SHA must be a full 40-character commit SHA")
    }
    if (!/^[^/]+\/[^/]+$/.test(config.githubRepository)) {
      throw new PreflightError("GITHUB_REPOSITORY must use the owner/repository form")
    }
  }

  return config
}

async function fetchJson(url, init, { fetchImpl, timeoutMs }) {
  let response
  try {
    response = await fetchImpl(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new PreflightError(`could not reach ${new URL(url).host}: ${detail}`, "infrastructure")
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // Authentication endpoints should return JSON. Keep the diagnostic generic
    // so an unexpected response can never echo a token or HTML body into logs.
  }

  return { response, body }
}

function cloudflareError(body) {
  const first = Array.isArray(body?.errors) ? body.errors[0] : undefined
  const code = first?.code ?? "unknown"
  const message = first?.message ?? "request was rejected"
  if (code === 9109)
    return `Cloudflare token is invalid or blocked by its IP allowlist (code ${code}: ${message})`
  if (code === 10000) {
    return `Cloudflare token cannot access Pages for this account (code ${code}: ${message}); grant Account → Cloudflare Pages → Edit and verify the account scope`
  }
  return `Cloudflare Pages authentication failed (code ${code}: ${message})`
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export async function waitForRequiredCi({
  config,
  fetchImpl,
  timeoutMs,
  waitMs = DEFAULT_CI_WAIT_MS,
  pollMs = DEFAULT_CI_POLL_MS,
  sleepImpl = delay,
}) {
  const deadline = Date.now() + waitMs
  const url = `https://api.github.com/repos/${config.githubRepository}/commits/${config.githubSha}/check-runs?per_page=100`

  while (true) {
    const { response, body } = await fetchJson(
      url,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${config.githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
      { fetchImpl, timeoutMs },
    )
    if (!response.ok || !Array.isArray(body?.check_runs)) {
      throw new PreflightError(
        `could not read exact-SHA CI checks from GitHub (HTTP ${response.status})`,
        response.status === 401 || response.status === 403 ? "authentication" : "infrastructure",
      )
    }

    const pending = []
    for (const name of REQUIRED_CI_CHECKS) {
      const runs = body.check_runs.filter((run) => run?.name === name)
      if (runs.some((run) => run.conclusion === "success")) continue
      if (runs.length > 0 && runs.every((run) => run.status === "completed")) {
        const conclusions = runs.map((run) => run.conclusion ?? "unknown").join(", ")
        throw new PreflightError(
          `${name} did not pass for ${config.githubSha.slice(0, 12)} (${conclusions})`,
          "qualification",
        )
      }
      pending.push(name)
    }

    if (pending.length === 0) return REQUIRED_CI_CHECKS
    if (Date.now() >= deadline) {
      throw new PreflightError(
        `timed out waiting for exact-SHA qualification: ${pending.join(", ")}`,
        "qualification",
      )
    }
    console.log(`Waiting for exact-SHA qualification: ${pending.join(", ")}`)
    await sleepImpl(Math.min(pollMs, Math.max(0, deadline - Date.now())))
  }
}

export async function runReleasePreflight({
  packages,
  site,
  verifyCi = false,
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  ciWaitMs = DEFAULT_CI_WAIT_MS,
  ciPollMs = DEFAULT_CI_POLL_MS,
  sleepImpl = delay,
}) {
  const config = validateReleaseEnvironment({ packages, site, verifyCi, env })
  const checks = []

  if (packages) {
    const { response, body } = await fetchJson(
      NPM_WHOAMI_URL,
      { headers: { Authorization: `Bearer ${config.npmToken}` } },
      { fetchImpl, timeoutMs },
    )
    if (!response.ok || typeof body?.username !== "string" || !body.username) {
      throw new PreflightError(
        `NPM_TOKEN authentication failed (HTTP ${response.status})`,
        "authentication",
      )
    }
    checks.push(`npm authentication (${body.username})`)
    checks.push("registry signing key format")
  }

  if (site) {
    const account = encodeURIComponent(config.cloudflareAccountId)
    const project = encodeURIComponent("solidiom-site")
    const { response, body } = await fetchJson(
      `${CLOUDFLARE_API_BASE}/accounts/${account}/pages/projects/${project}`,
      { headers: { Authorization: `Bearer ${config.cloudflareApiToken}` } },
      { fetchImpl, timeoutMs },
    )
    if (!response.ok || body?.success !== true) {
      throw new PreflightError(cloudflareError(body), "authentication")
    }
    checks.push("Cloudflare Pages project access")
  }

  if (verifyCi) {
    const qualifiedChecks = await waitForRequiredCi({
      config,
      fetchImpl,
      timeoutMs,
      waitMs: ciWaitMs,
      pollMs: ciPollMs,
      sleepImpl,
    })
    checks.push(...qualifiedChecks.map((name) => `exact-SHA ${name}`))
  }

  return checks
}

function parseArgs(argv) {
  const values = new Map(
    argv.map((arg) => {
      const [name, value] = arg.split("=", 2)
      return [name, value]
    }),
  )
  return {
    packages: parseBooleanFlag(values.get("--packages"), "--packages"),
    site: parseBooleanFlag(values.get("--site"), "--site"),
    verifyCi: parseBooleanFlag(values.get("--verify-ci"), "--verify-ci"),
  }
}

async function main() {
  try {
    const targets = parseArgs(process.argv.slice(2))
    const checks = await runReleasePreflight(targets)
    for (const check of checks) console.log(`✓ ${check}`)
    console.log(`Release preflight passed (${checks.length} checks).`)
  } catch (error) {
    const category = error instanceof PreflightError ? error.category : "unexpected"
    const message = error instanceof Error ? error.message : String(error)
    console.error(`::error title=Release preflight ${category} failure::${message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}

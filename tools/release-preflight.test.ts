import { describe, expect, it, vi } from "vitest"
import {
  PreflightError,
  parseBooleanFlag,
  runReleasePreflight,
  validateReleaseEnvironment,
  waitForRequiredCi,
} from "./release-preflight.mjs"

const packageEnv = {
  NPM_TOKEN: "npm-token",
  REGISTRY_SIGN_KEY: "ab".repeat(32),
}

const siteEnv = {
  CLOUDFLARE_ACCOUNT_ID: "account-id",
  CLOUDFLARE_API_TOKEN: "cloudflare-token",
}

describe("release preflight", () => {
  it("parses explicit workflow boolean outputs", () => {
    expect(parseBooleanFlag("true", "--packages")).toBe(true)
    expect(parseBooleanFlag("false", "--packages")).toBe(false)
    expect(() => parseBooleanFlag(undefined, "--packages")).toThrow(/must be "true" or "false"/)
  })

  it("requires target-specific secrets and a valid Ed25519 key", () => {
    expect(() => validateReleaseEnvironment({ packages: true, site: false, env: {} })).toThrow(
      /NPM_TOKEN/,
    )
    expect(() =>
      validateReleaseEnvironment({
        packages: true,
        site: false,
        env: { ...packageEnv, REGISTRY_SIGN_KEY: "not-a-key" },
      }),
    ).toThrow(/64 hex characters/)
    expect(() => validateReleaseEnvironment({ packages: false, site: true, env: {} })).toThrow(
      /CLOUDFLARE_ACCOUNT_ID/,
    )
  })

  it("allows a CI-only qualification wait without deployment credentials", () => {
    expect(
      validateReleaseEnvironment({
        packages: false,
        site: false,
        verifyCi: true,
        env: {
          GITHUB_TOKEN: "github-token",
          GITHUB_REPOSITORY: "solidiom/core",
          GITHUB_SHA: "a".repeat(40),
        },
      }),
    ).toMatchObject({ verifyCi: true, githubRepository: "solidiom/core" })
  })

  it("validates npm and Cloudflare access for a combined release", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ username: "solidiom" }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, result: { name: "solidiom-site" } }), {
          status: 200,
        }),
      )

    await expect(
      runReleasePreflight({
        packages: true,
        site: true,
        env: { ...packageEnv, ...siteEnv },
        fetchImpl,
      }),
    ).resolves.toEqual([
      "npm authentication (solidiom)",
      "registry signing key format",
      "Cloudflare Pages project access",
    ])

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "https://registry.npmjs.org/-/whoami",
      expect.objectContaining({
        headers: { Authorization: "Bearer npm-token" },
        signal: expect.any(AbortSignal),
      }),
    )
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "https://api.cloudflare.com/client/v4/accounts/account-id/pages/projects/solidiom-site",
      expect.objectContaining({
        headers: { Authorization: "Bearer cloudflare-token" },
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it("reports actionable Cloudflare permission failures without exposing the token", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          errors: [{ code: 10000, message: "Authentication error" }],
        }),
        { status: 403 },
      ),
    )

    const failure = runReleasePreflight({
      packages: false,
      site: true,
      env: siteEnv,
      fetchImpl,
    })
    await expect(failure).rejects.toMatchObject<Partial<PreflightError>>({
      category: "authentication",
    })
    await expect(failure).rejects.toThrow(/Cloudflare Pages → Edit/)
    await expect(failure).rejects.not.toThrow(/cloudflare-token/)
  })

  it("waits for both exact-SHA qualification checks", async () => {
    const config = {
      githubToken: "github-token",
      githubRepository: "solidiom/core",
      githubSha: "a".repeat(40),
    }
    const pending = {
      check_runs: [
        { name: "CI / required", status: "completed", conclusion: "success" },
        { name: "Release qualification", status: "in_progress", conclusion: null },
      ],
    }
    const complete = {
      check_runs: [
        { name: "CI / required", status: "completed", conclusion: "success" },
        { name: "Release qualification", status: "completed", conclusion: "success" },
      ],
    }
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(pending), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(complete), { status: 200 }))
    const sleepImpl = vi.fn().mockResolvedValue(undefined)

    await expect(
      waitForRequiredCi({
        config,
        fetchImpl,
        timeoutMs: 1_000,
        waitMs: 5_000,
        pollMs: 1,
        sleepImpl,
      }),
    ).resolves.toEqual(["CI / required", "Release qualification"])
    expect(sleepImpl).toHaveBeenCalledOnce()
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it("fails closed when exact-SHA qualification completed unsuccessfully", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          check_runs: [
            { name: "CI / required", status: "completed", conclusion: "failure" },
            { name: "Release qualification", status: "completed", conclusion: "success" },
          ],
        }),
        { status: 200 },
      ),
    )

    await expect(
      waitForRequiredCi({
        config: {
          githubToken: "github-token",
          githubRepository: "solidiom/core",
          githubSha: "b".repeat(40),
        },
        fetchImpl,
        timeoutMs: 1_000,
        waitMs: 1_000,
        pollMs: 1,
        sleepImpl: vi.fn(),
      }),
    ).rejects.toMatchObject({ category: "qualification" })
  })
  it("classifies unreachable services as infrastructure failures", async () => {
    const failure = runReleasePreflight({
      packages: true,
      site: false,
      env: packageEnv,
      fetchImpl: vi.fn().mockRejectedValue(new Error("network unavailable")),
    })

    await expect(failure).rejects.toMatchObject<Partial<PreflightError>>({
      category: "infrastructure",
    })
    await expect(failure).rejects.toThrow(/could not reach registry\.npmjs\.org/)
  })
})

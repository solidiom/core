---
id: ops-005-deployment-rehearsal
title: "OPS-005 — Production Deployment and Rollback Rehearsal"
doc_type: operations
audience: "Solidiom operations engineers"
tags: [operations, deployment, rehearsal, OPS-005]
lifecycle: current
date: 2026-08-07
---

# OPS-005 — Production Deployment and Rollback Rehearsal

**Task:** OPS-005
**Status:** Rehearsal
**Depends on:** OPS-004 (production operational configuration), OPS-003 (Cloudflare Pages deployment)
**Platform:** Cloudflare Pages
**Domain:** `https://solidiom.org`

This document defines the step-by-step procedure for deploying to production and rehearsing a rollback. Complete this rehearsal before the first public launch.

---

## 1. Pre-deployment Checklist

All items from OPS-004 must be verified before deploying. Use `docs/operations/production-checklist.md` as the master checklist. Here is the condensed pre-flight:

### DNS

- [ ] CNAME `solidiom.org` → `solidiom.pages.dev` (proxied, orange cloud ON).
- [ ] CNAME `www.solidiom.org` → `solidiom.pages.dev` (proxied).
- [ ] Propagation confirmed via `dig +short solidiom.org CNAME` and [whatsmydns.net](https://whatsmydns.net) across ≥ 8 resolvers.
- [ ] Cloudflare SSL mode set to **Full** or **Full (strict)**.

### Security Headers

- [ ] All headers present on `curl -I https://solidiom.org`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - `Content-Security-Policy` (see OPS-004 for full policy)
- [ ] CSP does not block PostHog (`connect-src 'self' https://*.posthog.com`).
- [ ] No CSP violations in browser console on key pages.

### Cache

- [ ] `/_astro/*` assets return `public, max-age=31536000, immutable`.
- [ ] `/fonts/*` assets return `public, max-age=31536000, immutable`.
- [ ] `/pagefind/*` assets return `public, max-age=86400, stale-while-revalidate=604800`.
- [ ] HTML pages do NOT carry `immutable`.

### Monitoring

- [ ] Cloudflare Analytics active (automatic with proxied DNS).
- [ ] PostHog receiving events (`POSTHOG_API_KEY` / `POSTHOG_HOST` configured).
- [ ] Budget enforcement passes: `pnpm --filter @solidiom/site budget-report:enforce`.

---

## 2. Deployment Steps

### Step 1 — Build Verification

Build the site locally to catch errors before pushing:

```bash
cd apps/site
pnpm build
```

The build runs:
1. `i18n:validate` — route parity, content collections, translation freshness.
2. `boundaries` — import boundary validation.
3. `astro build` — static site generation.

**Expected output:** Build directory at `apps/site/dist/`, no errors, no new warnings.
**Pass criterion:** Exit code 0, `dist/` contains HTML for both `/` and `/es/` locales.

> **Current status (2026-08-07):** Build fails with `[UNRESOLVED_IMPORT] Could not resolve '../../../../layouts/DocsLayout.astro'` in `src/pages/changelog/[slug]/index.astro`. The file exists at the resolved path. This is a rolldown (Astro 7) bundler resolution issue, not a missing file. **This is a blocker for production deployment.** Track separately; the rehearsal document remains valid as a procedure.

### Step 2 — Local Preview

After a successful build, start a local preview server:

```bash
pnpm preview
```

**Verify manually:**
- [ ] Homepage loads at `http://localhost:4321/`.
- [ ] Spanish homepage loads at `http://localhost:4321/es/`.
- [ ] Key documentation pages render.
- [ ] Search works (Pagefind index built at `dist/pagefind/`).
- [ ] No console errors in browser DevTools.

### Step 3 — Smoke Tests

Run the E2E test suite against the local preview:

```bash
pnpm test:e2e
```

**Pass criterion:** All tests pass, 0 failures.

> **Current status (2026-08-07):** E2E tests cannot run because the Playwright webServer (which starts `astro preview`) fails with the same build error as Step 1. Tests are blocked until the build issue is resolved.

Additionally, run the budget enforcement check:

```bash
pnpm budget-report:enforce
```

### Step 4 — Deploy

#### Option A: GitHub Actions (recommended)

Push to the `main` branch. The production deployment workflow triggers automatically:

```bash
git push origin main
```

Monitor the workflow run at `.github/workflows/preview-deploy.yml` (or the dedicated production workflow). The workflow:
1. Installs dependencies.
2. Runs `pnpm exec nx run @solidiom/site:build`.
3. Runs `pnpm exec nx run @solidiom/site:search-index`.
4. Deploys via `wrangler pages deploy`.
5. Runs `tools/verify-preview-deployment.ts` against the deployment URL.

#### Option B: Manual deploy

```bash
# Build and index
pnpm exec nx run @solidiom/site:build
pnpm exec nx run @solidiom/site:search-index

# Deploy
wrangler pages deploy apps/site/dist --project-name=solidiom-site
```

Or with the full build command matching the Cloudflare Pages configuration:

```bash
pnpm exec nx run @solidiom/site:build && pnpm exec nx run @solidiom/site:search-index && wrangler pages deploy apps/site/dist --project-name=solidiom-site
```

### Step 5 — Post-deploy Verification

After deployment, verify the live site:

1. **Key routes:**
   - [ ] `https://solidiom.org/` returns 200.
   - [ ] `https://solidiom.org/es/` returns 200.
   - [ ] `https://solidiom.org/primitives/button/` returns 200.
   - [ ] `https://solidiom.org/es/primitives/button/` returns 200.

2. **Headers:**
   ```bash
   curl -I https://solidiom.org
   ```
   Verify all security headers present (X-Frame-Options, X-Content-Type-Options, CSP, etc.).

3. **Cache directives:**
   ```bash
   curl -I https://solidiom.org/_astro/[any-asset]  # should have immutable
   curl -I https://solidiom.org/pagefind/[any-file]  # should have max-age=86400
   ```

4. **Redirects:**
   ```bash
   curl -I https://www.solidiom.org/  # should 301 to https://solidiom.org/
   curl -I http://solidiom.org/       # should 301 to https://solidiom.org/
   ```

5. **Search:**
   - [ ] Pagefind index accessible at `https://solidiom.org/pagefind/`.
   - [ ] Site search returns results.

6. **Analytics:**
   - [ ] PostHog dashboard receives events within 5 minutes.

---

## 3. Rollback Rehearsal

This section simulates a rollback scenario. Perform this rehearsal after a successful deployment to verify the rollback procedure works.

### Scenario: A bad deployment reaches production

A deployment was pushed that introduced a critical bug (e.g., homepage returns 500, CSP blocks all scripts, wrong content is live).

### Step 1 — Identify the Bad Deployment

1. Check Cloudflare Analytics for 5xx spike.
2. Check PostHog for client-side error spike.
3. Correlate with deployment timestamp in Cloudflare Dashboard → Pages → solidiom-site → Deployments.
4. Identify the git commit SHA of the bad deployment and the SHA of the last known-good deployment.

### Step 2 — Roll Back

#### Via Cloudflare Dashboard (fastest)

1. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → solidiom-site → Deployments.
2. Find the last known-good deployment (by SHA or timestamp).
3. Click **"Rollback to this deploy"**.
4. Confirm — the rollback is atomic and instant.

#### Via Wrangler CLI

```bash
# List recent deployments to find the good one
wrangler pages deployment list --project-name=solidiom-site

# Rollback to a specific deployment ID
wrangler pages deployment rollback <DEPLOYMENT_ID> --project-name=solidiom-site
```

#### Via API

```bash
# List recent deployments
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom-site/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Restore a specific deployment
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom-site/versions/$DEPLOYMENT_ID/restore" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Step 3 — Verify the Rollback

Immediately after rollback:

1. **Check key routes:**
   ```bash
   curl -o /dev/null -s -w "%{http_code}" https://solidiom.org/        # expect 200
   curl -o /dev/null -s -w "%{http_code}" https://solidiom.org/es/     # expect 200
   ```

2. **Verify correct version is served** by checking for content that existed in the known-good version.

3. **Verify headers are intact** — same check as post-deploy verification.

### Step 4 — Rollback Timeline and RTO

| Phase | Target | Notes |
| --- | --- | --- |
| Detect bad deployment | < 5 min | Via monitoring alert or user report |
| Identify good deployment | < 2 min | Dashboard or CLI list |
| Execute rollback | < 1 min | Atomic on Cloudflare Pages |
| Verify rollback | < 3 min | Automated curl checks + manual spot-check |
| **Total RTO** | **< 10 min** | Recovery Time Objective |

Cloudflare Pages rollback is instant (no rebuild, no DNS propagation). The RTO is dominated by detection time, not rollback execution.

---

## 4. Post-rollback Follow-up

1. **Document the incident:** Open a GitHub Issue with:
   - What broke and how it was detected.
   - Deployment SHA rolled back from and to.
   - Root cause (if known) or "investigation pending".
   - Time from detection to rollback complete.

2. **Fix and redeploy:** Once the fix is ready, follow the deployment steps again. Do not rush — a second rollback indicates a deeper process issue.

3. **Security incidents:** If the bad deployment introduced a security vulnerability, follow `SECURITY.md` procedures in addition to the rollback.

---

## 5. Runbook: Common Deployment Issues

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Build fails with `UNRESOLVED_IMPORT` for existing file | Rolldown (Astro 7) bundler resolution bug | Check Astro issue tracker; workaround may involve import path adjustment or Astro config tweak |
| Security headers missing on production | `_headers` file not in build output | Verify `apps/site/public/_headers` is committed; Cloudflare Pages copies `public/` to build output |
| `www.solidiom.org` not redirecting | `_redirects` not in build output or misconfigured | Verify `apps/site/public/_redirects` has the www→apex rule |
| Search not working | Pagefind index not built | Run `pnpm search-index` and redeploy; verify `/pagefind/` is accessible |
| CSP blocking resources | CSP policy too restrictive for a route | Adjust `_headers` CSP; tool routes may need route-specific relaxation |
| PostHog not receiving events | Env vars not configured | Verify `POSTHOG_API_KEY` and `POSTHOG_HOST` in Cloudflare Pages settings |
| Edge cache serving stale HTML | Cache not purged on deploy | Cloudflare Pages purges automatically; if stale, manually purge via dashboard or API |
| Spanish locale returning 404 | i18n build misconfiguration | Check that `src/content/es/` has entries and Astro i18n routing is configured |
| Budget enforcement failing in CI | Route payload exceeded budget | Run `pnpm budget-report:enforce` locally, identify overweight route, reduce payload |

---

## 6. Build and E2E Verification Results

### Build (2026-08-07)

| Check | Result |
| --- | --- |
| Command | `pnpm --filter @solidiom/site run build` |
| Duration | ~5.8s |
| Status | **FAILED** |
| Error | `[UNRESOLVED_IMPORT] Could not resolve '../../../../layouts/DocsLayout.astro'` in `src/pages/changelog/[slug]/index.astro` |
| Root cause | Rolldown (Astro 7's default bundler) cannot resolve the `.astro` import despite the file existing at `src/layouts/DocsLayout.astro`. This is a bundler resolution issue, not a missing file. |
| Blocker | **Yes** — prevents both build and E2E tests. |

### E2E Tests (2026-08-07)

| Check | Result |
| --- | --- |
| Command | `pnpm --filter @solidiom/site run test:e2e` |
| Status | **FAILED** (webServer unable to start) |
| Error | Same `UNRESOLVED_IMPORT` error prevents Playwright webServer from launching the preview. |
| Pass/Fail counts | N/A — suite did not execute. |

---

## 7. Sign-off

This section is completed after a successful rehearsal with all steps passing.

### Pre-deployment Checklist

| Checker | Date | DNS | Headers | Cache | Monitoring | Result |
| --- | --- | --- | --- | --- | --- | --- |
| | | ☐ | ☐ | ☐ | ☐ | ☐ Pass ☐ Block |

### Deployment Execution

| Step | Result | Notes |
| --- | --- | --- |
| Build verification | ☐ Pass ☐ Fail | |
| Local preview | ☐ Pass ☐ Fail | |
| Smoke tests | ☐ Pass ☐ Fail | |
| Deploy | ☐ Pass ☐ Fail | |
| Post-deploy verification | ☐ Pass ☐ Fail | |

### Rollback Rehearsal

| Step | Result | Time |
| --- | --- | --- |
| Identify bad deployment | ☐ Done | |
| Execute rollback | ☐ Done | |
| Verify rollback | ☐ Done | |
| Total RTO | | Target: < 10 min |

### Approvals

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Deployer | | | |
| Reviewer | | | |
| Approver | | | |

---

## References

- OPS-004 production checklist: `docs/operations/production-checklist.md`
- Rollback procedure: `docs/operations/rollback-procedure.md`
- Deployment guide: `docs/guides/deployment.md`
- Cloudflare Pages config: `apps/site/wrangler.toml`
- Headers: `apps/site/public/_headers`
- Redirects: `apps/site/public/_redirects`
- Astro config: `apps/site/astro.config.ts`
